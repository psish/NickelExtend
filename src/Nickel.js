/*  
    Nickel.js
     ~ Simple JavaScript Framework for Chrome Only.
     ~ Inspired by the great MooTools (http://www.mootools.net/)
     
    @authors
        John Chavarria <m@psi.sh>
    @version 0.1
    @license LGPL v3.0 (http://www.gnu.org/licenses/lgpl.html) 

    @copyright (c) 2012, Authors.
*/


(function() {


// Nickeljs global object
this.Nickel = {
    version: '0.1'
};


/*****
*
* Function
*  ~ Extends the Function prototype
*
*****/


/**
* pass: Returns a closure with arguments and bind.
*
* @param Mixed args The arguments to pass to the function.
* @param Object bind The object that the "this" of the function will refer to.
*/
Function.prototype.pass = function pass(args, bind)
{
	var self = this;
	if (args != null) args = Array(args);
	return function(){
		return self.apply(bind, args || arguments);
	};
};


/**
* delay: Delays the execution of a function by a specified duration.
*
* @param Number delay The duration to wait (in milliseconds).
* @param Object bind The object that the "this" of the function will refer to.
* @param Mixed args The arguments passed.
*/
Function.prototype.delay = function delay(delay, bind, args)
{

	return setTimeout(this.pass((args == null ? [] : args), bind), delay);

};


/**
* subImplement: Implement a function to a sub value of an object.
*
* @param String key Function name.
* @param String value The sub value.
*/
Function.prototype.subImplement = function prototypeSubCopy(key, value)
{

    this.prototype[key] = function() {
        this[value][key].apply(this[value], arguments);
    }
    
};


/*****
*
* Window
*  ~ Window extends and HTMLElements Selectors $, $$ and $0
*
*****/


/**
* addEvent: wrapper for addEventListener.
*
* @param String/Object id Event name or List of Events.
* @param [Function] fn The function to call on event (Only for single event).
*/
window.addEvent = function addEvent(id, fn)
{

    if (typeof id == 'string') {
        this.addEventListener(id, fn, true);
    } else if (typeof id == 'object') {
        for (var key in id) {
            this.addEvent(key, id[key]);
        }
    }

    return this;

};


/**
* $: Gets an Element by its id.
*
* @param String el Element id.
*/
window.$ = function $(el)
{

    return document.getElementById(el);
    
};


/**
* $$: Gets a collection of Element by their class, id or CSS custom selector.
*
* @param String selector CSS Selector.
*/
window.$$ = function $$(selector)
{

    if (typeof selector == 'string') {
        selector = selector.split(' ');
        if (selector.length > 1) {
            var id = selector[0],
                cl = selector[1];
            id = $(id.slice(1, id.length));
            return id.getElementsByClassName(cl.slice(1, cl.length)) 
        } else {
            var expression = selector[0].match(/^([#.]?)((?:[\w-]+|\*))$/);
            var symbol     = expression[1],
			    name       = expression[2];
			if (symbol == '#') {
			    return $(name);
			} else {
			    return document.getElementsByClassName(name);
			}
        }            
    } else {
        return null;
    }        

};


/**
* $0: Returns the first occurrence of $$.
*
* @param String selector CSS Selector.
*/
window.$0 = function $0(selector)
{

    return $$(selector)[0];

};


/*****
*
* Array
*  ~ Extends the Array prototype
*
*****/


/**
* each: Foreach into an array.
*
* @param Array el The Array.
* @param Function fn The function to apply to each element.
*/
Array.prototype.each = function each(el, fn)
{

    for (var i = 0; i < el.length; i++) {
        fn.call(el, el[i], this);
    }

};


/**
* contains: Tests if an item is present in an Array.
*
* @param Mixed item The item to search in the Array.
* @param [Number] from Begining index.
*/
Array.prototype.contains = function contains(item, from)
{

	return this.indexOf(item, from) != -1;

};


/**
* clean: Cleans an array of null values.
*
*/
Array.prototype.clean = function clean()
{

    return this.filter(function(item) {
        return item != null;
    });

};


/**
* combine: Combines an Array with another.
*
* @param Array array The array to combine to the original
*/
Array.prototype.combine = function combine(array)
{

    for (var i = 0; i < array.length; i++) {
        if (!this.contains(array[i])) {
            this.push(array[i]);
        }
    }

    return this;

};


/**
* clone: Clones an Array.
*
*/
Array.prototype.clone = function clone()
{

    var ret = new Array();
    for (var i = 0; i < this.length; i++) {
        ret.push(this[i]);
    }

    return ret;

};


/*****
*
* Object
*  ~ Extends the Object prototype
*
*****/


/**
* each: Foreach into an object.
*
* @param Object el The Object.
* @param Function fn The function to apply to each element.
*/
Object.prototype.each = function each(el, fn)
{

    for (var key in el){
        if (hasOwnProperty.call(el, key)){
            fn.call(this, el[key], key, el)
        }
    }

};


/**
* clone: Clones an object.
*
*/
Object.prototype.clone = function clone()
{

    var ret = new Object();
    for (var key in this){
        if (this.hasOwnProperty(key)) {
            ret[key] = this[key];
        }
    }
    return ret;
    
};


/**
* length: Returns the length of an object.
*
*/
Object.prototype.length = function length()
{

    var ret = 0;
    for (var key in this){
        if (this.hasOwnProperty(key)) {
            ret++;
        }
    }
    return ret;
    
};


/**
* merge: Merges an Object with another.
*
* @param Object obj The Object to merge to the current.
*/
Object.prototype.merge = function merge(obj)
{

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            this[key] = obj[key];
        }
    }

    return this;
    
};


/**
* toQueryString: Converts an object to a query string.
*
* @param Object obj The Object to convert.
*/
Object.prototype.toQueryString = function toQueryString(obj)
{

    var queryString = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] != null) {
            queryString.push(key + '=' + encodeURIComponent(obj[key]));
        }
    }

    return queryString.join('&');
    
};


