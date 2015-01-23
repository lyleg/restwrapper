var Rest = require('../index'),
    Test = require('tape'),
    Sinon = require('sinon');
    require('es6-promise').polyfill();


var testRest = new Rest('http://example.com/{exampleID}',{exampleID:'@id'});
    
Test('buildURI',function(t){
    t.plan(2);
    t.equal(testRest.buildURI({'exampleID':1}),'http://example.com/1');
    t.equal(testRest.buildURI({},{id:2,foo:3,bar:4}),'http://example.com/2');
});

Test('ParamDefaulter',function(t){
    t.plan(3);
    t.deepEqual(testRest.paramDefaulter({exampleID:1},{}),{exampleID:1});
    t.deepEqual(testRest.paramDefaulter({},{id:1}),{exampleID:1});
    t.deepEqual(testRest.paramDefaulter({exampleID:5},{id:1}),{exampleID:5});
});

Test('ArgumentBuilder',function(t){
    t.plan(4);
    var args = testRest.argumentBuilder({id:1},{message:'hi'});
    t.deepEqual(args.params,{id:1});
    t.deepEqual(args.payload,{message:'hi'});

    var args = testRest.argumentBuilder({message:'hi'});
    t.deepEqual(args.params,{});
    t.deepEqual(args.payload,{message:'hi'});
});


