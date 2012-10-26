/**
 * Return a themed list of items.
 *
 * @param $items
 *   An array of items to be displayed in the list. If an item is a string,
 *   then it is used as is. If an item is an array, then the "data" element of
 *   the array is used as the contents of the list item. If an item is an array
 *   with a "children" element, those children are displayed in a nested list.
 *   All other elements are treated as attributes of the list item element.
 * @param $title
 *   The title of the list.
 * @param $attributes
 *   The attributes applied to the list element.
 * @param $type
 *   The type of list to return (e.g. "ul", "ol")
 * @return
 *   A string containing the list output.
 */
Drupal.theme.itemList = function (items, title, type, attributes ) {
  var output = '<div class="item-list">';
  if (items == undefined) {
    items = [];  /*initialize default values*/
  }
  if (type == undefined) {
    type = 'ul';/*initialize default values*/
  }
  if (attributes == undefined) {
    attributes = [];/*initialize default values*/
  }
  if( title != undefined && title.length > 0) {
    output +='<h3>'+ title + '</h3>';
  }
  if(typeof items == 'object' && $(items).length > 0) {
    output +='<'+type + Drupal.drupalAttributes(attributes) + '>'; /*include drupal_attributes implementation*/
    var numItems = $(items).length;
    for (var i in items) {
      var attributes = [];      
      var children = [];
      var data = '';
      if( typeof items[i] == 'object') {
        for ( var k in items[i]) {
          if (k == 'data') {
            data = items[i][k];
          }
          else if(k == 'children') {
            children = items[i][k];
          }
          else {
            attributes[k] = items[i][k];
          }
        }
      }
      else {
        data = items[i];
      }
      if ($(children).length > 0) {
        data += Drupal.theme('itemList', children, null, type, attributes); /*render nested list*/
      }
      if (i == 0) {
        attributes['class'] = (attributes['class'] == undefined) ? 'first' : attributes['class'] + ' first';
      }
      if (i == numItems - 1) {
        attributes['class'] = (attributes['class'] == undefined) ? 'last' : attributes['class'] + ' last';
      }
      output += '<li' + Drupal.drupalAttributes(attributes) + '>' + data + '</li>';
    }
    output += '</'+type+'>';
  }
  output += '</div>';
  
  return output;
};
