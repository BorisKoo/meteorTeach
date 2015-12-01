Template.postPage.onCreated(function() {

  Meteor.call('viewPost',this.data._id);
  
})

Template.postPage.helpers({
 
  comments: function() {
    return Comments.find({postId: this._id});
  },
  nextPathComments: function() {
  	var Incr = 5;
  	var nextLimit = Comments.find({postId: this._id}).count()+Incr;

    return Router.routes.postPage.path({_id: this._id, commentsLimit: nextLimit});
   },
   notEnd: function(){
   	return this.commentsCount > Comments.find({postId: this._id}).count() ? true : false
   }
   ,
   toEndComments: function(){
   	var endLimit = this.commentsCount;
   	return Router.routes.postPage.path({_id: this._id, commentsLimit: endLimit});
   }
});