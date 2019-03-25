'use strict'

const mqtt = require('mqtt');

const RegularClientPrototype = mqtt.MqttClient.prototype;

class AsyncClient {
  constructor (client) {
    this._client = client;
  }

  set handleMessage (newHandler) {
    this._client.handleMessage = newHandler;
  }

  get handleMessage () {
    return this._client.handleMessage;
  }

  get connected () {
    return this._client.connected;
  }

  publish (...args) {
    return new Promise((resolve, reject) => {
      this._client.publish(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  subscribe (...args) {
    return new Promise((resolve, reject) => {
      this._client.subscribe(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  unsubscribe (...args) {
    return new Promise((resolve, reject) => {
      this._client.unsubscribe(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  end (...args) {
    return new Promise((resolve, reject) => {
      this._client.end(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  addListener (...args) {
    return this._client.addListener(...args);
  }

  emit (...args) {
    return this._client.emit(...args);
  }

  eventNames (...args) {
    return this._client.eventNames(...args);
  }

  getMaxListeners (...args) {
    return this._client.getMaxListeners(...args);
  }

  listenerCount (...args) {
    return this._client.listenerCount(...args);
  }

  listeners (...args) {
    return this._client.listeners(...args);
  }

  off (...args) {
    return this._client.off(...args);
  }

  on (...args) {
    return this._client.on(...args);
  }

  once (...args) {
    return this._client.once(...args);
  }

  prependListener (...args) {
    return this._client.prependListener(...args);
  }

  prependOnceListener (...args) {
    return this._client.prependOnceListener(...args);
  }

  removeAllListeners (...args) {
    return this._client.removeAllListeners(...args);
  }

  removeListener (...args) {
    return this._client.removeListener(...args);
  }

  setMaxListeners (...args) {
    return this._client.setMaxListeners(...args);
  }

  rawListeners (...args) {
    return this._client.rawListeners(...args);
  }
}


module.exports = {
  connect (brokerURL, opts) {
    const client = mqtt.connect(brokerURL, opts);
    const asyncClient = new AsyncClient(client);
  
    return asyncClient;
  },
  AsyncClient
};
