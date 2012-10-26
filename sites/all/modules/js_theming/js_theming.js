/** 
 * Drupal.jsEnabled is a generic wrapper for all Drupal JavaScript. 
 * It makes sure that your JavaScript executes when the environment is ready.
 */
if (Drupal.jsEnabled) {
  $(document).ready(function() {
    /* Do something useful here */
    Drupal.messages.init();
    Drupal.settings.get = Drupal.parseJson(Drupal.settings.get);    /* necessary for table sort */
    Drupal.settings.request = Drupal.parseJson(Drupal.settings.request);    /* necessary for table sort */
    Drupal.settings.cookie = Drupal.parseJson(Drupal.settings.cookie);    /* necessary for table sort */
    //drupal_query_string_encode($_REQUEST, array_merge(array('q', 'sort', 'order'), array_keys($_COOKIE)));
    
  });
};

/**
 * Format an attribute string to insert in a tag.
 *
 * @param $attributes
 *   An associative array of HTML attributes.
 * @return
 *   An HTML string ready for insertion in a tag.
 */
Drupal.drupalAttributes = function(attributes) {
  if (typeof attributes == 'object') {
    var t = '';
    for (var i in attributes) {
      t += ' '+ i +'="' + Drupal.checkPlain(attributes[i]) + '"';
    }
    return t;
  }
  return '';
};


/**
 * Convert an array into a valid urlencoded query string.
 *
 * @param query
 *   The object to be processed e.g. {'key':'value'}. Nested objects are 
 *   allowed (e.g. {'a':'b', 'aa':{'0':'bb', '1':'cc'}}).
 * @param exclude
 *   The array filled with keys to be excluded. Use parent[child] to exclude
 *   nested items.
 * @param parent
 *   Should not be passed; only used in recursive calls.
 * @return
 *   An urlencoded string which can be appended to/as the URL query string.
 */
Drupal.queryStringEncode = function(query /*, exclude, parent */) {
  var params = [];
  exclude = arguments[1] || [];
  parent = arguments[2] || null;
  
  for ( var key in query ) {
    key = Drupal.encodeURIComponent(key);
    if (parent) {
      newkey = parent + '[' + key + ']';
    }
    else {
      newkey = key;
    }
    
    if (exclude.indexOf(key) >= 0) {
      continue; // Skip exclude keys
    }
    
    /*
     * This handles the case where query looks like this: 
     * {'a':'b', 'c':{'0':'foo', '1':'bar'}}
     *
     * The above will be encoded to a query string like this:
     * "a=b&c[0]=foo&c[1]=bar"
     *
     * This should (I hope) keep it compatible with the PHP equivalent function,
     * and also handle PHP-style GET arrays.
     */
    if (typeof(query[key]) == 'object') {
    //if (query[key] instanceof Array) {
      params.push(Drupal.queryStringEncode(query[key], exclude, key));
    }
    else {
      params.push(newkey + '=' + Drupal.encodeURIComponent(query[key]));
    }
  }
  return params.join('&');
}

/**
 * Emulate the PHP drupal_urlencode() function.
 * 
 * This is a convenience function for encoding Drupal URLs. It simply calls
 * the drupal.js function Drupal.encodeURIComponent().
 *
 * Should be used when placing arbitrary data in an URL. Note that Drupal paths
 * are urlencoded() when passed through url() and do not require urlencoding()
 * of individual components.
 *
 * Notes:
 * - For esthetic reasons, we do not escape slashes. This also avoids a 'feature'
 *   in Apache where it 404s on any path containing '%2F'.
 * - mod_rewrite unescapes %-encoded ampersands, hashes, and slashes when clean
 *   URLs are used, which are interpreted as delimiters by PHP. These
 *   characters are double escaped so PHP will still see the encoded version.
 * - With clean URLs, Apache changes '//' to '/', so every second slash is
 *   double escaped.
 *
 * @param $text
 *   String to encode
 * @todo: define this function
 */
Drupal.urlEncode = function (text) {
  return Drupal.encodeURIComponent(text);
}

/* Misc function for debugging */
Drupal.doAlert = function (data) {
  var output = '';
  for( var i in data ){
    if (typeof data[i] == 'object') {
      output += Drupal.doAlert(data[i]);
    }
    else{
      output += 'key: '+ i + "\n"+'data: '+data[i]+"\n";
    }
  }
  return output;
};

