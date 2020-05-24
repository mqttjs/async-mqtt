'use strict'

const net = require('net');
const Connection = require('mqtt-connection');

class Server extends net.Server {
  constructor (listener) {
    super()
    this.connectionList = []

    this.on('connection', duplex => {
      this.connectionList.push(duplex)
      const connection = new Connection(duplex, () => {
        this.emit('client', connection)
      })
    })

    if (listener) {
      this.on('client', listener)
    }
  }
}


const AsyncMQTT = require('./');
const { AsyncClient } = AsyncMQTT;

const test = require('tape');

const SERVER_PORT = 1883;
const SERVER_URL = `mqtt://localhost:${SERVER_PORT}`;

const server = buildServer().listen(SERVER_PORT);
server.unref();

server.on('listening', runTests);

function runTests () {
  test('Connect should return an instance of AsyncClient', t => {
    t.plan(1);
    const client = AsyncMQTT.connect(SERVER_URL);

    t.ok(client instanceof AsyncClient, 'Connect returned an AsyncClient');

    client.on('connect', () => {
      client.end();
    })
  });

  test('ConnectAsync should return AsyncClient after connection', t => {
    t.plan(1);

    AsyncMQTT.connectAsync(SERVER_URL, {}, false).then((client) => {
      t.ok(client.connected, 'AsyncClient is connected');

      client.end();
    }, (error) => {
      t.fail(error);
    });


  });

  test('Should be able to listen on event on client', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.once('connect', () => {
      t.pass('Connected');
      client.end();
    });
  });

  test('client.connected should be true', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.once('connect', () => {
      t.equal(client.connected, true)
      client.end();
    });
  });

  test('Calling end() should resolve once disconnected', t => {
    t.plan(2);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.on('close', () => {
      t.pass('Close event occured');
    });

    client.on('connect', () => {
      // Wait for connect to emit before ending
      client.end().then(() => {
        t.pass('End resolved');
      });
    });
  });

  test('Calling subscribe should resolve once subscribed', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.subscribe('example', {
      qos: 1
    }).then(() => {
      t.pass('Subscribed');
      client.end();
    })
  });

  test('Calling unsubscribe should resolve once completed', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.subscribe('example', {
      qos: 1
    }).then(() => client.unsubscribe('example')).then(() => {
      t.pass('Unsunbscribed');
      return client.end();
    });
  });

  test('Calling publish should resolve once completed', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.publish('example', 'test', {
      qos: 1
    }).then(() => {
      t.pass('Published');
      return client.end();
    });
  });

  test('Calling getLastMessageId should return number after published', t => {
    t.plan(1);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.publish('example', 'test', {
      qos: 1
    }).then(() => {
      t.ok('number' === typeof client.getLastMessageId(), 'Message id is number');
      return client.end();
    });
  });

  test('Calling reconnect after end should resolve once reconnect', t => {
    t.plan(2);

    const client = AsyncMQTT.connect(SERVER_URL);

    client.once('reconnect', () => {
      t.pass('Reconnect event occured');
      client.once('connect', () => {
        client.end();
      });
    });

    client.once('connect', () => {
      client.end().then(() => {
        t.pass('End resolved');
        client.reconnect();
      });
    });
  });
}

// Taken from MQTT.js tests
function buildServer () {
  return new Server(client => {
    client.on('connect', ({clientId}) => {
      if ('invalid' === clientId) {
        client.connack({returnCode: 2})
      } else {
        client.connack({returnCode: 0})
      }
    })

    client.on('publish', packet => {
      setImmediate(() => {
        switch (packet.qos) {
          case 0:
            break
          case 1:
            client.puback(packet)
            break
          case 2:
            client.pubrec(packet)
            break
          default:
            break
        }
      })
    })

    client.on('pubrel', packet => {
      client.pubcomp(packet)
    })

    client.on('pubrec', packet => {
      client.pubrel(packet)
    })

    client.on('pubcomp', () => {
      // Nothing to be done
    })

    client.on('subscribe', ({messageId, subscriptions}) => {
      client.suback({
        messageId,
        granted: subscriptions.map(({qos}) => qos)
      })
    })

    client.on('unsubscribe', packet => {
      client.unsuback(packet)
    })

    client.on('pingreq', () => {
      client.pingresp()
    })
  });
}
