# async-mqtt

Promise wrapper over MQTT.js

**IMPORANT: Make sure you handle rejections from returned promises because otherwise you might not see them**

## API

The API is the same as [MQTT.js](https://github.com/mqttjs/MQTT.js#api), except the following functions now return promises instead of taking callbacks

- publish
- subscribe
- unsubscribe
- end
