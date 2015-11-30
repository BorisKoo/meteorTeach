Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id, options) {
  check(id, String);
  return Posts.find(id, options);
});


Meteor.publish('comments', function(postId, options) {
  check(postId, String);
  return Comments.find({postId: postId}, options);
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