/*****
*
* Request
*  ~ Creates a Request Type to handle XHR.
*
*****/


/*
* sendAsBinary: Extends XHR prototype to add sendAsBinary method.
*
* @param String datastr Request body as string.
*/
XMLHttpRequest.prototype.sendAsBinary = function(datastr)
{

    function byteValue(x)
    {

        return x.charCodeAt(0) & 0xff;

    }

    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);

};


/*
* Request: Instanciate a new XHR.
*
* @param [Object] options Request options.
*/
window.Request = function Request(options)
{

    options = options || {};

    this.$request = new XMLHttpRequest();
    this.options  = {
        method   : 'POST',
        uri      : 'http://localhost',
		headers: {
			'X-Requested-With'  : 'XMLHttpRequest',
			'Accept'            : 'text/javascript, text/html, application/xml,'
			 + ' text/xml, */*'
		}       
    }
    this.options.merge(options);

    this.$request.onreadystatechange = function(e) {
        if (this.$request.readyState == 4) {
            if (this.$request.status == 200) {
                if (this.options.onSuccess) {
                    this.options.onSuccess(this.$request.responseText);
                }
            } else {
                if (this.options.onFailure) {
                    this.options.onFailure(this.$request);
                }
            }
        }
    }.bind(this);

    this.$request.open(this.options.method, this.options.uri, true);

    if (this.options.headers) {
        for (var key in this.options.headers) {
            if (this.options.headers.hasOwnProperty(key)) {
                this.$request.setRequestHeader(key, this.options.headers[key]);
            }
        }
    }

};


/**
* send: Sends the XHR.
*
* @param [Mixed] options Requests parameters.
*/
window.Request.prototype.send = function send(data)
{

    data = data || this.options.data || '';

    if (typeof data == 'object') {
        data = Object.toQueryString(data);
    }
    
    this.$request.send(data);
    return this;
    
};


/**
* send: Sends the XHR as Binary.
*
* @param [Mixed] options Requests parameters.
*/
window.Request.prototype.sendAsBinary = function sendAsBinary(data)
{

    this.$request.sendAsBinary(data);
    return this;

};


/*****
*
* Element
*  ~ Extends native HTMLElement and creates a type Element.
*
*****/


