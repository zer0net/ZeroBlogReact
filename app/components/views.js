import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {PostsList,Post,PostForm} from '../components/posts.js';
import {AdminMenu} from '../components/partials.js'

function ViewContainer(){
  const {zeroNetState,appState} = React.useContext(Context);

  let viewDisplay = <MainView/>;
  if (appState.route.view === 'post'){ viewDisplay = <PostView /> }
  else if (appState.route.view === 'create_post'){ viewDisplay = <CreatePostView /> }
  else if (appState.route.view === 'settings'){ viewDisplay = <SettingsView />}
  let adminMenuDisplay;
  if (zeroNetState.site_info.settings.own) adminMenuDisplay = <AdminMenu/>
  return (
    <div id="view-container">
      {adminMenuDisplay}
      {viewDisplay}
    </div>
  );
}

function MainView(){
  return (
    <div id="main-view">
      <p>this is the main view</p>
      <PostsList/>
    </div>
  )
}

function PostView(){
  return (
    <div id="post-view">
      <Post/>
    </div>
  );
}

function CreatePostView(){
  return (
    <div id="create-post-view">
      <p>this is dat create post view</p>
      <PostForm/>
    </div>
  )
}

function SettingsView(){
  return (
    <div id="settings-view">
      <p>settings view</p>
    </div>
  )
}

export default ViewContainer;
