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
