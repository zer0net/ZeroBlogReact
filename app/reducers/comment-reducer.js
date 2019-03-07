export const CommentReducerInitialState = {
  loading:true,
  comment:null,
  comments:null,
  latest_comments:null,
  form:null
}

function CommentReducer(state,action){
  switch(action.type){
    case 'SET_COMMENTS':{
      return {... state,comments:action.comments,loading:false}
    }
    case 'SET_LATEST_COMMENTS':{
      return { ... state, latest_comments:action.latest_comments}
    }
    // add comment to thread
    case 'ADD_COMMENT_TO_THREAD':{
      const c = [action.comment, ... state.comments]
      return {... state, comments:c}
    }
    case 'INIT_CREATE_COMMENT_VIEW':{
      console.log(action.form);
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

export default CommentReducer;
