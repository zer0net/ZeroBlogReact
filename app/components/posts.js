import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {DateHelper, GenerateIsLikedByUserQuery} from '../helpers.js';
import CommentsContainer from './comments.js';
import {Loading,TextEditor,AdminItemToolBar} from './partials.js';

export function PostsList(){

  const {postState} = React.useContext(Context);

  let postListDisplay;
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

  return (
    <div id="posts-list-container">
      {postListDisplay}
    </div>
  );
}

const PostItem = (props) => {

  const {
    zeroNetState,
    postDispatch
  } = React.useContext(Context);

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

export function Post(props) {

  const {zeroNetState,postState} = React.useContext(Context);

  let post;
  if (props.post){ post = props.post}
  else { post = postState.post }

  function onAddPostLike(){
    let addPostLikeAction = {type:'ADD_POST_LIKE'}
    if (props.post) addPostLikeAction.postId = post.post_id
    postDispatch(addPostLikeAction);
  }

  function onRemovePostLike(){
    let removePostLikeAction = {type:'REMOVE_POST_LIKE'}
    if (props.post) removePostLikeAction.postId = post.post_id
    postDispatch(removePostLikeAction);
  }

  let commentsDisplay;
  if (postState.post){
    commentsDisplay = <CommentsContainer post={post} />
  }

  let adminItemToolBar;
  if (zeroNetState.site_info.settings.own){
    adminItemToolBar = <AdminItemToolBar post={post}/>
  }

  return (
    <div className="post" id={"post-"+post.post_id}>
      <PostHeader
        post={post}
        onAddPostLike={onAddPostLike}
        onRemovePostLike={onRemovePostLike}
      />
      {adminItemToolBar}
      <article dangerouslySetInnerHTML={{__html: post.post_body }}></article>
      {commentsDisplay}
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
      const likeIndex = data.like.findIndex((l) => l.like_id === like.like_id);
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

  let postTitle = "", postBody = "", buttonDisplay
  if (!postState.loading){
    postTitle = postState.form.title;
    postBody = postState.form.body;
    if (postTitle.length > 0 && postBody.length > 0){
      buttonDisplay = (
        <a onClick={onCreatePost} className="btn btn-default">create post</a>
      );
    }
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
      {buttonDisplay}
    </div>
  )
}
