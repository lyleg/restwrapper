var Rest = require('../index'),
    Test = require('tape'),
    Sinon = require('sinon');
    require('es6-promise').polyfill();


var withPayloadDefaults = new Rest('http://example.com/{exampleID}',{exampleID:'@id'});
var withHardCodedDefaults = new Rest('http://example.com/{exampleID}/message/{stringMessage}',{exampleID:5,stringMessage:'hey'});
var withoutDefaults = new Rest('http://example.com/');
    
Test('buildURI',function(t){
    t.plan(4);
    t.equal(withPayloadDefaults.buildURI({'exampleID':1}),'http://example.com/1');
    t.equal(withPayloadDefaults.buildURI({},{id:2,foo:3,bar:4}),'http://example.com/2');
    t.equal(withHardCodedDefaults.buildURI(),'http://example.com/5/message/hey');
    t.equal(withoutDefaults.buildURI(),'http://example.com/');
});

Test('ParamDefaulter',function(t){
    t.plan(5);
    t.deepEqual(withPayloadDefaults.paramDefaulter({exampleID:1},{}),{exampleID:1});
    t.deepEqual(withPayloadDefaults.paramDefaulter({},{id:1}),{exampleID:1});
    t.deepEqual(withPayloadDefaults.paramDefaulter({exampleID:5},{id:1}),{exampleID:5});
    t.deepEqual(withPayloadDefaults.paramDefaulter(),{});
    t.deepEqual(withHardCodedDefaults.paramDefaulter(),{exampleID:5,stringMessage:'hey'});
});

Test('ArgumentBuilder',function(t){
    t.plan(4);
    var args = withPayloadDefaults.argumentBuilder({id:1},{message:'hi'});
    t.deepEqual(args.params,{id:1});
    t.deepEqual(args.payload,{message:'hi'});

    var args = withPayloadDefaults.argumentBuilder({message:'hi'});
    t.deepEqual(args.params,{});
    t.deepEqual(args.payload,{message:'hi'});
});


