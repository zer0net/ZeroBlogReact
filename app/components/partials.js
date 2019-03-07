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
        <li><a href="index.html?view:create_post">Create New Post</a></li>
        <li><a href="index.html?view:settings">settings</a></li>
      </ul>
    </div>
  );
}

export const TextEditor = (props) => {

  function onTextChange(editor){
    const data = editor.getData();
    console.log( data);
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
