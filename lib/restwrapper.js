var request = require('superagent');
    require('es6-promise').polyfill();

module.exports = function(url){
    return {
        request:function(method,url,payload){
            return new Promise(function(resolve,reject){
                request[method](url)
                    .send(payload)
                    .end(function(res){
                        data=res.body.payload;
                        resolve(data);
                    });
            });
        },
        fetch: function(payload){
            var self = this;
            var id = payload['id'] || payload['_id'];
            return this.request('get',url+'/'+id);
        },
        save: function(payload){
            return this.request('post', url, payload);
        },
        update: function(payload){
            var id = payload['id'] || payload['_id'];
            return this.request('put',url + '/' + id, payload);
        },
        delete: function(){
            var id = payload['id'] || payload['_id'];
            return this.request('delete',url + '/' + id, payload);
        },
   };
};
