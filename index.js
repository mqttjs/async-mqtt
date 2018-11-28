const mqtt = require('mqtt');
const RegularClientPrototype = mqtt.MqttClient.prototype;

class AsyncClient {
  constructor(client) {
    this.client = client
  }

  set handleMessage(newHandler) {
    this.client.handleMessage = newHandler;
  }

  get handleMessage() {
    return this.client.handleMessage;
  }

  publish(...args) {
    return Promise.resolve(this.client.publish(...args))
  }
  
  subscribe(...args) {
    return Promise.resolve(this.client.subscribe(...args))
  }
  
  unsubscribe(...args) {
    return Promise.resolve(this.client.unsubscribe(...args))
  }

  end(...args) {
    return Promise.resolve(this.client.end(...args))
  }

  addListener(...args) {
    this.client.addListener(...args);
  }

  emit(...args) {
    this.client.emit(...args);
  }

  eventNames(...args) {
    this.client.eventNames(...args);
  }

  getMaxListeners(...args) {
    this.client.getMaxListeners(...args);
  }

  listenerCount(...args) {
    this.client.listenerCount(...args);
  }

  listeners(...args) {
    this.client.listeners(...args);
  }

  off(...args) {
    this.client.off(...args);
  }

  on(...args) {
    this.client.on(...args);
  }

  once(...args) {
    this.client.once(...args);
  }

  prependListener(...args) {
    this.client.prependListener(...args);
  }

  prependOnceListener(...args) {
    this.client.prependOnceListener(...args);
  }

  removeAllListeners(...args) {
    this.client.removeAllListeners(...args);
  }

  removeListener(...args) {
    this.client.removeListener(...args);
  }

  setMaxListeners(...args) {
    this.client.setMaxListeners(...args);
  }

  rawListeners(...args) {
    this.client.rawListeners(...args);
  }
};

const connect = (brokerUrl, opts = {}) => {
  const client = mqtt.connect(brokerUrl, opts);
  const asyncClient = new AsyncClient(client);
  return asyncClient
}

module.exports = {
  connect,
  AsyncClient
}
