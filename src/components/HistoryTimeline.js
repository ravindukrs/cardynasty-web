import { useState, useContext, useEffect } from 'react';
import { Timeline, Radio, Collapse } from 'antd';
import { FirebaseContext } from '../config/Firebase';


const { Panel } = Collapse;

const HistoryTimeline = (props) => {
  const contextValue = useContext(FirebaseContext);

  const getServiceName = (serviceId) => {
    //console.log(props.serviceList[serviceId])
    return props.serviceList[serviceId]
  }

  const [shops, setShops] = useState(null)


  useEffect(() => {
    (async () => {
      try {

        await contextValue.db.collection('shops').onSnapshot((querySnapshot) => {
          let shopsList = []
          querySnapshot.forEach((doc) => {
            if (doc.data()) {
              let id = doc.id;
              shopsList.push({ id, ...doc.data() });
            }
          });
          setShops(shopsList)
          console.log(shopsList)
        })

      } catch (error) {
        console.log(error);
      }
    })()
  }, [])

 

  return (
    shops ? (
      <>
        <Timeline mode='left'>
          {
            props.data.map((service) => {
              // console.log(service)
              return (
                <Timeline.Item label={service.entryDate} key={service.id}>
                  <Collapse>
                    <Panel header={service.description}>
                      <>
                        {
                          service.services.map((repair) => {
                            return (
                              <p>{getServiceName(repair)}</p>
                            )
                          })
                        }
                        
                        <p style={{ color: 'green', fontSize: 12, fontStyle: "italic" }}>Serviced At: {shops.find(x => x.id === service.mechanic).shop_name}</p>
                      </>
                    </Panel>
                  </Collapse>
                </Timeline.Item>
              )
            })
          }
        </Timeline>
      </>
    ) : null
  );
}

export default HistoryTimeline