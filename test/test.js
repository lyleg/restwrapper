var Rest = require('../lib/restwrapper'),
    test = require('tape');


var testRest = new Rest('http://example.com/{exampleID}',{exampleID:'@id'});
    
test('buildURI',function(t){
    t.plan(2);
    t.equal(testRest.$buildURI({'exampleID':1}),'http://example.com/1');
    t.equal(testRest.$buildURI({},{id:2,foo:3,bar:4}),'http://example.com/2');
});
