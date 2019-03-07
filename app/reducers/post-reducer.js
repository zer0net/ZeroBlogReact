export const PostReducerInitialState = {
  loading:true,
  post:null,
  posts:null,
  form:null
}

function PostReducer(state,action){
  switch(action.type){
    case 'SET_POSTS':{
      return {... state,posts:action.posts,loading:false}
    }
    case 'SET_POST':{
      return {... state, post:action.post, loading:false}
    }
    case 'ADD_POST_LIKE':{
      if (action.postId){
        const postIndex = state.posts.findIndex((p) => p.post_id === action.postId);
        const oldPost = state.posts[postIndex]
        const newPost = {... oldPost,like_count:oldPost.like_count + 1}
        const posts = [
          ... state.posts.slice(0,postIndex),
          newPost,
          ... state.posts.slice(postIndex + 1, state.posts.length)
        ]
        return {... state, posts}
      } else {
        const p = {... state.post, like_count:state.post.like_count + 1}
        return {...state,post:p}
      }
    }
    case 'REMOVE_POST_LIKE':{
      if (action.postId){
        const postIndex = state.posts.findIndex((p) => p.post_id === action.postId);
        const oldPost = state.posts[postIndex]
        const newPost = {... oldPost,like_count:oldPost.like_count - 1}
        const posts = [
          ... state.posts.slice(0,postIndex),
          newPost,
          ... state.posts.slice(postIndex + 1, state.posts.length)
        ]
        return {... state, posts}
      } else {
        const p = {... state.post, like_count:state.post.like_count - 1}
        return {...state,post:p}
      }
    }
    case 'INIT_CREATE_POST_VIEW':{
      return {... state,form:action.form,loading:false}
    }
    case 'UPDATE_POST_TITLE':{
      const f = {...state.form,title:action.title}
      return {... state,form:f}
    }
    case 'UPDATE_POST_BODY':{
      const f = {...state.form,body:action.body}
      return {... state,form:f}
    }
    default:{
      return state;
    }
  }
}

export default PostReducer;
