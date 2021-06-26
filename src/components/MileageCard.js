import { FirebaseContext } from '../config/Firebase';

import React, { PureComponent, useState, useContext, useEffect } from 'react';
import { Statistic, Row, Col } from 'antd';
import { LikeOutlined, DislikeOutlined} from '@ant-design/icons';



function MileageCard(props) {
  const odometerValue = props.odometerData[props.odometerData.length - 1].odometer
  const predictedValue = props.predictedMileage
  {console.log("Odometer Data: ", props.odometerData)}
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Milage" value={odometerValue} prefix={predictedValue < odometerValue ? <LikeOutlined /> : <DislikeOutlined/>} suffix="KM" valueStyle={{color:"green"}}/>
      </Col>
      <Col span={8}>
        <Statistic title="Other Vehicles" value={predictedValue} suffix="KM" valueStyle={{color:"blue"}}/>
      </Col>
      <Col span={8}>
        <Statistic title="Discrepency" value={predictedValue - odometerValue} suffix="KM" valueStyle={{color:"orange"}}/>
      </Col>
    </Row>
  );
};
export default MileageCard;