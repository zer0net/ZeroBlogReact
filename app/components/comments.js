import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {DateHelper, GeneratePostCommentListQuery, GenerateLatestCommentsQuery} from '../helpers.js';
import {Loading,TextEditor} from './partials.js';
import Avatars from '@dicebear/avatars';
import GridySprites from '@dicebear/avatars-gridy-sprites';

function CommentsContainer() {
  return (
    <div id="comments-container">
      <CommentForm/>
      <CommentList/>
    </div>
  )
}

function CommentForm() {

  const {
    zeroNetState,
    appState,
    commentState,commentDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const form = {
      body:''
    }
    commentDispatch({type:'INIT_CREATE_COMMENT_VIEW',form:form});
  },[])

  function onCommentBodyChange(body){
    commentDispatch({type:'UPDATE_COMMENT_BODY',body:body})
  }

  function onCreateComment(){
    console.log(commentState.form.body)
    const inner_path = "data/users/"+zeroNetState.site_info.auth_address;
    window.Page.cmd('fileGet',{
      inner_path:inner_path + "/data.json",
      required:false
    },function(data){

      data = JSON.parse(data);
      if (data){
        if (!data.comment){
          data.comment = [];
          data.next_comment_id = 1;
        }
      } else {
        data = {
          "comment":[],
          "next_comment_id":1
        }
      }

      const comment = {
        comment_id:zeroNetState.site_info.auth_address+"_comment_"+data.next_comment_id,
        comment_post_id:appState.route.id,
        comment_user_id:zeroNetState.site_info.cert_user_id,
        comment_body:commentState.form.body,
        comment_date_added:Date.now()
      }

      data.comment.push(comment);
      data.next_comment_id += 1;

      const json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
      window.Page.cmd("fileWrite", [inner_path  + "/data.json", btoa(json_raw)], function(res) {
        window.Page.cmd("sitePublish",{"inner_path":inner_path  + "/data.json"}, function(res) {
          commentDispatch({type:'ADD_COMMENT_TO_THREAD',comment:comment})
        });
      });
    });
  }

  let commentBody;
  if (!commentState.loading && commentState.form){
    commentBody = commentState.form.body;
  }

  return (
    <div className="comment-form">
      <TextEditor
        content={commentBody}
        onTextChange={(e) => onCommentBodyChange(e)}
      />
      <a onClick={onCreateComment} className="btn btn-default">Comment</a>
    </div>
  )
}

function CommentList() {

  const {
    appState,
    viewState, viewDispatch,
    commentState, commentDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const query = GeneratePostCommentListQuery(appState.route.id);
    window.Page.cmd('dbQuery',[query],function(res){
      commentDispatch({type:'SET_COMMENTS',comments:res})
    });
  },[])

  let commentListDisplay = <Loading/>
  if (!commentState.loading){
    if (commentState.comments){
      commentListDisplay = commentState.comments.map((c,index) => (
        <CommentListItem
          key={index}
          comment={c}
        />
      ));
    }
  }

  return (
    <div id="comment-list">
      {commentListDisplay}
    </div>
  )
}

const CommentListItem = (props) => {
  const c = props.comment;
  let options = {colorful:true};
  let avatars = new Avatars(GridySprites(options));
  let svg = avatars.create(c.comment_user_id);
  return (
    <div className="comment-list-item">
      <div className="comment-item-avatar">
        <figure style={{"width":"30px","margin":"0"}} dangerouslySetInnerHTML={{__html: svg}}></figure>
      </div>
      <div className="comment-item-content">
        <div className="comment-item-header">
          on {DateHelper(c.comment_date_added)} by {c.comment_user_id}
        </div>
        <div className="comment-item-body">
          <div dangerouslySetInnerHTML={{__html: c.comment_body}}></div>
        </div>
      </div>
    </div>
  )
}

export function LatestComments() {

  const {
    appState,
    commentState,commentDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const query = GenerateLatestCommentsQuery();
    window.Page.cmd('dbQuery',[query],function(res){
      commentDispatch({type:'SET_LATEST_COMMENTS',latest_comments:res})
    });
  },[])

  let latestCommentsDisplay;
  if (commentState.latest_comments){
    latestCommentsDisplay = commentState.latest_comments.map((lc,index) =>  (
      <CommentListItem
        key={index}
        comment={lc}
      />
    ));
  }

  return (
    <div className="latest-comments">
      <h2>Latest Comments</h2>
      {latestCommentsDisplay}
    </div>
  )
}

export default CommentsContainer;