/**
 * Format an internal Drupal link.
 *
 * This function correctly handles aliased paths, and allows themes to highlight
 * links to the current page correctly, so all internal links output by modules
 * should be generated by this function if possible.
 *
 * @param $text
 *   The text to be enclosed with the anchor tag.
 * @param $path
 *   The Drupal path being linked to, such as "admin/content/node". Can be an
 *   external or internal URL.
 *     - If you provide the full URL, it will be considered an external URL.
 *     - If you provide only the path (e.g. "admin/content/node"), it is
 *       considered an internal link. In this case, it must be a system URL
 *       as the url() function will generate the alias.
 *     - If you provide '<front>', it generates a link to the site's
 *       base URL (again via the url() function).
 *     - If you provide a path, and 'alias' is set to TRUE (see below), it is
 *       used as is.
 * @param $options
 *   An associative array of additional options, with the following keys:
 *     - 'attributes'
 *       An associative array of HTML attributes to apply to the anchor tag.
 *     - 'query'
 *       A query string to append to the link, or an array of query key/value
 *       properties.
 *     - 'fragment'
 *       A fragment identifier (named anchor) to append to the link.
 *       Do not include the '#' character.
 *     - 'absolute' (default FALSE)
 *       Whether to force the output to be an absolute link (beginning with
 *       http:). Useful for links that will be displayed outside the site, such
 *       as in an RSS feed.
 *     - 'html' (default FALSE)
 *       Whether the title is HTML, or just plain-text. For example for making
 *       an image a link, this must be set to TRUE, or else you will see the
 *       escaped HTML.
 *     - 'alias' (default FALSE)
 *       Whether the given path is an alias already.
 * @return
 *   an HTML string containing a link to the given path.
 */
Drupal.l = function(text, path, options) {
  if (options == undefined ) {
    options = {};
  }
  if ( options['attributes'] == undefined ) {
    options['attributes'] = {};
  }
  if ( options['html'] == undefined ) {
    options['html'] = false;
  }
  if (path == Drupal.settings.get['q']) {
    if ( options['attributes']['class'] == undefined) {
      options['attributes']['class'] = 'active';
    }
    else {
      options['attributes']['class'] += ' active';
    }
  }
  if (options['attributes']['title'] != undefined) {
    options['attributes']['title'] = Drupal.checkPlain(options['attributes']['title']);
  }
  if (options['html'] != true) {
    text = Drupal.checkPlain(text)
  }
  return '<a href="' + Drupal.url(path, options) + '"' + Drupal.drupalAttributes(options['attributes']) + '>' + text + '</a>';
}

/**
 * Generate a URL from a Drupal menu path. Will also pass-through existing URLs.
 *
 * @param $path
 *   The Drupal path being linked to, such as "admin/content/node", or an
 *   existing URL like "http://drupal.org/".  The special path
 *   '<front>' may also be given and will generate the site's base URL.
 * @param $options
 *   An associative array of additional options, with the following keys:
 *   - 'query'
 *       A query string to append to the link, or an array of query key/value
 *       properties.
 *   - 'fragment'
 *       A fragment identifier (or named anchor) to append to the link.
 *       Do not include the '#' character.
 *   - 'absolute' (default FALSE)
 *       Whether to force the output to be an absolute link (beginning with
 *       http:). Useful for links that will be displayed outside the site, such
 *       as in an RSS feed.
 *   - 'alias' (default FALSE)
 *       Whether the given path is an alias already.
 *   - 'external'
 *       Whether the given path is an external URL.
 *   - 'language'
 *       An optional language object. Used to build the URL to link to and
 *       look up the proper alias for the link.
 *   - 'base_url'
 *       Only used internally, to modify the base URL when a language dependent
 *       URL requires so.
 *   - 'prefix'
 *       Only used internally, to modify the path when a language dependent URL
 *       requires so.
 * @return
 *   A string containing a URL to the given path.
 *
 * When creating links in modules, consider whether l() could be a better
 * alternative than url().
 */
Drupal.url = function (path, options) {
  
  if (options == undefined) {
    options = {};
  }
  if (options['fragment'] == undefined) {
    options['fragment'] = '';
  }
  if (options['query'] == undefined) {
    options['query'] = '';
  }
  if (options['absolute'] == undefined) {
    options['absolute'] = false;
  }
  if (options['alias'] == undefined) {
    options['alias'] = false
  }
  if (options['prefix'] == undefined) {
    options['prefix'] = '';
  }
  
  if (typeof(options['query']) == 'object') {
    options['query'] =  Drupal.queryStringEncode(options['query']);
  }
  if (options['query'].length > 0 ){
    return Drupal.settings.basePath + path + '?' + options['query'];
  }
  return Drupal.settings.basePath + path;
}