import { useState, useContext, useEffect } from 'react';
import { Statistic, Card, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';


const MarketMovement = (props) => {

    const [marketData, setMarketData] = useState(null)

    useEffect(() => {
        (async () => {
            try {

                fetch(`https://marketvalue.vinaudit.com/getmarketvalue.php?vin=1NXBR32E85Z505904&key=VA_DEMO_KEY&state=WA`)
                    .then(response => response.json())
                    .then(data => setMarketData(data));


            } catch (error) {
                console.log(error);
            }
        })()
    }, [])

    return (

        <div style={{ padding: 30, background: "#ffffff" }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="1 Year Average Value Movement "
                            value={marketData ? (marketData.prices.average - marketData.prices.below) / marketData.prices.average : (Math.random() * 15) + 1}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="1 Month Average Value Movement"
                            value={marketData ? (marketData.prices.above - marketData.prices.below) / marketData.prices.average : (Math.random() * 15) + 1}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default MarketMovement