#RestWrapper
[![Build Status](https://travis-ci.org/lyleg/restwrapper.svg?branch=master)](https://travis-ci.org/lyleg/restwrapper)
#Simple REST Calls for NODE/Browserify

Version: 0.0.15 
I wrote this to be a simple way to communicate to REST Servers using the same syntax in my Node / Browserify applications.

It's a nice starting point for the mysterious WEB API often mentioned in FLUX tutorials.

URI can be parameterized according to http://tools.ietf.org/html/rfc6570

RestWrapper(uri, [paramDefaults], [headers]);

paramDefaults - Populate the uri template variables from payload object by prefixing an '@' in the attributes value
headers - pass any default headers as an object, ex {'secretToken':123}

Examples
````javascript
var Message = new RestWrapper('http://example.com/messages/{messageID}', {messageID:'@id'});
Message.get({id:123}).then(function(message){
 alert(message.text);
});

or

Message.get({messageID: 123}).then(function(message){
 alert(message.text);
});

````
````javascript
var newMessage = {text:"Hey, I think you're cool."};
Message.post(newMessage).then(function(message){
 alert('saved' + message.id).
});

var modifiedMessage = {id:123, text:"Heeeeeey"};//messageID is set from the id in the message object
Message.put(newMessage).then(function(message){
 alert('updated');
});
````
Feel free to tack on your own methods
````javascript
Message.save = function(params,payload){
  if(payload.id){
     return this.put(params,payload);
  }else{
     return this.post(params,payload);
  }
};
````


