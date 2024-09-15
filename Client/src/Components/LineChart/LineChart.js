import React from 'react';
import { Line } from 'react-chartjs-2';
import { Button } from 'antd';

const LineChart = ({ timeLine, legend, dataSet, height, width, downloadAsImage }) => {

    let chartReference = React.createRef();
    const chart = <Line
        data={
            {
                labels: timeLine,
                datasets: [
                    {
                        label: legend,
                        data: dataSet,
                        borderWidth: 2,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        lineTension: 0,
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ]
            }
        }
        height={height}
        width={width}
        ref={chartReference}
        options={
            {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },

            }
        }
    />
    const download = () => {
        const imageLink = chartReference.current.chartInstance.toBase64Image();
        downloadAsImage(imageLink);
    }

    const final = (
        <>
            { chart}
        </>
    );

    return (
        final
    );
}

export default LineChart;