import React from 'react';
import ReactDOM from 'react-dom';
import StoreContextProvider,{Context} from './context-provider.js';
import {RouteHelper} from './helpers.js';
import {Loading} from './components/partials.js';
import ViewContainer from './components/views.js';
import SideBar from './components/sidebar.js';

function App(){

  /** Component **/

  // context
  const {
    zeroNetState,zeroNetDispatch,
    appState,appDispatch
  } = React.useContext(Context);

  // component did mount
  React.useEffect(() => {
    // siteInfo
    window.Page.cmd('siteInfo', {}, function(site_info) {
      zeroNetDispatch({type:'SET_SITE_INFO',site_info});
      // serverInfo
      window.Page.cmd('serverInfo', {},function(server_info){
        zeroNetDispatch({type:'SET_SERVER_INFO',server_info});
        // get user feed
        window.Page.cmd('feedListFollow',[],function(user_feed){
          console.log(user_feed);
          zeroNetDispatch({type:'SET_USER_FEED',user_feed})
          // get config.json
          window.Page.cmd('fileGet',{'inner_path':'data/config.json'},function(res){
            appDispatch({type:'SET_CONFIG',config:JSON.parse(res)});
            // zeronet ready
            zeroNetDispatch({type:'SET_READY'});
          });
        });
      });
    });
  },[]);

  // on zeronet ready
  React.useEffect(() => {
    if (zeroNetState.ready){
      const route = RouteHelper(window.location.href,zeroNetState.site_info.address);
      appDispatch({type:'SET_ROUTE',route:route});
      appDispatch({type:'FINISH_LOADING_SITE'});
    }
  },[zeroNetState]);

  /** Render **/

  // app display
  let appDisplay = <Loading/>
  if (!appState.loading){
    appDisplay = (
      <main id="main-container" className="flex-container">
        <SideBar/>
        <ViewContainer/>
      </main>
    )
  }

  return (
    <main id="main">
      {appDisplay}
    </main>
  )
}

function AppContainer(){
  return (
    <StoreContextProvider>
      <App/>
    </StoreContextProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<AppContainer />, rootElement);
