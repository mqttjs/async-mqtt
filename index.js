"use strict";
var mqtt = require("mqtt");
var inArray = require("in-array");

var RegularClientPrototype = mqtt.MqttClient.prototype;

var ASYNC_METHODS = ["publish",
	"subscribe",
	"unsubscribe",
	"unsubscribe",
	"end"
];

var SYNC_METHODS = [
	"emit",
	"addListener",
	"on",
	"once",
	"removeListener",
	"removeAllListeners",
	"setMaxListeners",
	"getMaxListeners",
	"listeners",
	"listenerCount"
];

module.exports = {
	connect: connect,
	AsyncClient: AsyncClient
};

function connect(brokerURL, opts) {
	var client = mqtt.connect(brokerURL, opts);

	var asyncClient = new AsyncClient(client);

	return asyncClient;
}

function AsyncClient(client) {
	this._client = client;
}

AsyncClient.prototype = {
	set handleMessage(newHandler) {
		this._client.handleMessage = newHandler;
	},
	get handleMessage() {
		return this._client.handleMessage;
	}
};

ASYNC_METHODS.forEach(defineAsync);
SYNC_METHODS.forEach(definePassthrough);

function definePassthrough(name) {
	AsyncClient.prototype[name] = function() {
		var client = this._client;
		return client[name].apply(client, arguments);
	};
}

function defineAsync(name) {
	AsyncClient.prototype[name] = function asyncMethod() {
		var client = this._client;
		var args = [];
		var length = arguments.length;
		var i = 0;
		for (i; i < length; i++)
			args.push(arguments[i]);

		return new Promise(function(resolve, reject) {
			args.push(makeCallback(resolve, reject));
			client[name].apply(client, args);
		});
	};
}

function makeCallback(resolve, reject) {
	return function(err, data) {
		if (err)
			reject(err);
		else resolve(data);
	};
}
