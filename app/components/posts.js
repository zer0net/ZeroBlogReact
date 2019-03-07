import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {DateHelper, GeneratePostsQuery, GenerateIsLikedByUserQuery} from '../helpers.js';
import CommentsContainer from './comments.js';
import {Loading,TextEditor} from './partials.js';

export function PostsList(){

  const {
    postState,postDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const query = GeneratePostsQuery();
    window.Page.cmd("dbQuery",[query],function(res){
      postDispatch({type:'SET_POSTS',posts:res});
    });
  },[])

  let postListDisplay = ( <Loading/>);
  if (!postState.loading){
    if (postState.posts){
      const postList = postState.posts.map((p,index) => (
        <PostItem
          key={index}
          post={p}
        />
      ));
      postListDisplay = (
        <div id="posts-list">
          {postList}
        </div>
      );
    } else {
      postListDisplay = (
        <div id="no-posts">
          <h2>Congratulations</h2>
          <p>Your zeronet blog has been successfully created!</p>
        </div>
      );
    }
  }

  return (
    <div id="posts-list-container">
      {postListDisplay}
    </div>
  );
}

const PostItem = (props) => {

  const {postDispatch} = React.useContext(Context);

  const post = props.post;

  function onAddPostLike(){
    postDispatch({type:'ADD_POST_LIKE',postId:post.post_id});
  }

  function onRemovePostLike(){
    postDispatch({type:'REMOVE_POST_LIKE',postId:post.post_id});
  }

  return (
    <div className="post-item" id={"post-"+post.post_id}>
      <PostHeader
        post={post}
        onAddPostLike={onAddPostLike}
        onRemovePostLike={onRemovePostLike}
      />
      <article dangerouslySetInnerHTML={{__html: post.post_body }}></article>
    </div>
  )
}

export function Post() {

  const {
    appState,
    postState,postDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const query = GeneratePostsQuery(appState.route.id)
    window.Page.cmd('dbQuery',[query],function(res){
      postDispatch({type:'SET_POST',post:res[0]})
    });
  },[])

  function onAddPostLike(){
    postDispatch({type:'ADD_POST_LIKE'});
  }

  function onRemovePostLike(){
    postDispatch({type:'REMOVE_POST_LIKE'});
  }

  let postViewDisplay = <Loading/>
  if (!postState.loading){
    const post = postState.post;
    postViewDisplay = (
      <div className="post-container">

        <PostHeader
          post={post}
          onAddPostLike={onAddPostLike}
          onRemovePostLike={onRemovePostLike}
        />
        <article dangerouslySetInnerHTML={{__html: post.post_body }}></article>
        <CommentsContainer post={post} />
      </div>
    )
  }

  return (
    <div className="post" id={"post-"+appState.route.id}>
      {postViewDisplay}
    </div>
  );
}

const PostHeader = (props) => {

  const { zeroNetState  } = React.useContext(Context);

  const post = props.post;

  function togglePostLike(){
    const query = GenerateIsLikedByUserQuery(post.post_id,zeroNetState.site_info.cert_user_id)
    window.Page.cmd('dbQuery',[query],function(res){
      if (res.length > 0){
        deletePostLike(res);
      } else {
        createPostLike()
      }
    });
  }

  function createPostLike(){

    const inner_path = "data/users/"+zeroNetState.site_info.auth_address;
    window.Page.cmd('fileGet',{
      inner_path:inner_path + "/data.json",
      required:false
    },function(data){

      data = JSON.parse(data);
      if (data){
        if (!data.like){
          data.like = [];
          data.next_like_id = 1;
        }
      } else {
        data = {
          "like":[],
          "next_like_id":1
        }
      }

      const like = {
        like_id:zeroNetState.site_info.auth_address+"_like_"+data.next_like_id,
        like_post_id:post.post_id,
        like_user_id:zeroNetState.site_info.cert_user_id,
        like_date_added:Date.now()
      }

      data.like.push(like);
      data.next_like_id += 1;

      const json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
      window.Page.cmd("fileWrite", [inner_path  + "/data.json", btoa(json_raw)], function(res) {
        window.Page.cmd("sitePublish",{"inner_path":inner_path  + "/data.json"}, function(res) {
          props.onAddPostLike();
        });
      });
    });
  }

  function deletePostLike(like){

    const inner_path = "data/users/"+zeroNetState.site_info.auth_address;
    window.Page.cmd('fileGet',{
      inner_path:inner_path + "/data.json",
      required:false
    },function(data){
      data = JSON.parse(data);
      let likeIndex;
      data.like.forEach(function(l,index){ if (l.like_id === like.like_id){ likeIndex = index } });
      data.like.splice(likeIndex,1);
      const json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
      window.Page.cmd("fileWrite", [inner_path  + "/data.json", btoa(json_raw)], function(res) {
        window.Page.cmd("sitePublish",{"inner_path":inner_path  + "/data.json"}, function(res) {
          props.onRemovePostLike();
        });
      });
    });
  }

  let commentCount = "0", likeCount = "0";
  if (post.comment_count) commentCount = post.comment_count;
  if (post.like_count) likeCount = post.like_count;

  return (
    <div className="post-header">
      <h2><a href={"index.html?view:post+id:"+post.post_id}>{post.post_title}</a></h2>
      <div className="post-subheader">
        <span>on {DateHelper(post.post_date_added)} </span>
        <span>COMMENT_ICON {commentCount} comments </span>
        <span><a onClick={togglePostLike}>HEART_ICON</a> {likeCount}</span>
      </div>
    </div>
  )
}

export function PostForm(props){

  const {
    zeroNetState,
    viewState,viewDispatch,
    postState,postDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const form = {
      title:'',
      body:'',
    }
    postDispatch({type:'INIT_CREATE_POST_VIEW',form:form});
  },[])

  function onPostTitleChange(e){
    postDispatch({type:'UPDATE_POST_TITLE',title:e.target.value})
  }

  function onPostBodyChange(body){
    postDispatch({type:'UPDATE_POST_BODY',body:body})
  }

  function onCreatePost(){
    const inner_path = "data/users/"+zeroNetState.site_info.auth_address;
    window.Page.cmd('fileGet',{
      inner_path:inner_path + "/data.json",
      required:false
    },function(data){

      data = JSON.parse(data);
      if (data){
        if (!data.post){
          data.post = [];
          data.next_post_id = 1;
        }
      } else {
        data = {
          "post":[],
          "next_post_id":1
        }
      }

      const post = {
        post_id:zeroNetState.site_info.auth_address+"_post_"+data.next_post_id,
        post_title:postState.form.title,
        post_body:postState.form.body,
        post_date_added:Date.now()
      }

      data.post.push(post);
      data.next_post_id += 1;

      const json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
      window.Page.cmd("fileWrite", [inner_path  + "/data.json", btoa(json_raw)], function(res) {
        window.Page.cmd("sitePublish",{"inner_path":inner_path  + "/data.json"}, function(res) {
          window.top.location.href = "index.html?view:post+id:"+post.post_id
        });
      });
    });

  }

  let postTitle = "", postBody = "";
  if (!postState.loading){
    postTitle = postState.form.title;
    postBody = postState.form.body;
  }

  return (
    <div id="create-post-form">
      <input
        type="text"
        value={postTitle}
        onChange={(e) => onPostTitleChange(e)}/>
        <TextEditor
          content={postBody}
          onTextChange={onPostBodyChange}
        />
      <a onClick={onCreatePost} className="btn btn-default">create post</a>
    </div>
  )
}
