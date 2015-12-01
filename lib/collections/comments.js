Comments = new Mongo.Collection('comments');

Comments.allow({
  update: function(userId, comment) { return ownsDocument(userId, comment); },
  remove: function(userId, comment) { return ownsDocument(userId, comment); },
});

Comments.deny({
  update: function(userId, comment, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);

    if (!post)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    
    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});
    
    // create the comment, save the id
    comment._id = Comments.insert(comment);
    
    // now create a notification, informing the user that there's been a comment
    createCommentNotification(comment);
    
    return comment._id;
  },

  changeCommentsCount: function(postId){
    check(postId, String);
    Posts.update(postId, {$inc: {commentsCount: -1}});
  }
});






//validateComment