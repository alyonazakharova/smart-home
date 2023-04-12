This project is a UI for smart home sensors data.


Sensors are grouped by type. If a sensor value is higher or lower than some critical value, the panel is colored with red.

Also dynamic adding of panels is implemented. (Actually, it is _almost_ dynamic. Currently it's attached to hardcoded group names, so if a new group will be added, it won't be displayed in the application. However, it's fixable.)


[mqttConnector](https://github.com/alyonazakharova/smart-home/blob/main/src/mqttConnector.js) connects to mqtt broker, subscribes to all the topics and sends data to the client side (it is impossible to do it from React directly via mqtt, the only way to do it from browser is to do it with ws).

First run the following command from src folder:
```
node mqttConnector.js
```

When backend part is running, you can start client part with the following command (from smart-home folder):
```
npm start
```


Bellow you can find an illistration of the working app:

<img width="1440" alt="Screenshot 2023-04-11 at 18 55 50" src="https://user-images.githubusercontent.com/25694552/231221759-9c2195b8-acfd-4fd9-a7dc-98c2d6659271.png">
