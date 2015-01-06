var request = require('superagent'),
    uriTemplates = require('uri-templates');
    require('es6-promise').polyfill();

module.exports = function(uri, paramDefaults, actions,options){//URI can be parameterized according to http://tools.ietf.org/html/rfc6570
    'use strict';
    
    var uriTemplate = uriTemplates(uri);

    function paramDefaulter(payload){
        //if a paramDefault exists in payload, generate params with the key/value to be used by fillFromObject
        var params = {};
        Object.keys(paramDefaults).forEach(function(paramDefault){
            var arr = paramDefaults[paramDefault].split('@'),
                value;
            if(arr.length === 2 && typeof payload[arr[1]] !== 'undefined'){
                value = payload[arr[1]];
                params[paramDefault] = value;
            }else{
                value=arr;
                params[paramDefault] = value;
            }
        });
        return params;
    }

    function buildURI(params){
        params = paramDefaulter(params);
        return uriTemplate.fillFromObject(params);
    }
    return {
        request:function(method,uri,payload){
            return new Promise(function(resolve,reject){
                request[method](uri)
                    .send(payload)
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
            return this.request('get',buildURI(params));
        },
        post:function(payload){
            return this.request('post',buildURI(payload),payload);
        },
        update: function(payload){
            return this.request('put',buildURI(payload), payload);
        },
        del: function(payload){
            return this.request('del',buildURI(payload), payload);
        }
   };
};
