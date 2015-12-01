Template.postItemList.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  }
});