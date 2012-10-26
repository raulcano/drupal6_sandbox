$(document).ready(function () {
	var links = [
	{name: 'Drupal.org', link:'http://drupal.org'},
	{name: 'jQuery', link:'http://jquery.com'},
	{name: 'No Link'}
	];
	var text = Drupal.theme('shallow_menu', links);
	var blockInfo = {
		title: 'JavaScript Menu',
		content: text
		};
	var block = Drupal.theme('block', blockInfo);
	$('.block:first').before(block);
});

/**
* Theme a block object.
* This matches the bluemarine block.tpl.php.
*
* @param block
* A block object. Like the PHP version, it is expected to
* have a title and content. It may also have an id.
* @return
* Returns a string formated as a block.
*/
Drupal.theme.prototype.block = function (block) {
	if (!block.id) {
	block.id = "pluto-" + Math.floor(Math.random() * 9999);
	}
	var text = '<div class="block block-pluto" id="block-' +
	block.id +
	'">' +
	'<h2 class="title">' +
	block.title +
	'</h2><div class="content">' +
	block.content +
	'</div></div>';
	return text;
};

/**
* Build a single (non-colapsed) menu list.
* Mimics the complex menu logic in menus.inc.
* @param items
* An array of objects that have a name and a link property.
* @returns
* String representation of a link list.
*/
Drupal.theme.prototype.shallow_menu = function (items) {
	var list = $('<ul class="menu"></ul>');
	for (var i = 0; i < items.length; ++i) {
		var item = items[i];
		// Get text for menu item
		var menuText = null;
		if (item.link) {
			menuText = item.name.link(item.link);
		}
		else {
			menuText = item.name;
		}
		// Create item
		var li = $('<li class="leaf"></li>');
		// figure out if this is first or last
		if (i == 0) {
			li.addClass('first');
		}
		else if (i == items.length - 1) {
			li.addClass('last');
		}
		// Add item to list
		li.html(menuText).appendTo(list);
	}
	return list.parent().html();
};