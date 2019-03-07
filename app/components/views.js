import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {PostsList,Post,PostForm} from '../components/posts.js';
import {Loading,AdminMenu} from '../components/partials.js';
import {GeneratePostsQuery} from '../helpers.js';

function ViewContainer(){
  const {zeroNetState,appState} = React.useContext(Context);

  let viewDisplay = <MainView/>;
  if (appState.route.view === 'post'){ viewDisplay = <PostView /> }
  else if (appState.route.view === 'create-post'){ viewDisplay = <CreatePostView /> }
  else if (appState.route.view === 'edit-post'){ viewDisplay = <EditPostView /> }
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

  const {
    postState,postDispatch
  } = React.useContext(Context);

  React.useEffect(() => {
    const query = GeneratePostsQuery();
    window.Page.cmd("dbQuery",[query],function(res){
      postDispatch({type:'SET_POSTS',posts:res});
    });
  },[])

  let mainViewDisplay = ( <Loading/>);
  if (!postState.loading){
    mainViewDisplay = (
      <PostsList />
    )
  }

  return (
    <div id="main-view">
      {mainViewDisplay}
    </div>
  )
}

function PostView(){

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

  let postViewDisplay = <Loading/>
  if (!postState.loading){
    postViewDisplay = <Post/>
  }

  return (
    <div id="post-view">
      {postViewDisplay}
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

function EditPostView(){
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
