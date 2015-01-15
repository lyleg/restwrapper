var request = require('superagent'),
    uriTemplates = require('uri-templates'),
    ObjectAssign = require('object-assign'),
    queryString = require('querystring');
    require('es6-promise').polyfill();

module.exports = function(uri, paramDefaults,actions,options){//URI can be parameterized according to http://tools.ietf.org/html/rfc6570
    'use strict';
    
    var uriTemplate = uriTemplates(uri);
    /* go through each possible param in template
        if a passed in value exists
            use it
        else,
            check the defaults
            if defualt
              use the attr of payload or hardcoded number
    */
    return {
        headers:{},
        paramDefaulter: function(params,payload){
            params = params || {};
            payload = payload || {};
            uriTemplate.varNames.forEach(function(varName){
                if(!params[varName] && paramDefaults[varName]){// how is params undefined?
                    var arr = paramDefaults[varName].split('@'),
                        value;
                    if( arr.length === 2 ){
                        if(typeof payload !== 'undefined' && typeof payload[arr[1]] !== 'undefined'){
                            value = payload[arr[1]];
                            params[varName] = value;
                        }
                    }else{
                        params[varName] = arr;
                    }
                }
            });

            return params;
        },

        buildURI: function(params,payload){
            params = this.paramDefaulter(params,payload);
            return uriTemplate.fillFromObject(params);
        },
        request:function(method,uri,payload){
            var self = this;
            return new Promise(function(resolve,reject){
                request[method](uri)
                    .send(payload)
                    .set(self.headers)
                    .end(function(err,res){
                        if(err){
                            reject();
                        }
                        var data=res.body.payload;
                        resolve(data);
                    });
            });
        },
        get: function(params){
            return this.request('get',this.buildURI(params));
        },
        post:function(a1,a2){
            var params, payload;
            if(arguments.length === 2){
                params = a1;
                payload = a2;
            }else{
                payload = a1;
                params = {};
            }
            return this.request('post',this.buildURI(params,payload),payload);
        },
        update: function(a1, a2){
            var params, payload;
            if(arguments.length === 2){
                params = a1;
                payload = a2;
            }else{
                payload = a1;
                params = {};
            }
            return this.request('put',this.buildURI(params,payload), payload);
        },
        del: function(a1, a2){
            var params, payload;
            if(arguments.length === 2){
                params = a1;
                payload = a2;
            }else{
                payload = a1;
                params = {};
            }
            return this.request('del',this.buildURI(params, payload), payload);
        }
   };
};