/**
* addEvent: Adds one or several EventListener(s) to a HTMLElement.
*
* @param String/Object id Event name or List of Events.
* @param [Function] fn The function to call on event (Only for single event).
*/
window.HTMLElement.prototype.addEvent = function addEvent(id, fn)
{

    if (typeof id == 'string') {
        this.$events = (this.$events ? this.$events : {});
        this.$events[id] = fn;
        this.addEventListener(id, fn, true);
    } else if (typeof id == 'object') {
        for (var key in id) {
            this.addEvent(key, id[key]);
        }
    }

    return this;

};
window.HTMLElement.prototype.addEvents = window.HTMLElement.prototype.addEvent;


/*
* removeEvent: Removes an Event from a HTMLElement.
*
* @param String/Array id Name(s) of the Event(s) to remove.
*/
window.HTMLElement.prototype.removeEvent = function removeEvent(id)
{

    if (typeof id == 'string') {
        this.removeEventListener(id, this.$events[id], true);
    } else if (typeof id == 'object') {
        for (var i = 0; i < id.length; i++) {
            this.removeEvent(id[i]);
        }
    }

    return this;

};
window.HTMLElement.prototype.removeEvents =
 window.HTMLElement.prototype.removeEvent;


/*
* removeAllEvents: Removes all Events from a HTMLElement.
*
*/
window.HTMLElement.prototype.removeAllEvents = function removeAllEvents()
{

    if (this.$events) {
        for (var key in this.$events) {
            this.removeEvent(key);
        }
    }

    return this;

};


/*
* dispose: Removes an Element from DOM.
*
*/
window.HTMLElement.prototype.dispose = function dispose()
{

	return (this.parentNode) ? this.parentNode.removeChild(this) : this;

};


/*
* destroy: Removes an Element from DOM after emptying it and removing Events.
*
*/
window.HTMLElement.prototype.destroy = function destroy()
{

    this.removeAllEvents();
    this.empty();
    this.dispose();

    return this;

};


/*
* empty: Empties an HTML Element.
*
*/
window.HTMLElement.prototype.empty = function empty()
{

    var content = this.getElementsByTagName('*');
    var len = content.length;
    for (var i = 0; i < len; i++) {
        if (content[0]) {
            content[0].destroy();        
        }
    }
    this.innerHTML = '';

    return this;
    
};


/*
* getChildren: Get the list of child nodes.
*
* @param [String] node Node type, default is all.
* @return Array The HTMLElement Collection.
*/
window.HTMLElement.prototype.getChildren = function getChildren(node)
{

    node = node || '*';
    return this.getElementsByTagName(node);

};


/*
* get: Get an attribute on an Element.
*
* @param String key Name of the attribute to get.
*/
window.HTMLElement.prototype.get = function get(key)
{

    if (key.toUpperCase() == 'TEXT') {
        return this.innerText;    
    } else if (key.toUpperCase() == 'HTML') {
        return this.innerHTML;
    } else {
        return this.getAttribute(key);
    }    

};


/*
* set: Set an attribute on an Element.
*
* @param String key Name of the attribute to set.
* @param String value Value of the attribute to set.
*/
window.HTMLElement.prototype.set = function set(key, value)
{

    if (key.toUpperCase() == 'TEXT') {
        this.innerText = value;    
    } else if (key.toUpperCase() == 'HTML') {
        this.innerHTML = value;
    } else {
        this.setAttribute(key, value);
    }

    return this;

};


/*
* remove: Removes an attribute on an Element.
*
* @param String key Name of the attribute to remove.
*/
window.HTMLElement.prototype.remove = function remove(key)
{

    if (key.toUpperCase() == 'TEXT') {
        this.innerText = '';    
    } else if (key.toUpperCase() == 'HTML') {
        this.innerHTML = '';
    } else {
        this.removeAttribute(key, value);
    }

    return this;

};


/*
* setStyle: Sets one or several CSS style(s) to an Element.
*
* @param String/Object key Name of the CSS attribute to set or Object of styles.
* @param [String] value Value of the CSS attribute to set (Only for single set).
*/
window.HTMLElement.prototype.setStyle = function setStyle(key, value)
{

    if (typeof key == 'string') {
        this.style[key] = NickelTools.formatStyleValue(key, value);    
    } else if (typeof key == 'object') {
        for (var value in key) {
            this.setStyle(value, key[value]);
        }
    }

    return this;

};
window.HTMLElement.prototype.setStyles = window.HTMLElement.prototype.setStyle;


