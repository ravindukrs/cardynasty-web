import { FirebaseContext } from '../config/Firebase';

import React, { PureComponent, useState, useContext, useEffect } from 'react';
import { Descriptions } from 'antd';



function VehicleDescription(props) {


  return (
    <Descriptions title="Vehicle Info">
      <Descriptions.Item label="Ownership">Morgaged</Descriptions.Item>
      <Descriptions.Item label="Make">{props.vehicleInfo.make}</Descriptions.Item>
      <Descriptions.Item label="Model">{props.vehicleInfo.model}</Descriptions.Item>
      <Descriptions.Item label="Manufacture Year">{props.vehicleInfo.year}</Descriptions.Item>
      <Descriptions.Item label="Colour Code">{props.vehicleInfo.color}</Descriptions.Item>
      <Descriptions.Item label="Chassis Code">{props.vehicleInfo.chassis}</Descriptions.Item>
    </Descriptions>
  );
};
export default VehicleDescription;