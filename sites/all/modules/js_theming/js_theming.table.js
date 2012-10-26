/**
 * Return a themed table.
 *
 * @param $header
 *   An array containing the table headers. Each element of the array can be
 *   either a localized string or an associative array with the following keys:
 *   - "data": The localized title of the table column.
 *   - "field": The database field represented in the table column (required if
 *     user is to be able to sort on this column).
 *   - "sort": A default sort order for this column ("asc" or "desc").
 *   - Any HTML attributes, such as "colspan", to apply to the column header cell.
 * @param $rows
 *   An array of table rows. Every row is an array of cells, or an associative
 *   array with the following keys:
 *   - "data": an array of cells
 *   - Any HTML attributes, such as "class", to apply to the table row.
 *
 *   Each cell can be either a string or an associative array with the following keys:
 *   - "data": The string to display in the table cell.
 *   - "header": Indicates this cell is a header.
 *   - Any HTML attributes, such as "colspan", to apply to the table cell.
 *
 *   Here's an example for $rows:
 *   @verbatim
 *   $rows = array(
 *     // Simple row
 *     array(
 *       'Cell 1', 'Cell 2', 'Cell 3'
 *     ),
 *     // Row with attributes on the row and some of its cells.
 *     array(
 *       'data' => array('Cell 1', array('data' => 'Cell 2', 'colspan' => 2)), 'class' => 'funky'
 *     )
 *   );
 *   @endverbatim
 *
 * @param $attributes
 *   An array of HTML attributes to apply to the table tag.
 * @param $caption
 *   A localized string to use for the <caption> tag.
 * @return
 *   An HTML string representing the table.
 */
Drupal.theme.table = function (header, rows, attributes, caption ) {
  if (header == undefined) {
    header = [];  /* array of strings or objects */
  }
  if (attributes == undefined) {
    attributes = {}; /* object of attributes */
  }
  if (rows == undefined) {
    rows = [];
  }
  /* Add 'sticky-enabled' class to the table to identify it for JS. */
  /* This is needed to target tables constructed by this function. */
  if ( header.length > 0 ) {
    attributes['class'] = (attributes['class'] == undefined) ? 'sticky-enabled' : attributes['class'] + ' sticky-enabled';
  }
  var output = '<table' + Drupal.drupalAttributes(attributes) + ">\n"; 
  if (caption != undefined) {
    output += '<caption>' + caption + '</caption>\n';
  }
  
  // Format the table header:
  if (header.length > 0) {
    var ts = Drupal.table.SortInit(header);
    // HTML requires that the thead tag has tr tags in it follwed by tbody
    // tags. Using ternary operator to check and see if we have any rows.
    output += (rows.length > 0) ? '<thead><tr>' : '<tr>';
    for( var i = 0; i < header.length ; i++ ) {
      var cell = Drupal.table.tableSortHeader(header[i], header, ts);
      output += Drupal.theme('tableCell', cell, true);
    }
    // Using ternary operator to close the tags based on whether or not there are rows
    output += (rows.length > 0) ? '</tr></thead>\n' : '</tr>\n';
  }
  else {
    var ts = [];
  }
  if (rows.length > 0) {
    output += '<tbody>\n';
    var flip = {even:'odd', odd:'even'};
    var cellClass = 'even';
    for(var i = 0; i < rows.length; i++ ) {
      
      
      attributes = {};
      // Check if we're dealing with a simple or complex row
      if (rows[i]['data'] != undefined ) {
        for( var key in rows[i] ) {
          if ( key == 'data') {
            var cells = rows[i][key];
          }
          else {
            attributes[key] = rows[i][key];
          }
        }
      }
      else {
        var cells = rows[i];
      }
      
      if ( cells.length > 0 ) {
        // Add odd/even class
        cellClass = flip[cellClass];
        if ( attributes['class'] != undefined) {
          attributes['class'] += ' ' + cellClass;
        }
        else {
          attributes['class'] = cellClass;
        }
        // Build row
        output += ' <tr' + Drupal.drupalAttributes(attributes) + '>';
        for ( var k = 0 ; k < cells.length ; k++ ) {
          var cell = Drupal.table.sortCell(cells[k], header, ts, k);
          output += Drupal.theme('tableCell', cell);
        }
        output += ' </tr>\n';
      }
    }
    output += '</tbody>\n';
  }
  
  output += '</table>\n';
  return output;
};

