"use strict";

/**
 * # RestWrapper
 * 
 * #Simple REST Calls for NODE/Browserify 
 * @version 0.0.6
 *
 * I wrote this to be a simple way to communicate to REST Servers using the same syntax in my Node / Browserify applications.
 * It's a nice starting point for the mysterious WEB API often mentioned in FLUX tutorials.
 *
 * Examples
 * var Message = new RestWrapper('http://example.com/messages/{messageID}');
 * Message.get({messageID:123}).then(function(message){
 *  alert(message.text);
 * });
 *````javascript
 * var newMessage = {text:'Hey, I think you're cool.'}
 * Message.post(newMessage).then(function(message){
 *  alert('saved' + message.id).
 * });
 *````
 * Feel free to tack on your own methods
 *````javascript
 * Message.customPost = function(){
 *  var customParams = {messageID:'123'},
 *       newPayload = {text:'Hey',otherAttr:'beep'};
 *   return this.post(customParams,newPayload)
 * };
 * ````
 */
var request = require("superagent"),
    uriTemplates = require("uri-templates"),
    ObjectAssign = require("object-assign");
require("es6-promise").polyfill();

module.exports = function (uri) {
  var paramDefaults = arguments[1] === undefined ? {} : arguments[1];
  var defaultHeaders = arguments[2] === undefined ? {} : arguments[2];
  //URI can be parameterized according to http://tools.ietf.org/html/rfc6570
  "use strict";
  var uriTemplate = uriTemplates(uri);

  return {
    /*! go through each possible param in template
        if a passed in value exists
            use it
        else,
            check the defaults
            if default
              use the attr of payload or hardcoded number
    */
    paramDefaulter: function paramDefaulter(params, payload) {
      params = params || {};
      payload = payload || {};
      uriTemplate.varNames.forEach(function (varName) {
        if (!params[varName] && paramDefaults[varName]) {
          // how is params undefined?
          var arr = paramDefaults[varName].split("@"), value;
          if (arr.length === 2) {
            if (typeof payload !== "undefined" && typeof payload[arr[1]] !== "undefined") {
              value = payload[arr[1]];
              params[varName] = value;
            }
          } else {
            params[varName] = arr;
          }
        }
      });

      return params;
    },
    setDefaultHeaders: function setDefaultHeaders(defaultHeaders) {
      defaultHeaders = defaultHeaders;
    },
    buildURI: function buildURI(params, payload) {
      params = this.paramDefaulter(params, payload);
      return uriTemplate.fillFromObject(params);
    },
    request: (function (_request) {
      var _requestWrapper = function request() {
        return _request.apply(this, arguments);
      };

      _requestWrapper.toString = function () {
        return _request.toString();
      };

      return _requestWrapper;
    })(function (method, uri, payload) {
      var self = this;
      return new Promise(function (resolve, reject) {
        request[method](uri).send(payload).set(defaultHeaders).end(function (err, res) {
          if (err) {
            reject();
          }
          var data = res.body.payload;
          resolve(data);
        });
      });
    }),
    argumentBuilder: function argumentBuilder(a1, a2) {
      var args = {};
      if (arguments.length === 2) {
        args.params = a1;
        args.payload = a2;
      } else {
        args.payload = a1;
        args.params = {};
      }
      return args;
    },
    get: function get(params) {
      return this.request("get", this.buildURI(params));
    },
    post: function post(a1, a2) {
      var _argumentBuilder = this.argumentBuilder(a1, a2);

      var payload = _argumentBuilder.payload;
      var params = _argumentBuilder.params;
      return this.request("post", this.buildURI(params, payload), payload);
    },
    update: function update(a1, a2) {
      var _argumentBuilder2 = this.argumentBuilder(a1, a2);

      var payload = _argumentBuilder2.payload;
      var params = _argumentBuilder2.params;
      return this.request("put", this.buildURI(params, payload), payload);
    },
    del: function del(a1, a2) {
      var _argumentBuilder3 = this.argumentBuilder(a1, a2);

      var payload = _argumentBuilder3.payload;
      var params = _argumentBuilder3.params;
      return this.request("del", this.buildURI(params, payload), payload);
    }
  };
};
