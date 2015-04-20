/**
 * #RestWrapper
 *
 * #Simple REST Calls for NODE/Browserify
 * @version 0.0.12
 *
 * I wrote this to be a simple way to communicate to REST Servers using the same syntax in my Node / Browserify applications.
 *
 * It's a nice starting point for the mysterious WEB API often mentioned in FLUX tutorials.
 * RestWrapper(uri, [paramDefaults], [headers]);
 *
 * URI can be parameterized according to http://tools.ietf.org/html/rfc6570
 *
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
const request = require('superagent'),
    uriTemplates = require('uri-templates');

module.exports = function(uri, paramDefaults={}, beforeSend){
    'use strict';
    const uriTemplate = uriTemplates(uri);
    return {
        beforeSend: beforeSend || function(){return true; },
        headers: {},
    /*! go through each possible param in template
        if a passed in value exists
            use it
        else,
            check the defaults
            if default
              use the attr of payload or hardcoded number
    */
        paramDefaulter(params={}, payload={}){
            uriTemplate.varNames.forEach(function(varName){
                if(!params[varName] && paramDefaults[varName]){
                    if(typeof paramDefaults[varName] === 'string'){
                        const arr = paramDefaults[varName].split('@');
                        let value;
                        if( arr.length === 2 ){
                            if(typeof payload !== 'undefined' && typeof payload[arr[1]] !== 'undefined'){
                                value = payload[arr[1]];
                                params[varName] = value;
                            }
                        }else{
                            params[varName] = arr[0];
                        }
                    }else{
                            params[varName] = paramDefaults[varName];
                    }
                }
            });

            return params;
        },
        buildURI(params={}, payload={}){
            params = this.paramDefaulter(params, payload);
            return uriTemplate.fillFromObject(params);
        },
        request(method, requestUri, payload){
            return new Promise((resolve, reject)=>{
                if(this.beforeSend(method, requestUri, payload) !== false){
                    request[method](uri)
                        .send(payload)
                        .set(this.headers)
                        .end(function(err, res){
                            if(res.error){
                                reject(res.error);
                            }
                            resolve(res);
                        });
                 }
            });
        },
        argumentBuilder(a1, a2){
            let args = {};
                if(arguments.length === 2){
                    args.params = a1;
                    args.payload = a2;
                }else{
                    args.payload = a1;
                    args.params = {};
                }
            return args;
        },
        get(params){
            return this.request('get', this.buildURI(params));
        },
        post(){
            const {payload, params} = this.argumentBuilder(...arguments);
            return this.request('post', this.buildURI(params, payload), payload);
        },
        update(){
            const {payload, params} = this.argumentBuilder(...arguments);
                return this.request('put', this.buildURI(params, payload), payload);
        },
        del(){
            const {payload, params} = this.argumentBuilder(...arguments);
            return this.request('del', this.buildURI(params, payload), payload);
        }
   };
};
