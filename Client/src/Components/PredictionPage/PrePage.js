import React, { useState, useEffect } from 'react';
import LineChart from '../LineChart/LineChart';
import Handlestring from './handlestring';
import { Button } from "antd";
import { Link, useLocation, Redirect } from "react-router-dom";
import axios from 'axios';
import Loader from '../Loader/loader';
import { PREDICTION_ENDPOINT, PRICE_HISTORY_ENDPOINT } from '../../API';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const typeodData1 = "Price Prediction";
const typeodData2 = "Price History";


const PrePage = (props) => {

    const [loading, setLoading] = useState(true);
    const [timeline, setTimeline] = useState(null);
    const [dataset, setDataset] = useState(null);
    const [isPredictionTab, setIsPredictionTab] = useState(true);
    const [minimumPriceIndex, setMinimumPriceIndex] = useState(0);

    const stateObject = useLocation();
    useEffect(() => {
        console.log(isPredictionTab ? PREDICTION_ENDPOINT : PRICE_HISTORY_ENDPOINT);
        if (stateObject.customProps) {
            axios.get(`${isPredictionTab ? PREDICTION_ENDPOINT : PRICE_HISTORY_ENDPOINT}?pid=${stateObject.customProps.pid}`)
                .then((response) => {
                    const fetchedTimeLine = response.data.map((datapoint) => {
                        return datapoint.date;
                    });
                    const fetchedDataset = response.data.map((datapoint) => {
                        return datapoint.price;
                    });
                    const minIndex = 0;
                    const minPrice = fetchedDataset[0];
                    for (let i = 1; i < fetchedDataset.length; i++) {
                        if (minPrice > fetchedDataset[i]) {
                            minIndex = i;
                            minPrice = fetchedDataset[i];
                        }
                    }
                    setMinimumPriceIndex(minIndex);
                    setTimeline(fetchedTimeLine);
                    setDataset(fetchedDataset);
                    setLoading(false);
                })
                .catch((err) => {
                    setLoading(false);
                });
        }

    }, [isPredictionTab]);

    const TabChangeHandler = () => {
        setIsPredictionTab(!isPredictionTab);
    }

    return (
        stateObject.customProps !== undefined ?
            (!loading ? (
                <div className="predict-base">
                    <div className="main-predict">
                        <Tabs defaultActiveKey="1" centered onChange={TabChangeHandler}>
                            <TabPane tab="PREDICT PRICE" key="1">
                                <div className="upper-main-predict">
                                    <Handlestring min={minimumPriceIndex} />
                                </div>
                                <div className="chart-box">
                                    <div style={{ width: "70%" }}>
                                        <LineChart
                                            dataSet={dataset}
                                            legend={typeodData1}
                                            timeLine={timeline}
                                            width={400}
                                            height={400}
                                        />
                                    </div>
                                </div>
                                <div className="lower-main-predict">
                                    <Button type="primary" className="wishlist-button" style={{ width: "250px" }}>
                                        <Link to="/">
                                            Back to Wishlist
                                </Link>
                                    </Button>
                                    <Button type="primary" className="wishlist-button" style={{ width: "250px" }}>
                                        <a href={stateObject.customProps.url} target="_blank">
                                            Product Link
                                </a>
                                    </Button>
                                </div>
                            </TabPane>
                            <TabPane tab="PRICE HISTORY" key="2">
                                <div className="chart-box">
                                    <div style={{ width: "70%" }}>
                                        <LineChart
                                            dataSet={dataset}
                                            legend={typeodData2}
                                            timeLine={timeline}
                                            width={400}
                                            height={400}
                                        />
                                    </div>
                                </div>
                                <div className="lower-main-predict">
                                    <Button type="primary" className="wishlist-button" style={{ width: "250px" }}>
                                        <Link to="/">
                                            Back to Wishlist
                                </Link>
                                    </Button>
                                    <Button type="primary" className="wishlist-button" style={{ width: "250px" }}>
                                        <a href={stateObject.customProps.url} target="_blank">
                                            Product Link
                                </a>
                                    </Button>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>) : (<Loader />)) : <Redirect to="/" />
    );
}

export default PrePage;