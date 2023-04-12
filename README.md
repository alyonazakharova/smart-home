This project is a UI for smart home sensors.


Sensors are grouped by type. If a sensor value reaches some critical value, the panel is colored with red and a message to disable to whole group of sensors is sent.


User is able to change the name of the sensor using edit icon next to the current name of the sensor. After clicking the icon, a user will see an input field where he can enter a new name and press _Save_ button. Then sensor panel will display sensor's alias, real name in mqtt won't be affected.


Also dynamic adding of panels is implemented. (Actually, it is _almost_ dynamic. Currently it's attached to hardcoded group names, so if a new group will be added, it won't be displayed in the application. However, it's fixable.)


[mqttConnector](https://github.com/alyonazakharova/smart-home/blob/main/src/mqttConnector.js) connects to mqtt broker, subscribes to all the topics and sends data to the client side (it is impossible to do it from React directly via mqtt, the only way to do it from browser is to do it with ws).

## How to run

First, install all the dependencies required for the project (assuming that you have Node.js and npm installed):
```
npm i
```

Then run the following command from _src_ folder:
```
node mqttConnector.js
```

When backend part is running, you can start client part with the following command (from _smart-home_ folder):
```
npm start
```

## Example

Bellow you can find an illustration of the working app:

<img width="1440" alt="Screenshot 2023-04-12 at 14 07 11" src="https://user-images.githubusercontent.com/25694552/231440627-01d20fb9-5847-4731-8f5f-568c9e99c554.png">
