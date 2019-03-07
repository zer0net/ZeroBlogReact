import React from 'react';
import ReactDOM from 'react-dom';
import {Context} from '../context-provider.js';
import {LatestComments} from './comments.js';
import Avatars from '@dicebear/avatars';
import GridySprites from '@dicebear/avatars-gridy-sprites';
import JdenticonSprites from '@dicebear/avatars-jdenticon-sprites';

function SideBar(){
  return (
    <aside>
      <BlogInfo/>
      <MainMenu/>
      <LatestComments/>
    </aside>
  );
}

function BlogInfo(){

  // context
  const {
    zeroNetState,zeroNetDispatch,
    appState,appDispatch
  } = React.useContext(Context);

  function toggleUserSiteFollow(){
    console.log(zeroNetState);
    /*
    followNewTopics(){
      let params;
      const query = followHelpers.generateFollowNewTopicsQuery();
      const feed = [query,params];
      const feedFollow = Object.assign({},store.getState().feed,{});
      feedFollow['New topics'] = feed;
      Page.cmd("feedFollow",[feedFollow]);
      Page.cmd('feedListFollow', [], function(feed){
        store.dispatch(setFeedListFollow(feed));
        this.setState({followed:true});
      }.bind(this));
    }
    */    
  }

  let options = {};
  let avatars = new Avatars(JdenticonSprites(options));
  let svg = avatars.create(zeroNetState.site_info.address);

  return (
    <div id="blog-info-section">
      <figure id="blog-image" dangerouslySetInnerHTML={{__html: svg}}>
      </figure>
      <h1><a href={"/"+zeroNetState.site_info.address}>{zeroNetState.site_info.content.title}</a></h1>
      <div id="blog-description">{zeroNetState.site_info.content.description}</div>
      <div id="following-button-container">
        <a onClick={toggleUserSiteFollow} className="btn btn-default">FOLLOW_ICON following status</a>
      </div>
    </div>
  );
}

function MainMenu(){
  return (
    <div id="main-menu">
      <ul>
        <li><a href="#">menu item bla</a></li>
        <li><a href="#">menu item bla</a></li>
        <li><a href="#">menu item bla</a></li>
        <li><a href="#">menu item bla</a></li>
        <li><a href="#">menu item bla</a></li>
        <li><a href="#">menu item bla</a></li>
      </ul>
    </div>
  );
}

export default SideBar;
