const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const mqttClient = mqtt.connect('mqtt://185.185.68.206:1883');
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('#');
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  ws.on('message', (message) => {
    console.log(`Received WebSocket message: ${message}`);
  });
});

class SensorData {
  constructor(group, name, value, unit) {
    this.group = group;
    this.name = name;
    this.value = value;
    this.unit = unit;
  }
}

mqttClient.on('message', (topic, message) => {
  console.log(`Received MQTT message on topic ${topic}: ${message.toString()}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {

      const sensorNameParts = topic.split("/");
      const sensorGroup = sensorNameParts[1];
      const sensorName = sensorNameParts[2];
      const sensorValue = message.toString().split(" ");
      const value = sensorValue[0];
      var unit = "";
      if (sensorValue[1]) {
        unit = sensorValue[1]
      }
      const sensorData = new SensorData(sensorGroup, sensorName, value, unit);

      client.send(JSON.stringify(sensorData));
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
