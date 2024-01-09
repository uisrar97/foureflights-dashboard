import React, { Component } from "react";
import Chart from "react-apexcharts";

class TotalSaleChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: { labels: ["Travelport", "PIA", "Airblue", "Airsial"] },
      series: props.donutSerials,
      labels: ["Travelport", "PIA", "Airblue", "Airsial"],
    };
  }

  render() {
    return (
      <div className="donut bg-white border border-rounded mr-8">
        <Chart
          options={this.state.options}
          series={this.state.series}
          // labels={this.state.labels}
          type="donut"
          width="350"
          height="250"
        />
      </div>
    );
  }
}

export default TotalSaleChart;
