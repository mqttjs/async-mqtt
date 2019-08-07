<h1 align="center">async-mqtt</h1>
<p align="center">Promise wrapper over MQTT.js</p>
<p align="center">
<a href="https://github.com/mqttjs/async-mqtt">
    <img alt="" src="https://david-dm.org/mqttjs/async-mqtt.svg?style=flat-square">
</a>
<a href="https://www.npmjs.com/package/async-mqtt">
    <img alt="" src="https://img.shields.io/npm/dt/async-mqtt.svg?style=flat-square">
</a>
<a href="https://www.npmjs.com/package/async-mqtt">
    <img alt="" src="https://img.shields.io/npm/v/async-mqtt.svg?style=flat-square">
</a>
<br>
<a href="https://github.com/mqttjs/async-mqtt">
    <img alt="" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square">
</a>
</p>

**IMPORTANT: Make sure you handle rejections from returned promises because they won't crash the process**

## API

The API is the same as [MQTT.js](https://github.com/mqttjs/MQTT.js#api), except the following functions now return promises instead of taking callbacks

- publish
- subscribe
- unsubscribe
- end


## Example

```javascript
const MQTT = require("async-mqtt");

const client = MQTT.connect("tcp://somehost.com:1883");

// When passing async functions as event listeners, make sure to have a try catch block

const doStuff = async () => {

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

client.on("connect", doStuff);
```

Alternately you can skip the event listeners and get a promise.

```js
const MQTT = require("async-mqtt");

run()

async function run() {
  const client = await MQTT.connectAsync("tcp://somehost.com:1883")

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
const { AsyncClient } = require("async-mqtt");

const client = getRegularMQTTClientFromSomewhere();

const asyncClient = new AsyncClient(client);

asyncClient.publish("foo/bar", "baz").then(() => {
	console.log("We async now");
	return asyncClient.end();
});
```
