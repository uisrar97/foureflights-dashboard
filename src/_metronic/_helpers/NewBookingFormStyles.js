import styled from "styled-components";

export const Slider = styled.section`
  position: relative;
  padding: 25px 0px;
  display: flex;
  flex-direction: row-reverse;
  .New-Booking-Coming-Soon {
    height: 235px;
    img {
      object-fit: contain;
    }
    background-color: #1d75bd;
    * {
      position: relative;
    }
  }
`;
// Booking Forms Div Style
export const BookingFormsDiv = styled.div`
  width: 100%;

  background: #00000085;
  border-radius: 0px 0px 4px 4px;
  // box-shadow: rgb(21 23 27 / 24%) 1px 2px 2px;
  @media only screen and (min-width: 992px) {
    height: 234px;
  }
  .mobile-form-nav {
    display: none;
    p {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      padding: 15px 20px;
    }
    .dropdown {
      display: none;
      padding: 15px 20px;
      text-align: right;
      .fas {
        font-size: 17px;
        color: #fcb040;
      }
      @media (max-width: 800px) {
        display: block;
      }
    }
    @media (max-width: 800px) {
      display: flex;
    }
  }
`;
// Booking Parent
export const BookingParent = styled.div`
  width: 70%;
  height: 10%;
  position: relative;
  background-color: transparent;
  padding-top: 4%;
  padding-bottom: 13%;
  // margin-left: 8%;
  // left: -5%;
  z-index: 2;
  @media (max-width: 991px) {
    width: 90%;
  }
`;
// Booking Nav
export const BookingNav = styled.div`
  width: 100%;
  ul {
    display: flex;
    list-style-type: none;
    width: 100%;
    @media (max-width: 800px) {
      font-size: 10px;
    }
    li {
      display: flex;
      line-height: 24px;
      width: 33.3%;
      font-size: 14px;
      justify-content: center;
      background: #378edd;

      p {
        font-weight: bold;
        padding: 10px 12px;
        color: #fff !important;
        font-family: Bahnschrift;
      }
    }
    & :not(:last-child) {
      border-right: 1px solid #e2e6e9;
    }
  }
  @media (max-width: 1400px) {
    width: calc(100%);
  }
  @media (max-width: 800px) {
    display: none;
  }
`;
// Mobile Booking Nav
export const MobileBookingNav = styled.div`
  // display: none;
  flex-direction: column;
  position: absolute;
  z-index: 4;
  width: 100%;
  ul {
    list-style-type: none;
    font-size: 15px;
    background: #4fa0ea;
    li {
      line-height: 20px;
      a {
        display: block;
        background: #378edd;
        font-weight: bold;
        padding: 13px 22px;
        color: #fff !important;
        width: 100%;
        font-family: Bahnschrift;
      }
    }
    .close-btn {
      text-align: right;
      opacity: 1;
      text-shadow: 0 0 0 black;
      .fas {
        font-size: 17px;
        color: #fcb040;
      }
    }
  }
`;
// New Booking Form
export const BookingForm = styled.div`
  padding: 0px 15px 40px;
  display: flex;
  flex-direction: column;
  .plane-icons {
    position: absolute;
    padding-top: 34px;
    left: 25px;
    margin-top: 3px;
    z-index: 1;
  }

  .error-warning {
    font-size: 14px;
  }

  .date {
    flex-basis: 33.3%;
  }
  .react-datepicker-wrapper .react-datepicker__input-container input {
    border: none;
    border-radius: 5px;
    color: #000;
    background-color: #c5d7ea;
    height: 36px !important;
    width: 100%;
    padding: 0px 0px 0px 35px;
    font-size: 13.333px;
  }
  .react-datepicker-popper {
    z-index: 2;
  }
  .dwpNsH .cabin-class-select .cabin-select__control {
    height: 12px !important;

    border-radius: 5px;
    font-size: 13.333px;
    background-color: #c5d7ea;
    padding: 0px 0px 0px 35px;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  .calender-icon {
    z-index: 1;
    margin-top: 37px;
    margin-left: 10px;
  }
  .cabin-class-select {
    width: 100%;
    border-radius: 5px;
    position: relative;
    border: none;
    height: 35px !important;
    .cabin-select__indicators {
      display: none !important;
    }
    .cabin-select__value-container {
      padding: 0px !important;
    }
    .cabin-select__control {
      border: none !important;
      border-radius: 5px;
      font-size: 13.333px;
      background-color: #c5d7ea;
      padding: 0px 0px 0px 35px;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .cabin-select__control--is-focused {
      box-shadow: none !important;
    }
    .cabin-select__menu {
      font-size: 14px !important;
      margin-top: 0 !important;
    }
  }
  .booking-form-counter {
    border-bottom: 2px solid #378edd;
  }
  .booking-form-button:hover {
    border-color: #fcb040;
  }
`;
// Get My Booking by PNR
export const GetBooking = styled.div`
  height: 442px;
  input {
    border: none;
    border-radius: 5px;
    color: #000;
    background-color: white;
    height: 40px;
    width: 100%;
    padding: 0px 20px 0px 35px;
  }
  .get-booking-button:hover:not([disabled]) {
    border-color: #fcb040;
  }
  .plane-icons {
    position: absolute;
    margin-top: 35px;
    left: 25px;
    z-index: 1;
    color: unset !important;
  }
  .navlink-plane-icon {
    position: absolute;
    margin-top: 37px;
    left: 40px;
    z-index: 1;
    color: unset !important;
  }
  .get-booking-button:disabled {
    cursor: no-drop;
  }
`;
// Hotel Parent Div
export const HotelForm = styled.div`
  height: 442px;
  .loader-div {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 40%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    @media (max-width: 991px) {
      left: 45%;
    }
    @media (max-width: 500px) {
      left: 40%;
    }
  }
  .region-sector-select {
    width: 100%;
    border-radius: 5px;
    position: relative;
    border: none;
    height: 40px;
    select {
      height: 36px !important;
      border-radius: 5px;
      font-size: 14px;
      background-color: #c5d7ea !important;
      padding: 0px 0px 0px 35px;
      -webkit-appearance: none;
      -moz-appearance: none;
      option {
        background-color: #f6fbff;
      }
    }
    .react-select__single-value,
    .react-select__placeholder {
      margin-left: 25px !important;
    }
    .react-select__control {
      background-color: #c5d7ea !important;
    }
    .react-select__indicator-separator {
      background-color: #999999 !important;
    }
    .react-select__indicator {
      color: #828282 !important;
    }
    .react-select__menu {
      z-index: 2 !important;
    }
    .react-select__input-container .react-select__input {
      margin-left: 25px !important;
    }
  }
  .date {
    flex-basis: 33.3%;
  }
  .react-datepicker-wrapper .react-datepicker__input-container input {
    border: none;
    border-radius: 5px;
    color: #000;
    background-color: #c5d7ea;
    height: 40px;
    width: 100%;
    padding: 0px 0px 0px 35px;
    font-size: 13.333px;
  }
  .calender-icon {
    z-index: 1;
    margin-top: 37px;
    margin-left: 10px;
    color: #378edd;
  }
  .get-hotels-button:hover:not([disabled]) {
    border-color: #fcb040;
  }
  .get-hotels-button:disabled {
    cursor: no-drop;
  }
`;
