import React from "react";
import { useState } from "react";
import "rsuite/dist/rsuite.min.css";
import ApppexChart from "../../../../app/pages/Flights/apexChart";
import TotalSaleChart from "../../../../app/pages/Flights/TotalSaleChart";
import { DateRangePicker } from "rsuite";
import { date_convert } from "../../../_helpers/HelperFunctions";

export function Sales({ bookings }) {
  const [sFilterDate, setSFilterDate] = useState({});

  let rows = [];
  let airLinesNames = [];
  let count = 1;
  let travelportPrice = 0;
  let hititPrice = 0;
  let airbluePrice = 0;
  let airsialPrice = 0;
  let travelportPer = 0;
  let hititPer = 0;
  let airbluePer = 0;
  let airsialPer = 0;
  let cancelFlightsPrice = 0;
  let donutPer = [];
  let airlineWithPrice = [];
  let janPrice = 0;
  let febPrice = 0;
  let marPrice = 0;
  let aprPrice = 0;
  let mayPrice = 0;
  let junPrice = 0;
  let julPrice = 0;
  let augPrice = 0;
  let sepPrice = 0;
  let octPrice = 0;
  let novPrice = 0;
  let decPrice = 0;
  if (bookings.status !== "400") {
    rows = bookings.data.map((flight) => {
      let id = count;
      let name =
        flight.booking_detail[0].title +
        ". " +
        flight.booking_detail[0].f_name +
        " " +
        flight.booking_detail[0].l_name;
      let depart_date = "";
      let depart_status = "Pending";
      let last_date = "-";
      let booking_status = flight.booking_status;

      if (flight.api_type === "travelport" || flight.api_type === "hitit") {
        depart_date = flight.booking_response.segments[0].DepartureTime;
        if (
          flight.api_type === "travelport" &&
          booking_status === "Incompleted" &&
          flight.booking_response.pricing.length > 0
        ) {
          last_date = date_convert(
            flight.booking_response.pricing[0].TrueLastDateToTicket
          );
        } else if (
          flight.api_type === "hitit" &&
          booking_status === "Incompleted"
        ) {
          last_date = date_convert(flight.booking_response.ticket_time_limt);
        }
      } else if (flight.api_type === "airblue") {
        depart_date = flight.booking_response.segments[0].DepartureDateTime;
        if (booking_status === "Incompleted") {
          last_date = date_convert(
            flight.booking_response.ticketing[0].TicketTimeLimit
          );
        }
      } else if (flight.api_type === "airsial") {
        depart_date = new Date(
          flight.booking_response.segments.outbound[0].DEPARTURE_DATE
        );
        if (booking_status === "Incompleted") {
          let validDate = flight.booking_response.validTill.split(" ");
          validDate = validDate[0].split("-");
          validDate = validDate[2] + "-" + validDate[1] + "-" + validDate[0];
          last_date = date_convert(validDate);
        }
      }
      if (new Date() >= new Date(depart_date)) {
        depart_status = "Departed";
      }
      depart_date = date_convert(depart_date);
      let pnr = flight.pnr;
      let created_at = flight.created_at;
      let action = flight;
      let payment = flight.payment_status;

      count++;
      return {
        id,
        name,
        depart_date,
        depart_status,
        pnr,
        booking_status,
        last_date,
        created_at,
        action,
        payment,
      };
    });
  }
  rows.map((row) => {
    if (row.booking_status.toLowerCase() !== "cancelled") {
      if (row.booking_status.toLowerCase() === "completed") {
        let date = new Date(row.created_at);
        let currentYear = new Date().getFullYear();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        if (year === currentYear) {
          if (month === 1) {
            janPrice = janPrice + row.action.total_amount_with_commission;
          }
          if (month === 2) {
            febPrice = febPrice + row.action.total_amount_with_commission;
          }
          if (month === 3) {
            marPrice = marPrice + row.action.total_amount_with_commission;
          }
          if (month === 4) {
            aprPrice = aprPrice + row.action.total_amount_with_commission;
          }
          if (month === 5) {
            mayPrice = mayPrice + row.action.total_amount_with_commission;
          }
          if (month === 6) {
            junPrice = junPrice + row.action.total_amount_with_commission;
          }
          if (month === 7) {
            julPrice = julPrice + row.action.total_amount_with_commission;
          }
          if (month === 8) {
            augPrice = augPrice + row.action.total_amount_with_commission;
          }
          if (month === 9) {
            sepPrice = sepPrice + row.action.total_amount_with_commission;
          }
          if (month === 10) {
            octPrice = octPrice + row.action.total_amount_with_commission;
          }
          if (month === 11) {
            novPrice = novPrice + row.action.total_amount_with_commission;
          }
          if (month === 12) {
            decPrice = decPrice + row.action.total_amount_with_commission;
          }
        }
        if (row.action.api_type === "travelport") {
          if (
            !airLinesNames.includes(
              row.action.booking_response.segments[0].airline_name
            )
          ) {
            airLinesNames.push(
              row.action.booking_response.segments[0].airline_name
            );
            let price = row.action.total_amount_with_commission;
            let airlineWithPricearr = {
              airline_name:
                row.action.booking_response.segments[0].airline_name,
              airline_price: [price],
            };
            airlineWithPrice.push(airlineWithPricearr);
          } else {
            let indexnum = airLinesNames.indexOf(
              row.action.booking_response.segments[0].airline_name
            );
            let price = row.action.total_amount_with_commission;
            airlineWithPrice[indexnum].airline_price.push(price);
          }

          travelportPrice =
            travelportPrice + row.action.total_amount_with_commission;
        }
        if (row.action.api_type === "hitit") {
          hititPrice = hititPrice + row.action.total_amount_with_commission;
        }
        if (row.action.api_type === "airblue") {
          airbluePrice = airbluePrice + row.action.total_amount_with_commission;
        }
        if (row.action.api_type === "airsial") {
          airsialPrice = airsialPrice + row.action.total_amount_with_commission;
        }
      }
    } else {
      cancelFlightsPrice =
        cancelFlightsPrice + row.action.total_amount_with_commission;
    }
  });
  let monthPrice = [
    janPrice,
    febPrice,
    marPrice,
    aprPrice,
    mayPrice,
    junPrice,
    julPrice,
    augPrice,
    sepPrice,
    octPrice,
    novPrice,
    decPrice,
  ];
  let totalPrice = travelportPrice + airbluePrice + airsialPrice + hititPrice;
  if (totalPrice) {
    travelportPer = (travelportPrice / totalPrice) * 100;

    hititPer = (hititPrice / totalPrice) * 100;

    airbluePer = (airbluePrice / totalPrice) * 100;
    airsialPer = (airsialPrice / totalPrice) * 100;
    donutPer.push(travelportPer);
    donutPer.push(hititPer);
    donutPer.push(airbluePer);
    donutPer.push(airsialPer);
  }
  const enddatefilter = () => {
    let dateValue = sFilterDate;
    if (dateValue !== undefined && dateValue !== null && dateValue.length > 0) {
      hititPrice = 0;
      airbluePrice = 0;
      airsialPrice = 0;
      travelportPrice = 0;
      totalPrice = 0;
      cancelFlightsPrice = 0;
      airlineWithPrice = [];
      airLinesNames = [];

      const startDate = new Date(dateValue[0]).getTime();
      const endDate = new Date(dateValue[1]).getTime();

      rows = rows
        .filter((row) => {
          let rowDate = new Date(row.created_at).getTime();

          if (rowDate >= startDate && rowDate <= endDate) {
            if (row.action.api_type === "travelport") {
              if (
                !airLinesNames.includes(
                  row.action.booking_response.segments[0].airline_name
                )
              ) {
                airLinesNames.push(
                  row.action.booking_response.segments[0].airline_name
                );
                let price = row.action.total_amount_with_commission;
                let airlineWithPricearr = {
                  airline_name:
                    row.action.booking_response.segments[0].airline_name,
                  airline_price: [price],
                };
                airlineWithPrice.push(airlineWithPricearr);
              } else {
                let indexnum = airLinesNames.indexOf(
                  row.action.booking_response.segments[0].airline_name
                );
                let price = row.action.total_amount_with_commission;
                if (airlineWithPrice[indexnum] !== undefined) {
                  if (airlineWithPrice[indexnum].airline_price !== undefined) {
                    airlineWithPrice[indexnum].airline_price.push(price);
                  } else {
                    airlineWithPrice[indexnum].airline_price = [price];
                  }
                }
              }

              travelportPrice =
                travelportPrice + row.action.total_amount_with_commission;
            }
            if (row.action.api_type === "hitit") {
              hititPrice = hititPrice + row.action.total_amount_with_commission;
            }
            if (row.action.api_type === "airblue") {
              airbluePrice =
                airbluePrice + row.action.total_amount_with_commission;
            }
            if (row.action.api_type === "airsial") {
              airsialPrice =
                airsialPrice + row.action.total_amount_with_commission;
            }
            totalPrice =
              travelportPrice + airbluePrice + airsialPrice + hititPrice;
          }
        })
        .map((filteredData) => {
          return filteredData;
        });
    }
  };
  return (
    <>
      <div className="col-md-3 pl-0 mb-4 ml-0  ">
        <label className=""> Booking Date</label>
        <span className="">
          <DateRangePicker
            appearance="default"
            placeholder="Search by Dates"
            style={{ width: "100%", paddingTop: "3px" }}
            onChange={(dateValue) => {
              setSFilterDate(dateValue);
            }}
          />
        </span>
      </div>
      {sFilterDate !== "" && enddatefilter()}

      <div className="row ">
        <div className="col-md-6 row   ">
          <div className="col-md-6 p-0">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-1">Total Travelport Price:</h5>
                <p className="travelportPrice"> PKR {travelportPrice}</p>
                {airlineWithPrice.map((airline) => {
                  let newAirlineName = airline.airline_name;
                  if (airline.airline_name === null) {
                    newAirlineName = "other Air Lines";
                  }

                  let price = 0;
                  airline.airline_price.map((priceofairline) => {
                    price = price + priceofairline;
                  });
                  return (
                    <>
                      <h4 className="">{newAirlineName}</h4>
                      <p> PKR {price}</p>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-md-6 p-0">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-1">Total Price:</h5>
                <p>PKR {hititPrice}</p>

                <p className="card-text">Total pirce for PIA </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-0">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-1">Total Price:</h5>
                <p>PKR {airbluePrice}</p>

                <p className="card-text">Total pirce for Airblue</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 p-0 ">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-1">Total Price:</h5>
                <p>PKR {airsialPrice}</p>

                <p className="card-text">Total pirce for AirSial</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 ">
          <ApppexChart monthPrice={monthPrice} />
        </div>
      </div>
      <div className=" row mt-8 ">
        <div className="col-md-6 px-0 mx-0   ">
          <TotalSaleChart donutSerials={donutPer} />
        </div>

        <div className="col-md-6 row   ">
          <div className="col p-0   ">
            <div className="card h-100 p-0">
              <div className="card-body">
                <h5 className="card-title mb-1">Total Price:</h5>
                <p> PKR {totalPrice}</p>

                <p className="card-text">Over All AirLines Price</p>
              </div>
            </div>
          </div>
          <div className="col p-0 ">
            {" "}
            <div className="card h-100 p-0">
              <div className="card-body">
                <h5 className="card-title mb-1">Cancelled Flights Price:</h5>
                <p> PKR {cancelFlightsPrice}</p>

                <p className="card-text">Total pirce for travelPort</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {sFilterDate !== "" && enddatefilter()} */}
    </>
  );
}
