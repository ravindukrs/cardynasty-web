import { useState, useContext, useEffect } from 'react';
import { Timeline, Radio, Collapse } from 'antd';
import { FirebaseContext } from '../config/Firebase';
import moment from 'moment';

const { Panel } = Collapse;

export const doReturnOdometerData = (services, serviceList, setList) => {
    console.log("Inside Do return")
    let objArray = []
    if (services && serviceList){
        services.forEach(element => {
            objArray.push(
                {
                    date: moment(element.serviceDate).format('MM/DD/YYYY'),
                    odometer: element.odometer,
                    timestamp: moment(element.serviceDate).unix()
                }
            )
        });
    }
    console.log("Prior ", objArray)
    return objArray
   
}



