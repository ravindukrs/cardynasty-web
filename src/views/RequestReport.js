import React, { useState, useContext, useEffect } from "react";
import "../App.css";
import "antd/dist/antd.css";
import { Layout, Menu, Row, Col, Select, Alert, Divider, Typography } from "antd";
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
import MileageCard from "../components/MileageCard";

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography

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
    const [predictedMileage, setPredictedMileage] = useState(null)


    useEffect(() => {
        (async () => {
            try {
                if(token){
                    console.log("Triggred Firebase Call")
                    let response=await contextValue.db.collection('report-sales').doc(token.id).set({"token":token.id, "customerNic":formValue.nic, "token_email":token.email, "vehicleReg":vehicleInfo.id, "paymentUSD":services.length * 1.5, "transactionTime": moment().format("YYYY-MM-DD HH:mm:ss")})
                    console.log("response: ", response)
                }
            } catch (error) {
                console.log(error);
            }
        })()
    }, [token])

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
                let acceptedBodies = ["Hatchback","Sedan","SUV","Crossover","MPV","Van","Double Cabin","Mini Van","Station Wagon","Micro Van","Single Cabin","High Roof","Convertible","Coupe","Pick Up","Mini Vehicles","Truck"]
                if (vehicleInfo && acceptedBodies.includes(vehicleInfo.body)) {
                    fetch('https://carynasty-mileage-regressor.azurewebsites.net/predict', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            body: vehicleInfo.body,
                            year: vehicleInfo.year,
                        })
                    })
                    .then(response => response.json())
                    .then(data => setPredictedMileage(data.mileage))
                }


            } catch (error) {
                console.log(error);
            }
        })()
    }, [vehicleInfo])

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
                                                        {/* <MarketMovement /> */}
                                                    </>
                                                ) : null}


                                                {odometerData && services ?
                                                    <>
                                                        <Title level={5}>Mileage Data</Title>
                                                        {predictedMileage? <MileageCard predictedMileage={predictedMileage} odometerData={odometerData}/> : null}
                                                        <Divider />
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
                                            <i>Note: Reports are based on service record count.</i><br /><br />
                                        </>
                                    ) : null}
                                    {services && serviceTypes && reportServices && token ?
                                        <>

                                            <span style={{ marginLeft: 100 }}>
                                                <SelectService serviceList={serviceTypes} setSelectedService={setSelectedService} />

                                            </span>
                                            <Divider />
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
                        CarDynasty ??2021 V4
                    </Footer>
                </Layout>
            </Layout>
        </div>
    );
}

export default RequestReport;
