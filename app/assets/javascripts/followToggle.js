$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data('user-id') || options.userId;
  this.initialFollowState = this.$el.data('initial-follow-state') || options.followState;
  this.handleClick();
  this.render();
};

$.FollowToggle.prototype.render = function () {
  if (this.initialFollowState === 'unfollowing' || this.initialFollowState === 'following'){
    this.$el.prop('disabled', true);
  } else if (this.initialFollowState === 'followed'){
    this.$el.text('Unfollow!');
    this.$el.prop('disabled', false);
  } else {
    this.$el.text('Follow!');
    this.$el.prop('disabled', false);
  }
  console.log('hello');
};

$.FollowToggle.prototype.handleClick = function(){
  this.$el.on('click', function(event){
    event.preventDefault();
    if (this.initialFollowState === "unfollowed"){
      $.ajax({
        url: "/users/" + this.userId + "/follow",
        type: 'POST',
        dataType: "json",
        success: function () {
          this.$el.data('intitial-follow-state', 'followed');
          this.initialFollowState = "followed";
          this.render();
        }.bind(this)
      });
      this.initialFollowState = "following";
      this.render();
    } else {
      $.ajax({
        url: "/users/" + this.userId + "/follow",
        type: 'DELETE',
        dataType: "json",
        success: function () {
          this.$el.data('intitial-follow-state', 'unfollowed');
          this.initialFollowState = "unfollowed";
          this.render();
        }.bind(this)
      });
      this.initialFollowState = "unfollowing";
      this.render();
    }
  }.bind(this));
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};
