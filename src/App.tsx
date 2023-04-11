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

function App() {
  const [values, setValues] = useState<Record<string, SensorData>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const received: SensorData = JSON.parse(event.data);

      // TODO enable
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
        // FIXME V is sometimes not separated from the value with space (to be fixed int mqttConnector)
        const value: number | undefined = received.value ? Number(received.value) : undefined;
        if (value && value < 170) {
          // alert(`Voltage is lower than 170 V (${received.name}: ${value} V)`)
          console.log(`Voltage is lower than 170 V (${received.name}: ${value} V)`)
        }
      }

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
          <h3 style={{margin: '10px'}}>{group}</h3>
          <div style={{ display: "flex", margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px'}}>
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
  
  // return (
  //   <div>
  //     {/* <h3 style={{margin: '10px'}}>Light:</h3>
  //     <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
  //       <div style={{ display: "flex" }}>
  //         <SensorItem icon="/assets/bathroom.png"
  //           name={values['lum_bathroom'] && values['lum_bathroom'].userAlias ? values['lum_bathroom'].userAlias : "lum_bathroom"}
  //           value={values['lum_bathroom'] ? values['lum_bathroom'].value + " " + values['lum_bathroom'].unit : "-"}
  //           critical={values['um_bathroom'] ? values['lum_bathroom'].critical : undefined}
  //         />
  //         <SensorItem icon="/assets/bedroom.png"
  //         name={values['lum_bedroom'] && values['lum_bedroom'].userAlias ? values['lum_bedroom'].userAlias : "lum_bedroom"}
  //         value={values['lum_bedroom'] ? values['lum_bedroom'].value + " " + values['lum_bedroom'].unit : "-"}
  //         critical={values['lum_bedroom'] ? values['lum_bedroom'].critical : undefined}
  //         />
  //         <SensorItem icon="/assets/kitchen.png" name="lum_kitchen" value={values['lum_kitchen'] ? values['lum_kitchen'].value + " " + values['lum_kitchen'].unit : "-"} critical={values['lum_kitchen'] ? values['lum_kitchen'].critical : undefined} />
  //         <SensorItem icon="/assets/entrance.png" name="lum_entrance" value={values['lum_entrance'] ? values['lum_entrance'].value + " " + values['lum_entrance'].unit : "-"} critical={values['lum_entrance'] ? values['lum_entrance'].critical : undefined} />
  //       </div>
  //       <br />
  //       <span>0XAAD/enable: {values['0XAAD/enable'] ? values['0XAAD/enable'].value : '-'}</span>
  //     </div>

  //     <br />
  //     <h3 style={{margin: '10px'}}>???))):</h3>
  //     <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
  //       <div style={{ display: "flex" }}>
  //         <SensorItem icon="/assets/entrance.png" name="entrance" value={values['entrance'] ? values['entrance'].value : "-"} critical={undefined} />
  //         <SensorItem icon="/assets/window.png" name="window" value={values['window'] ? values['window'].value : "-"} critical={undefined} />
  //         <SensorItem icon="/assets/backyard.png" name="backyard" value={values['backyard'] ? values['backyard'].value : "-"} critical={undefined} />
  //       </div>
  //       <br />
  //       <span>0XEDD/enable: {values['0XEDD/enable'] ? values['0XEDD/enable'].value : '-'}</span>
  //     </div>

  //     <br />
  //     <h3 style={{margin: '10px'}}>Temperature:</h3>
  //     <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
  //       <div style={{ display: "flex" }}>
  //         <SensorItem icon="/assets/boiler.png" name="temp_boiler" value={values['temp_boiler'] ? values['temp_boiler'].value + " " + values['temp_boiler'].unit : "-"} critical={values['temp_boiler'] ? values['temp_boiler'].critical : undefined} />
  //         <SensorItem icon="/assets/floor.png" name="temp_floor" value={values['temp_floor'] ? values['temp_floor'].value + " " + values['temp_floor'].unit : "-"} critical={values['temp_floor'] ? values['temp_floor'].critical : undefined} />
  //       </div>
  //       <br />
  //       <span>0XAAD/enable: {values['0XAAD/enable'] ? values['0XAAD/enable'].value : '-'}</span>
  //     </div>

  //     <br />
  //     <h3 style={{margin: '10px'}}>Sockets:</h3>
  //     <div style={{ margin: '5px', border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
  //       <div style={{ display: "flex" }}>
  //         <SensorItem icon="/assets/cellar.png" name="sockets_cellar" value={values['sockets_cellar'] ? values['sockets_cellar'].value + " " + values['sockets_cellar'].unit : "-"} critical={values['sockets_cellar'] ? values['sockets_cellar'].critical : undefined} />
  //         <SensorItem icon="/assets/kitchen.png" name="sockets_kitchen" value={values['sockets_kitchen'] ? values['sockets_kitchen'].value + " " + values['sockets_kitchen'].unit : "-"} critical={values['sockets_kitchen'] ? values['sockets_kitchen'].critical : undefined} />
  //         <SensorItem icon="/assets/sockets_common.png" name="sockets_common" value={values['sockets_common'] ? values['sockets_common'].value + " " + values['sockets_common'].unit : "-"} critical={values['sockets_common'] ? values['sockets_common'].critical : undefined} />
  //       </div>
  //       <br />
  //       <span>0XBNA/enable: {values['0XBNA/enable'] ? values['0XBNA/enable'].value : '-'}</span>
  //     </div> */}
  //   </div>
  // );
}

export default App;
