// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.serializejson
//= require_tree .

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

$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$ul = this.$el.find('ul');
  this.$input = this.$el.find('input');
  this.$input.on('input', this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function(event){
  var that = this;
  $.ajax({
    url: '/users/search',
    type: 'GET',
    dataType: "json",
    data: {
      query: this.$input.val()
    },
    success: function (response) {
      var users = response;
      that.renderResults(users);
    }
  });
};

$.UsersSearch.prototype.renderResults = function(users) {
  this.$ul.empty();
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    var $a = $("<a href='/users/" + user.id + "'>" + user.username +  "</a>" );
    var $li = $("<li></li>");
    var $button = $("<button class='follow-toggle'></button>");
    $button.followToggle( {
      userId: user.id,
      followState: (user.followed ? "followed" : "unfollowed")
    });
    $li.append($a);
    $li.append($button);
    this.$ul.append($li);
  }

};

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$inputs = this.$el.find(":input");
  this.$el.on("submit", this.submit.bind(this));
  this.$textarea = this.$el.find('textarea');
  this.$textarea.on("keypress", this.charsLeft.bind(this));
  this.$ul = $(this.$el.data("tweets-ul"));
  $('a.add-mentioned-user').on('click', this.addMentionedUser.bind(this));
};

$.TweetCompose.prototype.addMentionedUser = function (event) {
  $scriptTag = this.$el.find('script');
  this.$el.find('div.mentioned-users').append($scriptTag.html());
}

$.TweetCompose.prototype.charsLeft = function(event){
  var charactersLeft = 140 - this.$textarea.val().length;
  // debugger
  var strongTag = this.$el.find('.chars-left');
  strongTag.text(charactersLeft);
};
$.TweetCompose.prototype.submit = function(event){
  event.preventDefault();
  var that = this;
  var jsonForm = this.$el.serializeJSON();
  this.$inputs.each(function(idx, input) {
    $(input).prop('disabled', true);
  });
  $.ajax({
    url: '/tweets',
    type: 'POST',
    dataType: 'json',
    data: jsonForm,
    success: function(response){
      that.handleSuccess(response);
    }
  });
};

$.TweetCompose.prototype.handleSuccess = function(response) {
  this.clearInput();
  this.$inputs.each(function(idx, input){
    $(input).prop('disabled', false);
  });
  var jsonStr = JSON.stringify(response);
  var $li = $("<li>" + jsonStr + "</li>");
  this.$ul.prepend($li);
  this.$el.find('.chars-left').text(140);
};

$.TweetCompose.prototype.clearInput = function () {
  $(this.$inputs[0]).val("");
  $(this.$inputs[1]).val("");
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};
