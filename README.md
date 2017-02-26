# async-mqtt

Promise wrapper over MQTT.js

**IMPORANT: Make sure you handle rejections from returned promises because they won't crash the process**

## API

The API is the same as [MQTT.js](https://github.com/mqttjs/MQTT.js#api), except the following functions now return promises instead of taking callbacks

- publish
- subscribe
- unsubscribe
- end


## Example

```javascript
var MQTT = require("async-mqtt");

var client = MQTT.connect("tcp://somehost.com:1883");

// WHen passing async functions as event listeners, make sure to have a try catch block
client.on("connect", doStuff);

async function doStuff() {

	console.log("Starting");
	try {
		await client.publish("wow/so/cool", "It works!");
		// This line doesn't run until the server responds to the publish
		await client.end();
		// This line doesn't run until the client has disconnected without error
		console.log("Done");
	} catch (e){
		// Do something about it!
		console.log(e.stack);
		process.exit();
	}
}
```

## Wrapping existing client

```javascript
var AsyncClient = require("async-mqtt").AsyncClient;

var client = getRegularMQTTClientFromSomewhere();

var asyncClient = new AsyncClient(client);

asyncClient.publish("foo/bar", "baz").then(function(){
	console.log("We async now");
	return asyncClient.end();
});
```
