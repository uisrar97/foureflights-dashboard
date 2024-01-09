import React from 'react';
import { time_convert, date_convert } from '../../../_helpers/HelperFunctions';

export default function AirSialViewBooking({ booking }) {
    const round = (booking.booking_response.segments.inbound && booking.booking_response.segments.inbound.length > 0) ? true : false;

    const firstSegment = booking.booking_response.segments.outbound[0];
    const lastSegment = (round) ? booking.booking_response.segments.inbound[0] : booking.booking_response.segments.outbound[0];

    const passengers = booking.booking_detail;
    const tickets = booking.booking_response.passenger_detail;
    const totalStops = (round) ? 1 : 0;

    let totalFlightTime = firstSegment.FlightTime;

    const flightSegments = (data) => {
        let originCity = data.origin_city_name.split(',');
        let destinationCity = data.Destination_city_name.split(',');
        return (
            <div className="d-flex flex-column">
                {
                    <div className="flight-info border border-primary mb-3 p-5" >
                        <div className="flight-inner-row">
                            <p>
                                <span>{date_convert(data.DEPARTURE_DATE)} </span>
                                <span>- {originCity[0]} <span style={{ color: '#FF9800' }}>To</span> {destinationCity[0]}</span>
                            </p>
                        </div>
                        <div className="flight-inner-row row align-items-center mt-2">
                            <div className="airline d-flex flex-row col-4">
                                <img src={data.airline_logo} alt='Carrier Logo' />
                                <div className="p-2 align-self-center">
                                    {
                                        data.airline_name + ' (' + data.Carrier + ') ' + data.FlightNumber.slice(2)
                                    }
                                </div>
                            </div>
                            <div className="plane col-2 text-center">
                                <i className="fas fa-plane"/>
                            </div>
                            <div className="depart col-3">
                                <h4>Departure</h4>
                                <div>
                                    <h5>{data.DEPARTURE_TIME}</h5>
                                </div>
                                <h5>{date_convert(data.DEPARTURE_DATE)}</h5>
                            </div>
                            <div className="arrival col-3">
                                <h4>Arrival</h4>
                                <div>
                                    <h5>{data.ARRIVAL_TIME}</h5>
                                </div>
                                <h5>{date_convert(data.DEPARTURE_DATE)}</h5>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }

    return (
        <div>
            <div className="statuses text-center">
                <h4 className="text-center">Booking Statuses</h4>
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
                <h4 className="text-center">Passenger Information</h4>
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
                            return <div className="d-flex flex-column border border-dark mt-4" key={Math.random()}>
                                <div className="d-flex flex-row">
                                    <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passenger Name: </span>
                                            {pax.title + '. ' + pax.f_name + ' ' + pax.l_name}
                                        </p>
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Nationality: </span>{pax.nationality}
                                        </p>
                                    </div>
                                    <div className="col-4 d-flex flex-column text-left border-right border-right-dark">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Date of Birth: </span>
                                            {date_convert(pax.dob)}
                                        </p>
                                        {
                                            (tickets[index].cnic !== null && tickets[index].cnic !== '' && tickets[index].cnic !== ' ' && tickets[index].cnic !== '_____-_______-_') &&
                                            <p className="text-capitalize">
                                                <span className="font-weight-bold">CNIC: </span>{tickets[index].cnic}
                                            </p>
                                        }
                                        {
                                            ((tickets[index].cnic === null || tickets[index].cnic === '' || tickets[index].cnic === ' ' || tickets[index].cnic === '_____-_______-_') && tickets[index].ticket_number && tickets[index].ticket_number !== null) &&
                                            <p className="text-capitalize">
                                                <span className="font-weight-bold">E-Ticket Number: </span>{tickets[index].ticket_number}
                                            </p>
                                        }
                                    </div>
                                    <div className="col-4 d-flex flex-column text-left">
                                        <p className="text-capitalize">
                                            <span className="font-weight-bold">Passenger Type: </span>{pax.passenger_type}
                                        </p>
                                        {
                                            ((tickets[index].cnic !== null && tickets[index].cnic !== '' && tickets[index].cnic !== ' ' && tickets[index].cnic !== '_____-_______-_') && tickets[index].ticket_number && tickets[index].ticket_number !== null) &&
                                            <p className="text-capitalize">
                                                <span className="font-weight-bold">E-Ticket Number: </span>{tickets[index].ticket_number}
                                            </p>
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className="pax-info d-flex flex-column mt-4">
                <h4 className="text-center">Flight Details</h4>
                <div className="d-flex flex-column m-3">
                    <div className="d-flex flex-row">
                        <div className="col-3 text-wrap">
                            <div className="text-capitalize text-left font-weight-bold">
                                <div className="row">{firstSegment.origin_city_name}</div>
                                <div className="row">To</div>
                                <div className="row">{lastSegment.Destination_city_name}</div>
                            </div>
                        </div>
                        <div className="col-2" />
                        <div className="col-2">
                            <div className="text-capitalize text-left">
                                <div className="row font-weight-bold h4">Departure</div>
                                <div className="row">
                                    <p className="font-weight-bold h5">{firstSegment.DEPARTURE_TIME}</p>
                                </div>
                                <div className="row">{date_convert(firstSegment.DEPARTURE_DATE)}</div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="text-capitalize">
                                <div className="">
                                    <span className="font-weight-bold">Stops: &nbsp;</span>
                                    <span>
                                        {(totalStops === 0) ? 'Direct Flight' : (totalStops === 1) ? '1 Stop' : totalStops + ' Stops'}
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
                                    <p className="font-weight-bold h5">{lastSegment.ARRIVAL_TIME}</p>
                                </div>
                                <div className="row">{date_convert(lastSegment.DEPARTURE_DATE)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {flightSegments(firstSegment)}
                {(round) && flightSegments(lastSegment)}
            </div>
        </div>
    )
}