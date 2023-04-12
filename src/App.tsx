import React, { useState, useEffect } from 'react';
import SensorItem from './SensorItem'
import { group } from 'console';

interface SensorData {
  group: string,
  name: string,
  value: string,
  unit?: string,
  critical: boolean;
  userAlias?: string;
}

const io = require('socket.io-client');
const socket = io('http://185.185.68.206:3000');

function disableGroup(group: string) {
  const message = {
    group: group,
    value: 'off'
  };
  socket.emit('enable', JSON.stringify(message));
  console.log(`Disabled sensors group ${group}`);
}

function App() {
  const [values, setValues] = useState<Record<string, SensorData>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const received: SensorData = JSON.parse(event.data);

      console.log('RECEIVED: ', received);

      if (received.group === '0XAAD') {
        // illumination
        const value: number = Number(received.value);
        if (value > 800) {
          // alert(`Illumination is higher than 800 Lux (${received.name}: ${value} Lux)`)
          console.log(`Illumination is higher than 800 Lux (${received.name}: ${value} Lux)`)
          received.critical = true;
        }
      } else if (received.group === 'OXDFA') {
        // temperature
        // 50 С = 122 F
        const criticalValue: number = received.unit === 'C' ? 50 : 122;
        const value: number = Number(received.value);
        if (value > criticalValue) {
          // alert(`Temperature is higher that 50C (${received.name}: ${value} ${received.unit})`)
          console.log(`Temperature is higher that 50C (${received.name}: ${value} ${received.unit})`)
          received.critical = true;
        }
      } else if (received.group === '0XBNA') {
        // electricity
        // FIXME sockets_kitchen is always empty
        const value: number | undefined = received.value ? Number(received.value) : undefined;
        if (value && value < 170) {
          // alert(`Voltage is lower than 170 V (${received.name}: ${value} V)`)
          console.log(`Voltage is lower than 170 V (${received.name}: ${value} V)`)
          received.critical = true;
        }
      }

      if (received.critical) {
        disableGroup(received.group);
      }

      // FIXME!!!!!!!!!!!!!!!!!
      var sensorName = received.name;
      if (sensorName === 'enable') {
        sensorName = received.group + "/" + received.name;
      }

      // in order to keep user alias for the sensor after value update
      // const exsitingData: SensorData | undefined = values[sensorName];
      // if (exsitingData) {
      //   received.userAlias = exsitingData.userAlias;
      // }

      setValues((prevValues) => ({ ...prevValues, [sensorName]: received }));
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      {['0XAAD', '0XBNA', 'OXDFA', '0XEDD'].map(group => (
        <div key={group}>
          <h3 style={{ margin: '10px' }}>{group}</h3>
          <div style={{ display: "flex", margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
            {Object.keys(values).map(key => {
              if (values[key].group === group)
                return (
                  <SensorItem icon={`/assets/${values[key].name}.png`}
                    name={values[key].name}
                    value={values[key].value + " " + values[key].unit}
                    critical={values[key].critical}
                  />
                )
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