/*
* getStyle: Gets one or several CSS style(s) from an Element.
*
* @param String/Array key Name of the CSS attribute(s) to get or Array of keys.
*/
window.HTMLElement.prototype.getStyle = function getStyle(key)
{

    if (typeof key == 'string') {
        return window.getComputedStyle(this).getPropertyValue(key);    
    } else if (typeof key == 'object') {
        var result = new Object();
        for (var i = 0; i < key.length; i++) {
            result[key[i]] = this.getStyle(key[i]);
        }
        return result;
    }

};
window.HTMLElement.prototype.getStyles = window.HTMLElement.prototype.getStyle;


/*
* removeStyle: Removes one or several CSS style(s) from an Element.
*
* @param String/Array key Name of the CSS attribute(s) to remove.
*/
window.HTMLElement.prototype.removeStyle = function removeStyle(key)
{

    if (typeof key == 'string') {
        this.setStyle(key, 0);
    } else if (typeof key == 'object') {
        var keys = new Object();
        for (var i = 0; i < key.length; i++) {
            keys[key[i]] = 0;
        }
        this.setStyles(keys);
    }

};
window.HTMLElement.prototype.removeStyles =
 window.HTMLElement.prototype.removeStyle;


/*
* Element: Creates an Element.
*
* @param String node Node type.
* @param [Object] options Element Options (id, rel, html...).
*/
window.Element = function Element(node, options)
{

    this.$element = document.createElement(node);

    for (var o in options) {
        if (o.toUpperCase() == 'TEXT') {
            this.$element.innerText = options[o];
        } else if (o.toUpperCase() == 'HTML') {
            this.$element.innerHTML = options[o];        
        } else {
            this.$element.setAttribute(o, options[o]);        
        } 
    }

    return this;

};


/*
* inject: Injects an Element into DOM.
*
* @param HTMLElement parent Where to inject.
* @param [String] The position to inject (top, bottom, before, after).
*/
window.Element.prototype.inject = function inject(parent, position)
{

    position = position || false;

    var el = null;
    
    if (position == 'top') {
        var firstChild = parent.firstChild;
        parent = firstChild.parentNode;
        el = firstChild;
    } else if (position == 'before') {
        el = parent;
        parent = parent.parentNode;
    } else if (position == 'after') {
        var next = parent.nextSibling;    
        parent = next.parentNode;
        el = next;
    }

    parent.insertBefore(this.$element, el);

    return this;

};


// Copies the HTMLElement prototype into the Element one.
for (var key in window.HTMLElement.prototype) {
    if (typeof window.HTMLElement.prototype[key] == 'function') {
        window.Element.subImplement(key, '$element');
    }
}


/*****
*
* Tools
*  ~ Nickeljs private Tools
*
*****/


/**
* Tools.Styles: Tools for CSS Styles handling.
*
*/
var NickelTools = {

    /**
    * px: Array of CSS Properties with default values as pixels.
    *
    */
    stylesAspx: [
        "border-bottom-left-radius", "border-bottom-right-radius",
        "border-bottom-width", "border-left-width", "border-right-width",
        "border-top-left-radius", "border-top-right-radius", "border-top-width",
        "bottom", "font-size", "height", "left", "letter-spacing",
        "line-height", "margin-bottom", "margin-left", "margin-right",
        "margin-top", "max-height", "max-width", "min-height", "min-width",
        "outline-width", "padding-bottom", "padding-left", "padding-right",
        "padding-top", "right", "top", "width", "word-spacing", "stroke-width"
    ],

    /**
    * formatStyleValue: Formats a Number style value regarding on the key.
    *
    * @param String key The CSS Style key.
    * @param Number value The CSS Style original value.
    * @return Mixed The formated Style value.
    */
    formatStyleValue: function formatStyleValue(key, value)
    {

        if (value == '' || value == false || value == undefined
         || value == null) {
            if (this.stylesAspx.contains(key)) {
                return '0px';
            } else {
                return 'none';
            }
        } else {
            return ((typeof value == 'number' && this.stylesAspx.contains(key))
             ? value.toString()+'px' : value);
        }

    }

};


})();
