"use strict";

/**
 * # RestWrapper
 * 
 * #Simple REST Calls for NODE/Browserify 
 * @version 0.0.8
 *
 * I wrote this to be a simple way to communicate to REST Servers using the same syntax in my Node / Browserify applications.
 *
 * It's a nice starting point for the mysterious WEB API often mentioned in FLUX tutorials.
 * RestWrapper(uri, [paramDefaults], [headers]);
 *
 * URI can be parameterized according to http://tools.ietf.org/html/rfc6570
 * paramDefaults - Populate the uri template variables from payload object by prefixing an '@' in the attributes value
 * headers - pass any default headers as an object, ex {'secretToken':123}
 *
 * Examples
 *````javascript
 * var Message = new RestWrapper('http://example.com/messages/{messageID}', {messageID:'@id'});
 * Message.get({messageID:123}).then(function(message){
 *  alert(message.text);
 * });
 *````
 *````javascript
 * var newMessage = {text:"Hey, I think you're cool."};
 * Message.post(newMessage).then(function(message){
 *  alert('saved' + message.id).
 * });
 *
 * var modifiedMessage = {id:123, text:"Heeeeeey"};//messageID is set from the id in the message object
 * Message.put(newMessage).then(function(message){
 *  alert('updated');
 * });
 *````
 * Feel free to tack on your own methods
 *````javascript
 * Message.save = function(params,payload){
 *   if(payload.id){
 *      return this.put(params,payload);
 *   }else{
 *      return this.post(params,payload);
 *   }
 * };
 * ````
 */
var request = require("superagent"),
    uriTemplates = require("uri-templates"),
    ObjectAssign = require("object-assign");

module.exports = function (uri) {
  var paramDefaults = arguments[1] === undefined ? {} : arguments[1];
  "use strict";
  var uriTemplate = uriTemplates(uri);

  return {
    headers: {},
    /*! go through each possible param in template
        if a passed in value exists
            use it
        else,
            check the defaults
            if default
              use the attr of payload or hardcoded number
    */
    paramDefaulter: function paramDefaulter() {
      var params = arguments[0] === undefined ? {} : arguments[0];
      var payload = arguments[1] === undefined ? {} : arguments[1];
      uriTemplate.varNames.forEach(function (varName) {
        if (!params[varName] && paramDefaults[varName]) {
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
        request[method](uri).send(payload).set(self.headers).end(function (err, res) {
          if (err) {
            reject();
          }
          resolve(res);
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
      var _ref;
      var _argumentBuilder$apply = (_ref = this).argumentBuilder.apply(_ref, arguments);

      var payload = _argumentBuilder$apply.payload;
      var params = _argumentBuilder$apply.params;
      return this.request("post", this.buildURI(params, payload), payload);
    },
    update: function update(a1, a2) {
      var _ref2;
      var _argumentBuilder$apply2 = (_ref2 = this).argumentBuilder.apply(_ref2, arguments);

      var payload = _argumentBuilder$apply2.payload;
      var params = _argumentBuilder$apply2.params;
      return this.request("put", this.buildURI(params, payload), payload);
    },
    del: function del(a1, a2) {
      var _ref3;
      var _argumentBuilder$apply3 = (_ref3 = this).argumentBuilder.apply(_ref3, arguments);

      var payload = _argumentBuilder$apply3.payload;
      var params = _argumentBuilder$apply3.params;
      return this.request("del", this.buildURI(params, payload), payload);
    }
  };
};
