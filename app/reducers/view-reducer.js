export const ViewReducerInitialState = {
  loading:true,
  data:null,
  form:null
}

function ViewReducer(state,action){
  switch(action.type){
    /** POSTS **/
    // post view
    // create / edit post actions

    /** COMMENTS **/
    // comment list
    case 'SET_COMMENTS':{
      const d = {... state.data,comments:action.comments}
      return {... state,data:d,loading:false}
    }
    // add comment to thread
    case 'ADD_COMMENT_TO_THREAD':{
      const comments = [action.comment, ... state.data.comments]
      const d = {... state.data, comments}
      return {... state, data:d}
    }
    // latest comments
    case 'SET_LATEST_COMMENTS':{
      const d = {... state.data, latest_comments:action.latest_comments}
      return { ... state, data:d}
    }
    // create / edit comment actions
    case 'INIT_CREATE_COMMENT_VIEW':{
      return {... state,form:action.form,loading:false}
    }
    case 'UPDATE_COMMENT_BODY':{
      const form = {... state.form,body:action.body}
      return {... state,form:form}
    }
    default:{
      return state;
    }
  }
}

export default ViewReducer;
