

<!-- Start dist/restwrapper.js -->

## request

# RestWrapper

#Simple REST Calls for NODE/Browserify 

Version: 0.0.6 
I wrote this to be a simple way to communicate to REST Servers using the same syntax in my Node / Browserify applications.
It's a nice starting point for the mysterious WEB API often mentioned in FLUX tutorials.

Examples
var Message = new RestWrapper('http://example.com/messages/{messageID}');
Message.get({messageID:123}).then(function(message){
 alert(message.text);
});
````javascript
var newMessage = {text:'Hey, I think you're cool.'}
Message.post(newMessage).then(function(message){
 alert('saved' + message.id).
});
````
Feel free to tack on your own methods
````javascript
Message.customPost = function(){
 var customParams = {messageID:'123'},
      newPayload = {text:'Hey',otherAttr:'beep'};
  return this.post(customParams,newPayload)
};
````

<!-- End dist/restwrapper.js -->

