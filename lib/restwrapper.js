var request = require('superagent');
    require('es6-promise').polyfill();

module.exports = function(url){
    'use strict';
    return {
        request:function(method,url,payload){
            return new Promise(function(resolve,reject){
                request[method](url)
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
        fetch: function(payload){
            var id = payload.id || payload.id;
            return this.request('get',url+'/'+id);
        },
        save: function(payload){
            return this.request('post', url, payload);
        },
        update: function(payload){
            var id = payload.id || payload._id;
            return this.request('put',url + '/' + id, payload);
        },
        del: function(payload){
            var id = payload.id || payload._id;
            return this.request('del',url + '/' + id, payload);
        }
   };
};
