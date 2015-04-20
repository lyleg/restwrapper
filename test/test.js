const Rest = require('../index'),
    Test = require('tape');
    require('es6-promise').polyfill();


const withPayloadDefaults = new Rest('http://example.com/{exampleID}', {exampleID: '@id'});

const withHardCodedDefaults = new Rest('http://example.com/{exampleID}/message/{stringMessage}', {exampleID: 5, stringMessage: 'hey'});

const withoutDefaults = new Rest('http://example.com/');

const beforeSend = function(){
    this.foo = 1;
    return true;
};
const withPayloadDefaultsBeforeSend = new Rest('http://example.com/{exampleID}', {exampleID: '@id'}, beforeSend);

Test('buildURI', function(t){
    t.plan(4);
    t.equal(withPayloadDefaults.buildURI({'exampleID': 1}), 'http://example.com/1');
    t.equal(withPayloadDefaults.buildURI({}, {id: 2, foo: 3, bar: 4}), 'http://example.com/2');
    t.equal(withHardCodedDefaults.buildURI(), 'http://example.com/5/message/hey');
    t.equal(withoutDefaults.buildURI(), 'http://example.com/');
});

Test('ParamDefaulter', function(t){
    t.plan(5);
    t.deepEqual(withPayloadDefaults.paramDefaulter({exampleID: 1}, {}), {exampleID: 1});
    t.deepEqual(withPayloadDefaults.paramDefaulter({}, {id: 1}), {exampleID: 1});
    t.deepEqual(withPayloadDefaults.paramDefaulter({exampleID: 5}, {id: 1}), {exampleID: 5});
    t.deepEqual(withPayloadDefaults.paramDefaulter(), {});
    t.deepEqual(withHardCodedDefaults.paramDefaulter(), {exampleID: 5, stringMessage: 'hey'});
});

Test('ArgumentBuilder', function(t){
    t.plan(4);
    let args = withPayloadDefaults.argumentBuilder({id: 1}, {message: 'hi'});
    t.deepEqual(args.params, {id: 1});
    t.deepEqual(args.payload, {message: 'hi'});

    args = withPayloadDefaults.argumentBuilder({message: 'hi'});
    t.deepEqual(args.params, {});
    t.deepEqual(args.payload, {message: 'hi'});
});

Test('BeforeSend', function(t){
   t.plan(2);
   withPayloadDefaultsBeforeSend.beforeSend();

   t.equal(withPayloadDefaultsBeforeSend.foo, 1);

   withPayloadDefaultsBeforeSend.beforeSend = function(){
    this.foo = 5;
   };

   withPayloadDefaultsBeforeSend.beforeSend();
   t.equal(withPayloadDefaultsBeforeSend.foo, 5);
});


