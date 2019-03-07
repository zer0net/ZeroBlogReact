import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const Loading = (props) => {
  return (
    <div className="loading-container">
      Loading...
    </div>
  )
}

export function AdminMenu(){
  return (
    <div id="admin-menu">
      <ul>
        <li><a href="index.html?view:create-post">Create New Post</a></li>
        <li><a href="index.html?view:settings">settings</a></li>
      </ul>
    </div>
  );
}

export function AdminItemToolBar(props){

  const { zeroNetState } = React.useContext(Context);
  const post = props.post;

  function onPostDelete(){
    const inner_path = "data/users/"+zeroNetState.site_info.auth_address;
    window.Page.cmd('fileGet',{inner_path:inner_path + "/data.json"},function(data){
      data = JSON.parse(data);
      const postIndex = data.post.findIndex((p) => p.post_id === post.post_id);
      data.post.splice(postIndex,1);
      const json_raw = unescape(encodeURIComponent(JSON.stringify(data, void 0, '\t')));
      window.Page.cmd("fileWrite", [inner_path  + "/data.json", btoa(json_raw)], function(res) {
        window.Page.cmd("sitePublish",{"inner_path":inner_path  + "/data.json"}, function(res) {
          window.top.location.href = "index.html";
        });
      });
    });
  }

  return (
    <ul>
      <li><a href={"index.html?view:edit-post+id:"+post.post_id}>Edit</a></li>
      <li><a onClick={onPostDelete}>Delete</a></li>
    </ul>
  );
}

export const TextEditor = (props) => {

  function onTextChange(editor){
    const data = editor.getData();
    props.onTextChange(data);
  }

  return (
    <CKEditor
      editor={ ClassicEditor }
      data={props.content}
      onChange={ ( event, editor ) => onTextChange(editor) }
    />
  )
}
