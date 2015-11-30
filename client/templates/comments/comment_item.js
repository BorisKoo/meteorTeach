Template.commentItem.helpers({
  submittedText: function() {
    return this.submitted.toString();
  },
   ownComment: function() {
    return this.userId == Meteor.userId();
  },
});