import { FirebaseContext } from '../config/Firebase';

import React, { PureComponent, useState, useContext, useEffect } from 'react';
import { Table, Tag, Space } from 'antd';


function AccidentTable(props) {

    const [data, setData] = useState(null)


    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Cause',
            dataIndex: 'cause',
            key: 'cause',
        },
        {
            title: 'Damage',
            dataIndex: 'damage',
            key: 'damage',
        },
        {
            title: 'Severity',
            key: 'severity',
            dataIndex: 'severity',
            render: tag => {
                let color = 'green'
                if (tag === 'High') {
                    color = 'volcano';
                }
                if (tag === 'Moderate') {
                    color = 'geekblue';
                }
                if (tag === 'Low') {
                    color = 'green';
                }
                return (
                    <Tag color={color} key={tag}>
                        {tag.toUpperCase()}
                    </Tag>
                );
            }

        }
    ]

    useEffect(() => {
        (async () => {
            try {
                fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/accidentapi/accidents?reg=${props.vehicleInfo.id}`)
                .then(response => response.json())
                .then(data => setData(data));

            } catch (error) {
                console.log(error);
            }
        })()
    }, [])


    return (
        <Table columns={columns} dataSource={data ? data : []}/>
        
    );
};
export default AccidentTable;