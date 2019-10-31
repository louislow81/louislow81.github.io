$('.twitter-feed').delegate('#twitter-widget-0', 'DOMSubtreeModified propertychange', function() {
  customizeTweetMedia();
});

var customizeTweetMedia = function() {

  // CSS Overrides
  $('.twitter-feed').find('.twitter-timeline').contents().find('.timeline-Tweet-media').css('display', 'block');

  $('.twitter-feed').find('.twitter-timeline').contents().find('img.Avatar').css('display', 'none');

  $('.twitter-feed').find('.twitter-timeline').contents().find('span.TweetAuthor-avatar.Identity-avatar').remove();

  $('.twitter-feed').find('.twitter-timeline').contents().find('span.TweetAuthor-screenName').css('font-size', '16px');

  $('.twitter-feed').find('.twitter-timeline').contents().find('span.TweetAuthor-screenName').css('font-family', 'Raleway');

  $('.twitter-feed').find('.twitter-timeline').contents().find('p.timeline-tweet-text').css('font-family', 'Poppins');

  $('.twitter-feed').find('.twitter-timeline').contents().find('p.timeline-tweet-text').css('font-size', '16px').css('color', '#ffffff');

  $('.twitter-feed').find('.twitter-timeline').contents().find('p.timeline-tweet-text').css('line-height', '1.6');

  $('.twitter-feed').find('.twitter-timeline').contents().find('ul.timeline-tweet-actions').css('display', 'none');

  // Call the function on dynamic updates in addition to page load
  $('.twitter-feed').find('.twitter-timeline').contents().find('.timeline-TweetList').bind('DOMSubtreeModified propertychange', function() {
    customizeTweetMedia(this);
  });

}
