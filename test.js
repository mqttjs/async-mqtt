"use strict";

var Server = require("mqtt/test/server");

var AsyncMQTT = require("./");
var AsyncClient = AsyncMQTT.AsyncClient;

var test = require("tape");

var SERVER_PORT = 1883;
var SERVER_URL = "mqtt://localhost:" + SERVER_PORT;

var server = buildServer().listen(SERVER_PORT);
server.unref();

server.on("listening", runTests);

function runTests() {
	test("Connect should return an instance of AsyncClient", function (t) {
		t.plan(1);
		var client = AsyncMQTT.connect(SERVER_URL);

		t.ok(client instanceof AsyncClient, "Connect returned an AsyncClient");

		client.end();
	});

	test("Should be able to listen on event on client", function (t) {
		t.plan(1);

		var client = AsyncMQTT.connect(SERVER_URL);

		client.once("connect", function () {
			t.pass("Connected");
			client.end();
		});
	});

	test("Calling end() should resolve once disconnected", function (t) {
		t.plan(2);

		var client = AsyncMQTT.connect(SERVER_URL);

		client.on("close", function () {
			t.pass("Close event occured");
		});

		client.on("connect", function () {
			// Wait for connect to emit before ending
			client.end().then(function(){
				t.pass("End resolved");
			});
		});
	});

	test("Calling subscribe should resolve once subscribed", function (t) {
		t.plan(1);

		var client = AsyncMQTT.connect(SERVER_URL);

		client.subscribe("example", {
			qos: 1
		}).then(function(){
			t.pass("Subscribed");
			client.end();
		})
	});

	test("Calling unsubscribe should resolve once completed", function(t){
		t.plan(1);

		var client = AsyncMQTT.connect(SERVER_URL);

		client.subscribe("example", {
			qos: 1
		}).then(function(){
			return client.unsubscribe("example");
		}).then(function(){
			t.pass("Unsunbscribed");
			return client.end();
		});
	});

	test("Calling publish should resolve once completed", function (t) {
		t.plan(1);

		var client = AsyncMQTT.connect(SERVER_URL);

		client.publish("example", "test", {
			qos: 1
		}).then(function(){
			t.pass("Published");
			return client.end();
		});
	});
}

// Taken from MQTT.js tests
function buildServer () {
  return new Server(function (client) {
    client.on('connect', function (packet) {
      if (packet.clientId === 'invalid') {
        client.connack({returnCode: 2})
      } else {
        client.connack({returnCode: 0})
      }
    })

    client.on('publish', function (packet) {
      setImmediate(function () {
        switch (packet.qos) {
          case 0:
            break
          case 1:
            client.puback(packet)
            break
          case 2:
            client.pubrec(packet)
            break
        }
      })
    })

    client.on('pubrel', function (packet) {
      client.pubcomp(packet)
    })

    client.on('pubrec', function (packet) {
      client.pubrel(packet)
    })

    client.on('pubcomp', function () {
      // Nothing to be done
    })

    client.on('subscribe', function (packet) {
      client.suback({
        messageId: packet.messageId,
        granted: packet.subscriptions.map(function (e) {
          return e.qos
        })
      })
    })

    client.on('unsubscribe', function (packet) {
      client.unsuback(packet)
    })

    client.on('pingreq', function () {
      client.pingresp()
    })
  })
}
