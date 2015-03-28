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
  var $scriptTag = this.$el.find('script');
  this.$el.find('div.mentioned-users').append($scriptTag.html());
};

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
  this.$inputs = this.$el.find(":input");
  for (var i = 0; i < this.$inputs.length; i++) {
    if (!($(this.$inputs[i]).attr('type') === 'Submit')) {
      $(this.$inputs[i]).val("");
    }
  }
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    new $.TweetCompose(this);
  });
};
