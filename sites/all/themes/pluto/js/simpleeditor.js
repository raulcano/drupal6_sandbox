// $Id$
/**
* Simple text editing controls for a textarea.
*/
var SimpleEditor = SimpleEditor || {};
SimpleEditor.buttonBar =
'<div class="button-bar">' +
'<div class="editor-button bold"><strong>B</strong></div>' +
'<div class="editor-button italics"><em>I</em></div>' +
'</div>';
SimpleEditor.selection = null;

/**
* Record changes to a select box.
*/
SimpleEditor.watchSelection = function () {
	SimpleEditor.selection = Drupal.getSelection(this);
	SimpleEditor.selection.id = $(this).attr('id');
};
/**
* Attaches the editor toolbar.
*/
Drupal.behaviors.editor = function () {
	$('textarea:not(.editor-processed)')
	.addClass('editor-processed')
	.mouseup(SimpleEditor.watchSelection)
	.keyup(SimpleEditor.watchSelection)
	.each(function (item) {
		var txtarea = $(this);
		var txtareaID = txtarea.attr('id');
		var bar = SimpleEditor.buttonBar;
		$(bar).attr('id', 'buttons-' + txtareaID)
		.insertBefore('#' + txtareaID)
		.children('.editor-button')
		.click(function () {
			var txtareaEle = $('#' + txtareaID).get(0);
			var sel = SimpleEditor.selection;
			if (sel.id == txtareaID && sel.start != sel.end) {
				txtareaEle.value = SimpleEditor.insertTag(
					sel.start,
					sel.end,
					$(this).hasClass('bold') ? 'strong' : 'em',
					txtareaEle.value
			);
			sel.start = sel.end = -1;
			}
		});
	});
};

/**
* Insert a tag.
* @param start
* Location to insert start tag.
* @param end
* Location to insert end tag.
* @param tag
* Tag to insert.
* @param value
* String to insert tag into.
*/
SimpleEditor.insertTag = function (start, end, tag, value) {
	var front = value.substring(0, start);
	var middle = value.substring(start, end);
	var back = value.substring(end);
	return front + '<' + tag + '>' + middle +
	'</' + tag + '>' + back;
};