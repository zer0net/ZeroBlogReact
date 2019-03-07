import React from 'react';
import ZeroNetReducer,{ZeroNetReducerInitialState} from './reducers/zeronet-reducer.js';
import AppReducer,{AppReducerInitialState} from './reducers/app-reducer.js';
import ViewReducer,{ViewReducerInitialState} from './reducers/view-reducer.js';
import PostReducer,{PostReducerInitialState} from './reducers/post-reducer.js';
import CommentReducer,{CommentReducerInitialState} from './reducers/comment-reducer.js';

export const Context = React.createContext();
const Provider = Context.Provider;

const StoreContextProvider = (props) => {
  const [zeroNetState,zeroNetDispatch] = React.useReducer(ZeroNetReducer,ZeroNetReducerInitialState);
  const [appState, appDispatch] = React.useReducer(AppReducer,AppReducerInitialState);
  const [viewState, viewDispatch] = React.useReducer(ViewReducer,ViewReducerInitialState);
  const [postState, postDispatch] = React.useReducer(PostReducer,PostReducerInitialState);
  const [commentState, commentDispatch] = React.useReducer(CommentReducer,CommentReducerInitialState);

  return(
    <Provider {...props} value={{
      zeroNetState,zeroNetDispatch,
      appState,appDispatch,
      viewState,viewDispatch,
      postState, postDispatch,
      commentState, commentDispatch
    }}/>
  )
}

export default StoreContextProvider;
