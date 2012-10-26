/**
 * Drupal.messages provides storage for status and other types of messages
 * v1: only provides storage
 * v2: (@todo) fetches server side messages via AJAX+JSON
 */
Drupal.messages = {
  messages: {}, /* Messages storage object */
  length: 0,  /* Length of the messages object. Represents number of different message types */
  /**
   * Return all messages that have been set.
   *
   * @param $type
   *   (optional) Only return messages of this type.
   * @param $clear_queue
   *   (optional) Set to FALSE if you do not want to clear the messages queue
   * @return
   *   An associative array, the key is the message type, the value an array
   *   of messages. If the $type parameter is passed, you get only that type,
   *   or an empty array if there are no such messages. If $type is not passed,
   *   all message types are returned, or an empty array if none exist.
   */
/* @todo: make sure this function covers all edge cases*/
  get: function(type, clearQueue) {
    var temp = this.messages;
    temp.length = this.length;
    if (this.length > 0) {
      if ( clearQueue == undefined ) {
        clearQueue = true;
      }
      if (type == undefined) { 
        if(clearQueue) { 
          this.messages = []; 
          this.length = 0;
        }
        return temp;
      }
      if ( temp[type] != undefined ) {
        if (clearQueue) {
          this.messages[type] = [];
          this.length--;
        }
        var ret = {};
        ret[type] = [];
        for ( var i = 0 ; i < temp[type].length; i++ ) { 
          ret[type].push(temp[type][i]);
        }
        return ret;
      }
    }
    return {length:0};
  },
  /**
   * Set a message which reflects the status of the performed operation.
   *
   * If the function is called with no arguments, this function returns all set
   * messages without clearing them.
   *
   * @param $message
   *   The message should begin with a capital letter and always ends with a
   *   period '.'.
   * @param $type
   *   The type of the message. One of the following values are possible:
   *   - 'status'
   *   - 'warning'
   *   - 'error'
   * @param $repeat
   *   If this is FALSE and the message is already set, then the message won't
   *   be repeated.
   */
  set: function(message, type, repeat) {/* @todo: repeat feature is not working yet, fix */
	  // Don't log anything if there's no message to log.
  	if (!message) {
  		return;
  	}
	
  	type = type || 'status';
    if ( repeat == undefined) { 
      repeat = true;
    }
    if (this.messages[type] == undefined) {
      this.messages[type] = [];
      this.length++;
    }

	  // If repeat is off then we don't display a duplicate?
  	if (!repeat && this.messages[type].some(/*function (m) {return (this == m);}*/this.strEqual, message)) {
  	  return; // Don't show a repeated message.
  	}
  	else {
  		this.messages[type].push(message);
  	}
	
    $('.js_theming_messages').prepend('<div class="messages '+ type + '">'+ message + '</div>');
    this.enforceMaxMessages(Drupal.settings.maxMessagesInQueue);    /* remove old messages */
    this.hide(Drupal.settings.statusMessageDuration * 1000);
  },
  /* helper function, returns true if message is equal to current array element */
  /* used to check if a message already exist in Drupal.messages.messages[type] */
  strEqual: function (element, index, array) {
    return (element == this);
  },
  /**
   * Initialize the messages object.
   */
  init: function() {
    this.hide(Drupal.settings.statusMessageDuration * 1000);    /* Trigger the messages hide effect */
  },
  /* Helps removing messages if too many appear on the screen */
  enforceMaxMessages: function (max) {
    max = max || 10; // default to 10 messages on screen at a time
    var currentMessages = $('.js_theming_messages').children('.messages');
    for ( var i = 0; i < currentMessages.length;i++) {
      if ( i >= max ) {/*removes all messages beyond the maximum allowed*/
        $(currentMessages[i]).remove();
      }
    }
  },
  /* Hides the status message after number of seconds */
  hide: function(duration) {
    duration = duration || 10000; // Default is ten seconds.
    clearTimeout(Drupal.messages.performingHide);

    $(".js_theming_messages").show(); /* We've hid it before, lets show it first */
    /* Should we hide the status messages? */
    if (Drupal.settings.enableHideMessages == 1 ) {
      Drupal.messages.performingHide = setTimeout(function(){
        // Hide the container, then remove all of the messages so they
        // don't show again.
        $(".js_theming_messages").hide().children('.messages').remove();
      }, 
      /* How long the messages will remain visible before hiding ( in milliseconds ) */
      duration); 
    }/* // enableHideMessages */
  },
  /* Deletes old status messages from DOM (mainly to allow adding more messages without cluttering the interface) */
  prune: function() {
    $('.js_theming_messages .messages').remove(); /* remove DOM messages */
    this.get();   /* empty Drupal.messages.messages */
  }
};