Drupal.theme.tableCell = function ( cell, header) {
  if ( header == undefined ) {
    header = false;
  }
  var attributes = '';
  if (typeof(cell) == 'object') {
    var data = (cell['data'] != undefined && cell['data'].length > 0)? cell['data']: '';
    if (cell['header'] != undefined) {
      header = true;
    }
    delete cell['data'];
    delete cell['header'];
    attributes = Drupal.drupalAttributes(cell);
  }
  else {
    data = cell;
  }
  if (header) {
    var output = '<th' + attributes + '>' + data + '</th>';
  }
  else {
    var output = '<td' + attributes + '>' + data + '</td>';
  }
  return output;
};


/**
 * Return a themed sort icon.
 *
 * @param $style
 *   Set to either asc or desc. This sets which icon to show.
 * @return
 *   A themed sort icon.
 */
Drupal.theme.tableSortIndicator = function (style) {
  if (style != undefined && style == 'asc' ) {
    return Drupal.theme('image', 'misc/arrow-asc.png', Drupal.t('sort icon'), Drupal.t('sort ascending'));
  }
  else {
    return Drupal.theme('image', 'misc/arrow-desc.png', Drupal.t('sort icon'), Drupal.t('sort ascending'));
  }
}
/**
 * Return a themed image.
 *
 * @param $path
 *   Either the path of the image file (relative to base_path()) or a full URL.
 * @param $alt
 *   The alternative text for text-based browsers.
 * @param $title
 *   The title text is displayed when the image is hovered in some popular browsers.
 * @param $attributes
 *   Associative array of attributes to be placed in the img tag.
 * @param $getsize
 *   If set to TRUE, the image's dimension are fetched and added as width/height attributes.
 * @return
 *   A string containing the image tag.
 */
Drupal.theme.image = function(path, alt, title, attributes, getsize) {
  if ( alt == undefined) {
    alt = '';
  }
  if ( title == undefined ) {
    title = '';
  }
  if ( attributes == undefined) {
    attributes = {};
  }
  var image = new Image;
  image.src = Drupal.settings.basePath + path;
  attributes = Drupal.drupalAttributes(attributes);
  return '<img src="' + image.src +'" alt="' + Drupal.checkPlain(alt) + '" title="' + Drupal.checkPlain(title) + '" ' + attributes + ' />';
}

