// $Id$
/**
* Defines behaviors for Frobnitz theme.
* @file
*/
/**
* Toggle visibility of blocks (with slide effect).
*/
Drupal.behaviors.slideBlocks = function (context) {
	$('.block:not(.slideBlocks-processed)', context)
	.addClass('slideBlocks-processed')
	.each(function () {
		$(this).children(".title").toggle(
			function () {
				$(this).siblings(".content").slideUp("slow");
			},
			function () {
			$(this).siblings(".content").slideDown("slow");
			});
	});
};