'use strict';

var request = require('superagent'),
    uriTemplates = require('uri-templates');

module.exports = function (uri, _x4, beforeSend) {
    'use strict';
    var paramDefaults = arguments[1] === undefined ? {} : arguments[1];
    var uriTemplate = uriTemplates(uri);
    return {
        beforeSend: beforeSend || function () {
            return true;
        },
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
                    if (typeof paramDefaults[varName] === 'string') {
                        var arr = paramDefaults[varName].split('@');
                        var value = undefined;
                        if (arr.length === 2) {
                            if (typeof payload !== 'undefined' && typeof payload[arr[1]] !== 'undefined') {
                                value = payload[arr[1]];
                                params[varName] = value;
                            }
                        } else {
                            params[varName] = arr[0];
                        }
                    } else {
                        params[varName] = paramDefaults[varName];
                    }
                }
            });

            return params;
        },
        buildURI: function buildURI() {
            var params = arguments[0] === undefined ? {} : arguments[0];
            var payload = arguments[1] === undefined ? {} : arguments[1];

            params = this.paramDefaulter(params, payload);
            return uriTemplate.fillFromObject(params);
        },
        request: (function (_request) {
            function request(_x, _x2, _x3) {
                return _request.apply(this, arguments);
            }

            request.toString = function () {
                return _request.toString();
            };

            return request;
        })(function (method, requestUri, payload) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                if (_this.beforeSend(method, requestUri, payload) !== false) {
                    request[method](requestUri).send(payload).set(_this.headers).end(function (err, res) {
                        if (res.error) {
                            reject(res.error);
                        }
                        resolve(res);
                    });
                }
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
            return this.request('get', this.buildURI(params));
        },
        post: function post() {
            var _argumentBuilder$apply = this.argumentBuilder.apply(this, arguments);

            var payload = _argumentBuilder$apply.payload;
            var params = _argumentBuilder$apply.params;

            return this.request('post', this.buildURI(params, payload), payload);
        },
        update: function update() {
            var _argumentBuilder$apply2 = this.argumentBuilder.apply(this, arguments);

            var payload = _argumentBuilder$apply2.payload;
            var params = _argumentBuilder$apply2.params;

            return this.request('put', this.buildURI(params, payload), payload);
        },
        del: function del() {
            var _argumentBuilder$apply3 = this.argumentBuilder.apply(this, arguments);

            var payload = _argumentBuilder$apply3.payload;
            var params = _argumentBuilder$apply3.params;

            return this.request('del', this.buildURI(params, payload), payload);
        },
        patch: function patch() {
            var _argumentBuilder$apply4 = this.argumentBuilder.apply(this, arguments);

            var payload = _argumentBuilder$apply4.payload;
            var params = _argumentBuilder$apply4.params;

            return this.request('patch', this.buildURI(params, payload), payload);
        }
    };
};
