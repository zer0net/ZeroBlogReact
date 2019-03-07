/* GENERAL HELPERS */

export const RouteHelper = (url,address) => {
    let view = 'main',id = null;
    if (url.indexOf('?wrapper') > -1) url = url.split('?wrapper')[0];
    if (url.indexOf('&wrapper') > -1) url = url.split('&wrapper')[0];
    const path = url.split(address + "/")[1];
    if (path.indexOf('?') > -1){
      view = path.split(':')[1];
      if (path.indexOf('id:') > -1){
        view = view.split('+')[0];
        id = path.split(':')[2];
        // view = view.split('+')[0];
        /*if (id.indexOf('+') > -1){
          id = id.split('+')[0];
        }*/
      }
    }
    return {view:view,id:id}
}

export const DateHelper = (timeStamp) => {
  const monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  const date = new Date(timeStamp);
  return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' +  date.getFullYear()
}

/** QUERY HELPERS **/

export const GeneratePostsQuery = (postId) => {
  let q = "SELECT p.* "
  q += ", (SELECT count(*) FROM comment WHERE comment.comment_post_id=p.post_id) as comment_count";
  q += ", (SELECT count(*) FROM like WHERE like.like_post_id=p.post_id) as like_count";
  q += " FROM post AS p"
  if (postId){
    q += " WHERE p.post_id='"+postId+"'";
  } else {
    q += " ORDER BY p.post_date_added DESC";
  }
  return q;
}

/*let q = "SELECT i.*, c.*, id.*, count(cm.item_id) as comment_count";
q+= ", (SELECT count(*) FROM comment WHERE comment.item_id=i.item_id) as comment_count";
q+= ", (SELECT count(*) FROM vote WHERE vote.item_id=i.item_id AND vote.vote=1) as up_votes";
q+= ", (SELECT count(*) FROM vote WHERE vote.item_id=i.item_id AND vote.vote=0) as down_votes";
q+= " FROM item AS i";
q+= " JOIN channel AS c ON i.channel=c.channel_address";
q+= " LEFT JOIN item_deleted AS id ON i.item_id=id.item_id";
q+= " LEFT JOIN comment AS cm ON i.item_id=cm.item_id";
q+= " LEFT JOIN ( SELECT item_id, sum(case when vote = 1 then 1 else 0 end) - sum(case when vote = 0 then 1 else 0 end) diff FROM vote GROUP BY item_id ) AS v ON i.item_id = v.item_id";
q+= " LEFT JOIN ( SELECT count(*) FROM comment) AS cm ON i.item_id = cm.item_id";
return q;*/


export const GenerateIsLikedByUserQuery = (postId, userId) => {
  let q = "SELECT * FROM like "
  q += " WHERE like_post_id='"+postId+"'"
  q += " AND like_user_id='"+userId+"'";
  return q;
}

/** COMMENTS **/

// get posts comments
export const GeneratePostCommentListQuery = (postId) => {
  let q = "SELECT * ";
  q += " FROM comment ";
  q += " WHERE comment_post_id='"+postId+"' ";
  q += " ORDER BY comment_date_added DESC ";
  return q;
}

// get latest comments
export const GenerateLatestCommentsQuery = () => {
  let q = "SELECT * ";
  q += " FROM comment ";
  q += " ORDER BY comment_date_added DESC ";
  q += " LIMIT 3 ";
  return q;
}


/** FEED **/

/*
function generateFollowNewTopicsQuery(){
  let q = "SELECT title AS title, body_p AS body, added AS date_added, 'topic' AS type,";
  q += " 'index.html?v=topic+id=' || topic.topic_id AS url FROM topic LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topic.json_id) WHERE parent_topic_uri IS NULL";
  return q;
};

function generateFollowChannelQuery(channel){
  let q = "SELECT title AS title, body_p AS body, added AS date_added, 'topic' AS type,";
  q += " 'index.html?v=topic+id=' || topic.topic_id AS url FROM topic LEFT JOIN json AS topic_creator_json ON (topic_creator_json.json_id = topic.json_id)"
  q += " WHERE topic.channel_id='"+channel.channel_id+"'";
  return q;
};

function generateFollowTopicCommentsQuery(topic){
  let q = "SELECT topic.title AS title, comment.body AS body, comment.added AS date_added, 'comment' AS type,";
  q += " 'index.html?v=topic+id=' || topic.topic_id AS url";
  q += " FROM topic";
  q += " LEFT JOIN comment ON (comment.topic_id = topic.topic_id)";
  q += " WHERE topic.topic_id='"+topic.topic_id+"'";
  return q;
};
*/
