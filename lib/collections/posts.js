Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'text', 'title').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.text;
  }
});

validatePost = function (post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";
  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      text: String 
    });
    
    var errors = validatePost(postAttributes);
    if (errors.title)
      throw new Meteor.Error('invalid-post', "You must set a title for your post");
        
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date(),
      commentsCount: 0,
      views: 0
    });
    
    var postId = Posts.insert(post);
    
    return {
      _id: postId
    };
  },
});

Meteor.methods({
  viewPost: function(postId) {
    check(postId, String)
    Posts.update(postId, {$inc: {views: 1}});
  }});

Meteor.setInterval( function(){

  var now = new Date().getTime();
  var deleteDate = new Date(now - 3600 * 1000);

  var unpopularPost = Posts.findOne({}, {sort: {views: 1, commentsCount: 1}})
  var badPost = Posts.findOne({submitted: {$lt: deleteDate}, views: {$lte: unpopularPost.views}, commentsCount: {$lte: unpopularPost.commentsCount}}, {sort:{submitted: 1}});

  var ffff=5;
  if (badPost !==undefined){
    Posts.remove(badPost); 
  }
  }, 1000*60*30) // раз в 30 минут



