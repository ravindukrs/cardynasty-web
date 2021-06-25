import React, { useState, useContext, useEffect } from "react";
import "../App.css";
import "antd/dist/antd.css";
import { Layout, Menu, Row, Col, Select, Alert, Divider } from "antd";
import VehicleForm from '../components/VehicleForm'
import HistoryTimeline from '../components/HistoryTimeline'
import { FirebaseContext } from '../config/Firebase';
import Chart from "../components/ServiceChart";
import { doReturnOdometerData } from '../scripts/ServiceFilter'
import SelectService from "../components/SelectService";
import MarketMovement from "../components/MarketMovement";
import AccidentChart from "../components/AccientChart";
import VehicleDescription from "../components/VehicleDescription";
import AccidentTable from "../components/AccidentTable";
import StripeButton from "../components/StripeButton";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function RequestReport() {
    const contextValue = useContext(FirebaseContext);
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = () => {
        setCollapsed(!collapsed);
    };

    const [selectedService, setSelectedService] = useState(null)
    const [reportServices, setReportServices] = useState(null)
    const [services, setServices] = useState(null)
    const [serviceTypes, setServiceTypes] = useState(null)
    const [formValue, setFormValue] = useState(null)
    const [isFormValid, setIsFormValid] = useState(false)
    //Chart Data
    //Odometer Data
    const [odometerData, setOdometerData] = useState(null)
    const [vehicleInfo, setVehicleInfo] = useState(false)
    const [accidentCount, setAccidentCount] = useState(null)
    const [token, setToken] = useState(null)

    useEffect(() => {
        (async () => {
            try {
                if (services && serviceTypes) {
                    fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/app/vehicle?reg=${formValue.vehicleRegistration}`)
                        .then(response => response.json())
                        .then(data => setVehicleInfo(data[0]));

                    fetch(`https://us-central1-cardynasty-rs.cloudfunctions.net/accidentapi/accidentsbyyear?reg=${formValue.vehicleRegistration}`)
                        .then(response => response.json())
                        .then(data => setAccidentCount(data));
                }

            } catch (error) {
                console.log(error);
            }
        })()
    }, [services, serviceTypes])

    useEffect(() => {
        (async () => {
            try {
                if (services && serviceTypes) {
                    let odometerDataSet = doReturnOdometerData(services, serviceTypes)
                    setOdometerData(odometerDataSet)
                }


            } catch (error) {
                console.log(error);
            }
        })()
    }, [services, serviceTypes])


    useEffect(() => {
        (async () => {
            try {

                if (selectedService == "all") {
                    setReportServices(services)
                } else {
                    var newArray = services.filter(function (el) {
                        return el.services.includes(selectedService); // Changed this so a home would match
                    });
                    setReportServices(newArray)
                }

            } catch (error) {
                console.log(error);
            }
        })()
    }, [selectedService])

    useEffect(() => {
        if (!services || services.length == 0) {
            //"The Form is Invalid or Vehicle doesnt exist"
            toast("Input a valid vehicle reigstration number")
        }
    }, [services])

    useEffect(() => {
        if (isFormValid) {
            (async () => {
                try {
                    await contextValue.db.collection('vehicles').doc(formValue.vehicleRegistration).collection('services').where("approved", "==", "accepted").onSnapshot((querySnapshot) => {
                        let approvedServices = []
                        querySnapshot.forEach((doc) => {
                            if (doc.data()) {
                                let id = doc.id;
                                approvedServices.push({ id, ...doc.data() });
                            } else {
                                approvedServices = null
                            }
                        });
                        if (approvedServices.length == 0) {
                            alert("Sorry, this vehicle is invalid or have no service records.")
                            approvedServices = null
                            setToken(null)
                        } else {
                            alert(`${approvedServices.length} Service Records were found on the vehicle. Proceed with payment for report`)
                        }
                        setServices(approvedServices)
                        setReportServices(approvedServices)
                    })

                } catch (error) {
                    console.log(error);
                }
            })()
        } else {
            setServices(null)
            setReportServices(null)
            setOdometerData(null)
            setToken(null)
        }
    }, [formValue])



    useEffect(() => {
        (async () => {
            try {

                await contextValue.db.collection('constants').doc('service-types').onSnapshot((doc) => {
                    if (doc.data()) {
                        setServiceTypes(doc.data())
                    }
                })

            } catch (error) {
                console.log(error);
            }
        })()
    }, [])

    return (
        <div>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                        <Menu.Item key="1" icon={<PieChartOutlined />}>
                            Report
                        </Menu.Item>
                        {/* <Menu.Item key="2" icon={<DesktopOutlined />}>
                            Ravindu
            </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9" icon={<FileOutlined />}>
                            Files
            </Menu.Item> */}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: "0 16px" }}>
                        <div
                            className="site-layout-background"
                            style={{ padding: 24, minHeight: 360 }}
                        >

                            <Row gutter={16} justify="space-around" align="top">
                                <Col className="gutter-row" span={12}>
                                    <ToastContainer />
                                    <VehicleForm setFormValue={setFormValue} setIsFormValid={setIsFormValid} setToken={setToken} />

                                    {services && serviceTypes && reportServices && token ?
                                        (
                                            <>
                                                {vehicleInfo && vehicleInfo != [] ? (
                                                    <>
                                                        <VehicleDescription vehicleInfo={vehicleInfo} />
                                                        <MarketMovement />
                                                    </>
                                                ) : null}


                                                {odometerData && services ?
                                                    <>
                                                        <Chart odometerData={odometerData} />
                                                        {accidentCount ? (
                                                            <AccidentChart vehicleInfo={vehicleInfo} accidentCount={accidentCount} />
                                                        ) : null}
                                                    </>
                                                    : null
                                                }
                                            </>
                                        )

                                        : null
                                    }
                                </Col>
                                <Col className="gutter-row" span={12} justify="center">
                                  
                                    {services && !token ? (
                                        <>
                                           
                                            <StripeButton price={services.length * 1.5} setToken={setToken} />
                                            <Divider />
                                            {services.length} Service Records were found for this vehicle. Please proceed for payment to view report.
                                            <i>Note: Reports are based on service record count.</i><br/><br/>
                                        </>
                                    ) : null}
                                        {services && serviceTypes && reportServices && token?
                                            <>
                                            
                                                <span style={{ marginLeft: 100 }}>
                                                    <SelectService serviceList={serviceTypes} setSelectedService={setSelectedService} />
                                                    
                                                </span>
                                                <Divider/>
                                                <HistoryTimeline data={reportServices} serviceList={serviceTypes} />
                                                {vehicleInfo && vehicleInfo != [] ? (
                                                    <>
                                                        <AccidentTable vehicleInfo={vehicleInfo} />
                                                    </>
                                                ) : null}
                                            </>
                                            : null}
                                   
                                </Col>

                            </Row>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        CarDynasty ©2021
                    </Footer>
                </Layout>
            </Layout>
        </div>
    );
}

export default RequestReport;
