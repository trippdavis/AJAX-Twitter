$.InfiniteTweets = function (el) {
  this.$el = $(el);
  this.$ul = $('ul#feed');
  this.maxCreatedAt = null;
  $('a.fetch-more').on("click", this.fetchTweets.bind(this));
};

$.InfiniteTweets.prototype.fetchTweets = function (event) {
  $.ajax({
    url: "/feed",
    type: "GET",
    data: (this.maxCreatedAt != null ? {max_created_at: this.maxCreatedAt} : {}),
    dataType: "json",
    success: function (tweets) {
      this.maxCreatedAt = tweets[tweets.length - 1].created_at;
      this.insertTweets(tweets);
      if (tweets.length < 20) {
        this.replaceLink();
      }
    }.bind(this)
  });
};

$.InfiniteTweets.prototype.replaceLink = function () {
  $('a.fetch-more').remove();
  this.$ul.append("<strong>No more tweets</strong>");
};


$.InfiniteTweets.prototype.insertTweets = function (tweets) {
  for (var i = 0; i < tweets.length; i++) {
    var tweet = JSON.stringify(tweets[i]);
    var $tweet = "<li>" + tweet + "</li>";
    this.$ul.append($tweet);
  }
};

$.fn.infiniteTweets = function () {
  return this.each(function () {
    new $.InfiniteTweets(this);
  });
};
