import React, { useState, useEffect } from 'react';
import SensorItem from './SensorItem'
import { info } from 'console';

interface SensorData {
  group: string,
  name: string,
  value: string,
  unit?: string,
  critical: boolean;
}

function App() {
  const [values, setValues] = useState<Record<string, SensorData>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      // const sensorValue = event.data.split("###");

      const received: SensorData = JSON.parse(event.data);
      console.log("RECEIVED: ", received);

      // TODO enable
      if (received.group === '0XAAD') {
        // light
        const value: number = Number(received.value);
        if (value > 800) {
          
          alert(`Illumination is higher than 800 Lux (${received.name}: ${value} Lux)`)
          received.critical = true;
          // console.log("NEW VALUES: ", received)
        }
      } else if (received.group === 'OXDFA') {
        // temperature
        // 50 С = 122 F
        const criticalValue: number = received.unit === 'C' ? 50 : 122;
        const value: number = Number(received.value);
        if (value > criticalValue) {
          alert(`Temperature is higher that 50C (${received.name}: ${value} ${received.unit})`)
          received.critical = true;
        }
      } else if (received.group === '0XBNA') {
        // electricity
        const value: number = Number(received.value);
        if (value < 170) {
          alert(`Voltage is lower than 170 V (${received.name}: ${value} V)`)
        }

      }

      // setValues((prevValues) => ({ ...prevValues, [sensorValue[0]]: sensorValue[1] }));
      setValues((prevValues) => ({ ...prevValues, [received.name]: received }));
      // console.log("VALUES: ", values)

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
      <h3>Light:</h3>
      <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: "flex" }}>
          <SensorItem icon="/assets/bathroom.png" name="lum_bathroom" value={values['um_bathroom'] ? values['um_bathroom'].value + " " + values['um_bathroom'].unit : "-"} critical={values['um_bathroom'] ? values['um_bathroom'].critical : undefined} />
          <SensorItem icon="/assets/bedroom.png" name="lum_bedroom" value={values['lum_bedroom'] ? values['lum_bedroom'].value + " " + values['lum_bedroom'].unit : "-"} critical={values['lum_bedroom'] ? values['lum_bedroom'].critical : undefined}/>
          <SensorItem icon="/assets/kitchen.png" name="lum_kitchen" value={values['lum_kitchen'] ? values['lum_kitchen'].value + " " + values['lum_kitchen'].unit : "-"} critical={values['lum_kitchen'] ? values['lum_kitchen'].critical : undefined}/>
          <SensorItem icon="/assets/entrance.png" name="lum_entrance" value={values['lum_entrance'] ? values['lum_entrance'].value + " " + values['lum_entrance'].unit : "-"} critical={values['lum_entrance'] ? values['lum_entrance'].critical : undefined}/>
        </div>
        {/* <span>sensors/0XAAD/enable: {values['sensors/0XAAD/enable']}</span> */}
      </div>

      <br />
      <h3>???))):</h3>
      <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: "flex" }}>
          <SensorItem icon="/assets/entrance.png" name="entrance" value={values['entrance'] ? values['entrance'].value : "-"} critical={undefined}/>
          <SensorItem icon="/assets/window.png" name="window" value={values['window'] ? values['window'].value : "-"} critical={undefined}/>
          <SensorItem icon="/assets/backyard.png" name="backyard" value={values['backyard'] ? values['backyard'].value : "-"} critical={undefined}/>
        </div>
        {/* <span>sensors/0XEDD/enable: {values['sensors/0XEDD/enable']}</span> */}
      </div>

      <br />
      <h3>Temperature:</h3>
      <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: "flex" }}>
          <SensorItem icon="/assets/boiler.png" name="temp_boiler" value={values['temp_boiler'] ? values['temp_boiler'].value + " " + values['temp_boiler'].unit : "-"} critical={values['temp_boiler'] ? values['temp_boiler'].critical : undefined }/>
          <SensorItem icon="/assets/floor.png" name="temp_floor" value={values['temp_floor'] ? values['temp_floor'].value + " " + values['temp_floor'].unit : "-"} critical={values['temp_floor'] ? values['temp_floor'].critical : undefined}/>
        </div>
        {/* <span>sensors/0XAAD/enable: {values['sensors/0XAAD/enable']}</span> */}
      </div>

      <br />
      <h3>Sockets:</h3>
      <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: "flex" }}>
          <SensorItem icon="/assets/cellar.png" name="sockets_cellar" value={values['sockets_cellar'] ? values['sockets_cellar'].value + " " + values['sockets_cellar'].unit : "-"} critical={values['sockets_cellar'] ? values['sockets_cellar'].critical : undefined}/>
          <SensorItem icon="/assets/sockets_common.png" name="sockets_common" value={values['sockets_common'] ? values['sockets_common'].value + " " + values['sockets_common'].unit : "-"} critical={values['sockets_common'] ? values['sockets_common'].critical : undefined}/>
        </div>
        {/* <span>sensors/0XBNA/enable: {values['sensors/0XBNA/enable']}</span> */}
      </div>
    </div>
  );
}

export default App;
