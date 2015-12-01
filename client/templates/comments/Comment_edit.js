Template.postEdit.onCreated(function() {
  Session.set('commentEditErrors', {});
});

Template.commentEdit.helpers({
  errorMessage: function(field) {
    return Session.get('commentEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('commentEditErrors')[field] ? 'has-error' : '';
  }
});

Template.commentEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentCommentId = this._id;
    var currentPostId = this.postId;
    
    var commentProperties = {
      body: $(e.target).find('[name=body]').val()}
         
    Comments.update(currentCommentId, {$set: commentProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this comment?")) {

      var currentCommentId = this._id;
      var currentPostId = this.postId;

      Meteor.call('changeCommentsCount', currentPostId)

      Comments.remove(currentCommentId);    

      Router.go('postPage', {_id: currentPostId});


    }
  }
});


