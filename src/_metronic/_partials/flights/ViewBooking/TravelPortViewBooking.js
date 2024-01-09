import React from 'react';
import { time_convert, diff_minutes, date_convert, utc_convert, TimeZone } from '../../../_helpers/HelperFunctions';

export default function TravelPortViewBooking({ booking })
{
    const passengers = booking.booking_detail;
    const tickets = booking.booking_response.ticket_numbers;

    const flightSegments = booking.booking_response.segments;

    const lastIndex = flightSegments.length - 1;
    let firstCity = flightSegments[0].origin_city_name.split(',');
    firstCity = firstCity[0].split(' ');
    let lastCity = flightSegments[lastIndex].destination_city_name.split(',');
    lastCity = lastCity[0].split(' ');
    let count = 0;

    firstCity.map((origin) => {
        lastCity.map((destination) => {
            if (destination === origin) {
                count += 1;
            }
            return 0;
        })
        return 0;
    });
    const round = (count > 0 && flightSegments.length > 1) ? true : false;

    let post = 0;
    let current = 0;
    let counter = 0;
    let roundLast = (round) ?
        flightSegments.map((segment, index) => 
        {
            current = index;
            counter = 0;
            post = (flightSegments.length > current + 1) ? current + 1 : current;
            let destCity = segment.destination_city_name.split(' ');
            let originCity = flightSegments[post].origin_city_name.split(' ');
            destCity.map((destination) => 
            {
                originCity.map((origin) => 
                {
                    if (destination === origin) {
                        counter++;
                    }
                    return 0;
                })
                return 0;
            });
            if (counter > 0 && flightSegments.length > 2) {
                return flightSegments[post];
            }
            else if (counter > 0 && flightSegments.length <= 2) 
            {
                return segment;
            }
            else
            {
                return '';
            }
        })
        :
        '';
    if (roundLast !== '' && round)
    {
        roundLast = roundLast.filter(Boolean);
    }

    const firstSegment = flightSegments[0];
    const lastSegment = (round) ? roundLast[0] : flightSegments[lastIndex];
    const totalStops = flightSegments.length - 1;
    let totalFlightTime = 0;
    if (round) 
    {
        let x = 0;

        flightSegments.map((segment) => 
        {
            if (x === 0) 
            {
                totalFlightTime += Number(segment.TravelTime);
            }

            if (lastSegment.destination_city_name === segment.destination_city_name || lastSegment.origin_city_name !== segment.origin_city_name) 
            {
                x++;
            }
            return 0;
        });
    }
    else {
        totalFlightTime = flightSegments.reduce(
            (accumulator, segment) => accumulator + Number(segment.TravelTime),
            0,
        );
    }
    return (
        <div>
            <div className="statuses text-center">
                <h2 className="text-center">Booking Statuses</h2>
                <hr className="text-center" />
                <div className="d-flex flex-row">
                    <div className="col-6">
                        <p className="text-capitalize">
                            <span className="font-weight-bold">Booking Status: </span>
                            <span className={
                                (booking.booking_status === 'Completed') ?
                                    'badge badge-success'
                                :
                                    (booking.booking_status === 'Incompleted') ?
                                        'badge badge-warning'
                                    :
                                        'badge badge-danger'
                            }>
                                {booking.booking_status}
                            </span>
                        </p>
                    </div>
                    <div className="col-6">
                        <p className="text-capitalize">
                            <span className="font-weight-bold">Payment Status: </span>
                            <span className={
                                (booking.payment_status === 'Completed') ?
                                    'badge badge-success'
                                :
                                    'badge badge-warning'
                            }>
                                {booking.payment_status}
                            </span>
                        </p>
                    </div>
                </div>
                <hr className="text-center" />
            </div>
            <div className="passenger-info text-center rounded">
                <h2 className="text-center">Passenger Information</h2>
                <div className="d-flex flex-row">
                    <div className="col-4 text-left">
                        <p className="">
                            <span className="font-weight-bold">Email: </span>{booking.email}
                        </p>
                    </div>
                    <div className="col-4 text-left">
                        <p className="text-capitalize">
                            <span className="font-weight-bold">Phone Number: </span>{booking.phone_number}
                        </p>
                    </div>
                    <div className="col-4 text-left">
                        <p className="text-capitalize">
                            <span className="font-weight-bold">Foure Reference (PNR): </span>{booking.pnr}
                        </p>
                    </div>
                </div>
                <div className="pax-info d-flex flex-column">
                    {
                        passengers.map((pax, index) => {
                            return <div className="d-flex flex-column border border-dark mt-4" key={pax.id}>
                                <div className="d-flex flex-row">
                                    <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passenger Name: </span>
                                            {pax.title + '. ' + pax.f_name + ' ' + pax.l_name}
                                        </p>
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Nationality: </span>{pax.nationality}
                                        </p>
                                        {
                                            (booking.booking_response.ticket_numbers && tickets.length === passengers.length) &&
                                                <p className="text-capitalize">
                                                    <span className="font-weight-bold">E-Ticket Number: </span>{tickets[index].ticket_number}
                                                </p>
                                        }
                                        
                                    </div>
                                    <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Date of Birth: </span>{date_convert(pax.dob)}
                                        </p>
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passport Number: </span>{pax.passport_number}
                                        </p>
                                    </div>
                                    <div className="col-4 d-flex flex-column text-left">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passenger Type: </span>{pax.passenger_type}
                                        </p>
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passport Expiry: </span>{date_convert(pax.passport_expiry_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="pax-info d-flex flex-column mt-4">
                <h2 className="text-center">Flight Details</h2>
                <div className="d-flex flex-column m-3">
                    <div className="d-flex flex-row">
                        <div className="col-3 text-wrap">
                            <div className="text-capitalize text-left font-weight-bold">
                                <div className="row">{firstSegment.origin_city_name}</div>
                                <div className="row">To</div>
                                <div className="row">{lastSegment.destination_city_name}</div>
                            </div>
                        </div>
                        <div className="col-2" />
                        <div className="col-2">
                            <div className="text-capitalize text-left">
                                <div className="row font-weight-bold h4">Departure</div>
                                <div className="row">
                                    <p className="font-weight-bold h5" title={TimeZone(firstSegment.DepartureTime)}>{utc_convert(firstSegment.DepartureTime)}</p>
                                </div>
                                <div className="row">{date_convert(firstSegment.DepartureTime.slice(0, 10))}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-capitalize">
                                <div className="">
                                    <span className="font-weight-bold">Stops: &nbsp;</span>
                                    <span>
                                        {
                                            (totalStops === 0) ?
                                                'Direct Flight'
                                            :
                                                (totalStops === 1) ?
                                                    '1 Stop'
                                                :
                                                    totalStops + ' Stops'
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="text-capitalize">
                                <div className="">
                                    <span className="font-weight-bold">Flight Time: &nbsp;</span>
                                    <span>{time_convert(totalFlightTime)}</span>
                                </div>
                            </div>
                            {
                                (round) && <div className="text-capitalize">
                                    <div className="font-weight-bold">Round Trip</div>
                                </div>
                            }
                        </div>
                        <div className="col-2">
                            <div className="text-capitalize text-left">
                                <div className="row font-weight-bold h4">Arrival</div>
                                <div className="row">
                                    <p className="font-weight-bold h5" title={TimeZone(lastSegment.ArrivalTime)}>{utc_convert(lastSegment.ArrivalTime)}</p>
                                </div>
                                <div className="row">{date_convert(lastSegment.ArrivalTime.slice(0, 10))}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column">
                    {
                        flightSegments.map((segment, index) => {
                            let originCity = segment.origin_city_name.split(',');
                            let destinationCity = segment.destination_city_name.split(',');
                            return (
                                <div className="flight-info border border-primary mb-3 p-5" key={index}>
                                    <div className="flight-inner-row">
                                        <p>
                                            <span>{date_convert(segment.DepartureTime.slice(0, 10))} </span>
                                            <span>- {originCity[0]} <span style={{ color: '#FF9800' }}>To</span> {destinationCity[0]}</span>
                                        </p>
                                    </div>
                                    <div className="flight-inner-row row align-items-center mt-2">
                                        <div className="airline d-flex flex-row col-4">
                                            <img src={segment.airline_logo} alt='Carrier Logo' />
                                            <div className="p-2 align-self-center">{segment.airline_name + ' (' + segment.Carrier + ') ' + segment.FlightNumber}</div>
                                        </div>
                                        <div className="plane col-2 text-center">
                                            <i className="fas fa-plane"/>
                                        </div>
                                        <div className="depart col-3">
                                            <h4>Departure</h4>
                                            <div>
                                                <h5 title={TimeZone(segment.DepartureTime)}>{utc_convert(segment.DepartureTime)}</h5>
                                            </div>
                                            <h5>{date_convert(segment.DepartureTime)}</h5>
                                        </div>
                                        <div className="arrival col-3">
                                            <h4>Arrival</h4>
                                            <div>
                                                <h5 title={TimeZone(segment.ArrivalTime)}>{utc_convert(segment.ArrivalTime)}</h5>
                                            </div>
                                            <h5>{date_convert(segment.ArrivalTime)}</h5>
                                        </div>
                                    </div>
                                    <div className="flight-inner-row flights mt-3">
                                        <h4 className="service">Class of Service: <span className="font-weight-normal">{segment.CabinClass}</span></h4>
                                        {
                                            (flightSegments.length > 1 && flightSegments.length - 1 !== index && segment.origin_city_name !== lastSegment.origin_city_name && segment.destination_city_name !== lastSegment.destination_city_name) &&
                                                <h4 className="service">Layover: &nbsp;
                                                    <span className="font-weight-normal">
                                                        {
                                                            diff_minutes(segment.ArrivalTime, flightSegments[(index + 1 === flightSegments.length) ? flightSegments.length - 1 : index + 1].DepartureTime)
                                                        }
                                                    </span>
                                                </h4>
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )
}
