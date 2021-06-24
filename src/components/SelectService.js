import { useState, useContext, useEffect } from 'react';
import { Timeline, Radio, Collapse, Select } from 'antd';
import { FirebaseContext } from '../config/Firebase';

const { Option } = Select;


const SelectService = (props) => {
  const contextValue = useContext(FirebaseContext);

  const getServiceName = (serviceId) => {
    //console.log(props.serviceList[serviceId])
    return props.serviceList[serviceId]
  }

  const [list, setList] = useState(null)

  useEffect(() => {
    (async () => {
        try {

            var tempList = []
            for (var key of Object.keys(props.serviceList)) {
                tempList.push({index: key, value: props.serviceList[key]})
            }
            setList(tempList)
            console.log(tempList)

        } catch (error) {
            console.log(error);
        }
    })()
}, [])
  

  function onChange(value) {
    console.log(`selected ${value}`);
    props.setSelectedService(value)
  }

  return (
   
      <>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a Service Type"
          optionFilterProp="children"
          onChange={onChange}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
            <Option value="all">All Services</Option>
        {list? (
            list.map((service)=> {
                return(
                    <Option value={service.index}>{service.value}</Option>
                )
            })
        ): null}
         
          
        </Select>
        {/* <Timeline mode='left'>
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
                        {shops.find(x => x.id === service.mechanic).shop_name}
                      </>
                    </Panel>
                  </Collapse>
                </Timeline.Item>
              )
            })
          }
        </Timeline> */}
      </>
  );
}

export default SelectService