Drupal.table = {
/**
 * Format a column header.
 *
 * If the cell in question is the column header for the current sort criterion,
 * it gets special formatting. All possible sort criteria become links.
 *
 * @param $cell
 *   The cell to format.
 * @param $header
 *   An array of column headers in the format described in theme_table().
 * @param $ts
 *   The current table sort context as returned from tablesort_init().
 * @return
 *   A properly formatted cell, ready for _theme_table_cell().
 */
  tableSortHeader: function (cell, header, ts) {
    // Special formatting for the currently sorted column header.
    if ( typeof(cell) == 'object' && cell['field'] != undefined) {
      var title = Drupal.t('sort by @s', {'@s':cell['data']});
      if ( cell['data'] == ts['name'] ) {
        ts['sort'] = (ts['sort'] != undefined && ts['sort'] == 'asc') ? 'desc' : 'asc';
        if (cell['class'] != undefined ) {
          cell['class'] += ' active';
        }
        else {
          cell['class'] = 'active';
        }
        var image = Drupal.theme('tableSortIndicator', ts['sort']);
      }
      else {
        // If the user clicks a different header, we want to sort ascending initially.
        ts['sort'] = 'asc';
        var image = '';
      }
      
      if ( ts['query_string'] != undefined && ts['query_string'].length > 0) {
        ts['query_string'] = '&' + ts['query_string'];
      }
      var query = 'sort=' + ts['sort'] + '&order=' + Drupal.urlEncode(cell['data']) + ((ts['query_string'] == undefined) ? '': ts['query_string']);
      cell['data'] = Drupal.l(cell['data'] + image, Drupal.settings.get['q'], {attributes: {title:title}, query:query, html:true});
      
      delete cell['field'];
      delete cell['sort'];
    }
    return cell;
  },

/**
 * Initialize the table sort context.
 */
  SortInit: function(header) {
    var ts = Drupal.table.SortGetOrder(header);
    ts['sort'] = Drupal.table.tableSortGetSort(header);
    ts['query_string'] = Drupal.table.tableSortGetQueryString();
    return ts;
  },
/**
 * Compose a query string to append to table sorting requests.
 *
 * @return
 *   A query string that consists of all components of the current page request
 *   except for those pertaining to table sorting.
 */
  tableSortGetQueryString: function() {
    /* @todo: this is not elegant solution, its a quick and lazy solution. REFACTOR!!! */
    var ignore = {};
    ignore['q'] = '';
    ignore['sort'] = '';
    ignore['order'] = '';
    for( var i in Drupal.settings.cookie) {
      ignore[i] = '';
    }
    Drupal.queryStringEncode(Drupal.settings.request, ignore);
  },
  /*
function tablesort_get_querystring() {
  return drupal_query_string_encode($_REQUEST, array_merge(array('q', 'sort', 'order'), array_keys($_COOKIE)));
}
//*/
/**
 * Determine the current sort direction.
 *
 * @param $headers
 *   An array of column headers in the format described in theme_table().
 * @return
 *   The current sort direction ("asc" or "desc").
 */
  tableSortGetSort: function(header) {
    if ( Drupal.settings.get.sort != undefined ) {
      return (Drupal.settings.get.sort == 'desc') ? 'desc' : 'asc';
    }
    else {
      /* User has not specified a sort. Use default if specified; otherwise use "asc". */
      for ( var i = 0; i < header.length ; i++ ) {
        if ( typeof(header[i]) == 'object' && header[i]['sort'] != undefined ) {
          return header[i]['sort'];
        }
      }
    }
    return 'asc';
  },
/**
 * Determine the current sort criterion.
 *
 * @param $headers
 *   An array of column headers in the format described in theme_table().
 * @return
 *   An associative array describing the criterion, containing the keys:
 *   - "name": The localized title of the table column.
 *   - "sql": The name of the database field to sort on.
   */
  SortGetOrder: function(header) {
    var order = (Drupal.settings.get.order == undefined) ? '': Drupal.settings.get.order;
    for ( var i = 0; i < header.length; i++ ) {
      var field = (header[i]['field'] == undefined)? '' : header[i]['field'];
      if ( header[i]['data'] != undefined && header[i]['data'] == order ){
        return {name: header[i]['data'], sql: field};
      }
      if ( header[i]['sort'] != undefined && (header[i]['sort'] == 'asc' || header[i]['sort'] == 'desc')) {
        var defaultColumn = {name: header[i]['data'], sql: field};
      }
    }
    
    if ( defaultColumn != undefined) {
      return defaultColumn;
    }
    else {
      // The first column by default specified is initial 'order by'  field unless otherwise specified
      if( typeof(header[0]) == 'object') {
        return {name: header[0]['data'], sql: header[0]['field']};
      }
      else {
        return {name: header[0]};
      }
    }
  },
/**
 * Format a table cell.
 *
 * Adds a class attribute to all cells in the currently active column.
 *
 * @param $cell
 *   The cell to format.
 * @param $header
 *   An array of column headers in the format described in theme_table().
 * @param $ts
 *   The current table sort context as returned from tablesort_init().
 * @param $i
 *   The index of the cell's table column.
 * @return
 *   A properly formatted cell, ready for _theme_table_cell().
 */
  sortCell: function( cell,  header,  ts, i) {
    if (header[i]['data'] != undefined && header[i]['data'] == ts['name'] && $header[$i]['field'] != undefined && $header[$i]['field'].length > 0) {
      
      if (typeof(cell) == 'object') {
        if ( $cell['class'] != undefined ) {
          $cell['class'] += ' active';
        }
        else {
          $cell['class'] = 'active';
        }
      }
      else {
        cell = {data: cell, class:'active'};
      }
    }
    return cell;
  },
}








