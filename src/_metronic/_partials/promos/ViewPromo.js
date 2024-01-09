import React, { useState } from "react";
import { Plane } from "react-loader-spinner";
import { Button, Modal } from "react-bootstrap";
import { AirlinesJson } from "./AirlinesJson";
import Cities from "../../_helpers/Cities.json";

export default function ViewPromo({
  showModal,
  handleShow,
  loader,
  submitPromo,
  data,
}) {
  console.log(data);
  const [disBtn, setDisBtn] = useState(true);
  const [showRow, setShowRow] = useState(data.promo_routes);
  const [promoTitle, setPromoTitle] = useState(data.promo_title);
  const [promoValue, setPromoValue] = useState(data.promo_original_value);
  const [PromoStartDate, setPromoStartDate] = useState(data.promo_from_date);
  const [PromoEndDate, setPromoEndDate] = useState(data.promo_to_date);
  const [routeFrom, setRouteFrom] = useState("");
  const [promoDescription, setPromoDescription] = useState(
    data.promo_description
  );
  const [startTravel, setStartTravel] = useState(data.travel_from_date);
  const [toTravel, setToTravel] = useState(data.travel_to_date);
  const [routeTo, setRouteTo] = useState("");
  const [promoType, setPromoType] = useState(data.promo_type);
  const [onReturn, setOnReturn] = useState("");

  const [codesState, setCodesState] = useState([]);
  const [rowsState, setRowsState] = useState([]);
  const [errors, setErrors] = useState(false);
  const [showAirlinecode, setShowAirlineCode] = useState(data.promo_airlines);

  let codesarray = [];
  let rowsArray = [];

  const addRowHandler = () => {
    setShowRow([...showRow, { from_city: "", to_city: "", on_return: "" }]);
    setDisBtn(false);
  };

  const handleRoutes = (e, index) => {
    setDisBtn(false);

    setRouteFrom(e.target.value);
    setRouteTo(e.target.value);

    const { name, value } = e.target;

    const list = [...showRow];
    if (name !== "on_return") {
      list[index][name] = value;
    }

    list[index]["on_return"] = e.target.defaultChecked;
    setShowRow(list);
    rowsArray.length = 0;
    let elements = document.getElementsByClassName(" promo-rows");
    let toElements = document.getElementsByClassName("promo-to");
    let returnElments = document.getElementsByClassName("promo-return");
    for (
      let i = 0;
      i < elements.length && i < toElements.length && i < returnElments.length;
      i++
    ) {
      let returnValue = "0";
      if (returnElments[i].defaultChecked) {
        returnValue = "1";
      }
      setOnReturn(e.target.defaultChecked);
      let newRow = {
        from: elements[i].value,
        to: toElements[i].value,
        on_return: returnValue,
      };

      rowsArray.push(newRow);
      setRowsState(rowsArray);
    }
  };
  const removeRowHandler = (index) => {
    const list = [...showRow];
    list.splice(index, 1);
    setShowRow(list);
  };
  const addAirlineCodeHandler = () => {
    setShowAirlineCode([
      ...showAirlinecode,
      {
        airline_code: "",
      },
    ]);
  };
  const startTravelHandler = (e) => {
    setStartTravel(e.target.value);
    setDisBtn(false);
  };
  const toTravelHandler = (e) => {
    setToTravel(e.target.value);
    setDisBtn(false);
  };
  const handlePromoCode = (e, index) => {
    setDisBtn(false);

    const { name, value } = e.target;
    const list = [...showAirlinecode];
    list[index][name] = value;
    setShowAirlineCode(list);
    setDisBtn(false);
    codesarray.length = 0;
    let elements = document.getElementsByClassName("promo-airlinecode");
    for (let i = 0; i < elements.length; i++) {
      let newobj = {
        airline_code: elements[i].value,
      };

      codesarray.push(newobj);
      setCodesState(codesarray);
    }
  };
  const removeAirlineHandler = (index) => {
    const items = [...showAirlinecode];
    items.splice(index, 1);

    setShowAirlineCode(items);
  };
  const handlePromoType = (e) => {
    setPromoType(e.target.value);
    setDisBtn(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      promoTitle.trim() === "" ||
      // promoValue.trim() === "" ||
      PromoStartDate.trim() === "" ||
      PromoEndDate.trim() === "" ||
      promoDescription.trim() === "" ||
      routeFrom.trim() === "" ||
      routeTo.trim() === ""
    ) {
      setErrors(true);
    } else {
      let allData = {
        id: data.row_id,
        promo_title: promoTitle,
        promo_type: promoType,
        promo_value: promoValue,
        promo_from_date: PromoStartDate,
        promo_to_date: PromoEndDate,
        promo_description: promoDescription ? promoDescription : "",
        travel_from_date: startTravel ? startTravel : "",
        travel_to_date: toTravel ? toTravel : "",
        promo_routes: JSON.stringify(rowsState),
        promo_airlines: JSON.stringify(codesState),
      };
      submitPromo(allData);
    }
  };
  let cityfromfullname = "";
  let citytofullname = "";
  return (
    <Modal
      show={showModal}
      onHide={handleShow}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-center">View Promo</Modal.Title>
        {!loader && (
          <Button variant="normal" onClick={handleShow}>
            <i className="fas fa-times p-0" />
          </Button>
        )}
      </Modal.Header>
      <Modal.Body>
        {!loader ? (
          <>
            <form onSubmit={handleSubmit}>
              <div className=" row ">
                <div className=" col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">Promo Title</label>
                  </div>
                  <div className="">
                    <input
                      value={data.promo_title ? data.promo_title : ""}
                      type="search"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      onChange={(e) => {
                        setPromoTitle(e.target.value);
                        setDisBtn(false);
                      }}
                    />
                  </div>
                  {errors && promoTitle.length <= 0 ? (
                    <label className="text-danger pt-2" htmlFor="">
                      {" "}
                      promo Title Is Required.
                    </label>
                  ) : (
                    " "
                  )}
                </div>
                <div className="col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">Promo Type</label>
                  </div>
                  <div className="">
                    <select
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      value={data.promo_type ? data.promo_type : ""}
                      onChange={handlePromoType}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">Promo Value</label>
                  </div>
                  <div className="">
                    <input
                      value={
                        data.promo_original_value
                          ? data.promo_original_value
                          : ""
                      }
                      type="number"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Value"
                      onChange={(e) => setPromoValue(e.target.value)}
                    />
                  </div>
                  {errors && promoValue.length <= 0 ? (
                    <label className="text-danger pt-2" htmlFor="">
                      {" "}
                      promo Value Can,t be Empty
                    </label>
                  ) : (
                    " "
                  )}
                </div>
              </div>
              <div className=" row  mt-4">
                <div className=" col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">Promo startDate</label>
                  </div>
                  <div className="">
                    <input
                      value={data.promo_from_date ? data.promo_from_date : ""}
                      type="text"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      onChange={(e) => {
                        setPromoStartDate(e.target.value);
                      }}
                    />
                  </div>
                  {errors && PromoStartDate.length <= 0 ? (
                    <label className="text-danger pt-2" htmlFor="">
                      {" "}
                      Please Choose Promo Start Date
                    </label>
                  ) : (
                    " "
                  )}
                </div>
                <div className="col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">Promo EndDate</label>
                  </div>
                  <div className="">
                    <input
                      value={data.promo_to_date ? data.promo_to_date : ""}
                      type="text"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      onChange={(e) => {
                        setDisBtn(false);

                        setPromoEndDate(e.target.value);
                      }}
                    />
                  </div>
                  {errors && PromoEndDate.length <= 0 ? (
                    <label className="text-danger pt-2" htmlFor="">
                      {" "}
                      Please Choose Promo End Date
                    </label>
                  ) : (
                    " "
                  )}
                </div>
                <div className="col-md-4">
                  <div className=" ">
                    <label className="font-weight-bold">
                      Promo Description
                    </label>
                  </div>
                  <div className="">
                    <textarea
                      value={
                        data.promo_description ? data.promo_description : ""
                      }
                      rows={1}
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Description"
                      onChange={(e) => {
                        setDisBtn(false);

                        setPromoDescription(e.target.value);
                      }}
                    />
                  </div>

                  {errors && promoDescription.length <= 0 ? (
                    <label className="text-danger pt-2" htmlFor="">
                      {" "}
                      Please Enter Promo Description.
                    </label>
                  ) : (
                    " "
                  )}
                </div>
              </div>
              <div className="row  mt-4">
                <div className="col-md-4">
                  <label htmlFor="">Travel Start Date</label>
                  <input
                    onChange={(e) => {
                      setDisBtn(false);

                      startTravelHandler(e);
                    }}
                    value={data.travel_from_date}
                    type="text"
                    className="form-control"
                    id="continent-name"
                    placeholder="Enter Promo Title"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor=""> Travel End Date </label>
                  <input
                    value={data.travel_to_date}
                    onChange={(e) => {
                      toTravelHandler(e);
                    }}
                    type="text"
                    className="form-control"
                    id="continent-name"
                    placeholder="Enter Promo Title"
                  />
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-md-12">
                  <h4 className="text-muted">Promo Routes</h4>
                </div>
              </div>
              <div className=" row mt-2 mb-2 ">
                {showRow.map((item, index) => (
                  <div className="row col-md-12 mt-2" key={index}>
                    <div className=" col-md-4">
                      <div className=" ">
                        <label className="font-weight-bold">From</label>
                      </div>
                      <div className="">
                        {Cities.filter(function (city) {
                          if (city.code === item.from) {
                            cityfromfullname =
                              city.code + " | " + city.city_name;
                          }
                        })}
                        <input
                          type="text"
                          className="form-control  promo-rows"
                          name="from"
                          defaultValue={cityfromfullname}
                          placeholder="Enter From City"
                          // onChange={(e) => {
                          //   handleRoutes(e, index);
                          // }}
                        />
                      </div>
                      {errors && routeFrom.length <= 0 ? (
                        <label className="text-danger pt-2" htmlFor="">
                          {" "}
                          choose Route From Please .
                        </label>
                      ) : (
                        " "
                      )}
                    </div>
                    <div className="col-md-4">
                      <div className=" ">
                        <label className="font-weight-bold">To</label>
                      </div>
                      <div className="">
                        {Cities.filter(function (city) {
                          if (city.code === item.to) {
                            citytofullname = city.code + " | " + city.city_name;
                          }
                        })}
                        <input
                          type="text"
                          className="form-control  promo-to"
                          name="to"
                          defaultValue={citytofullname}
                          placeholder="Enter To city"
                          // onChange={(e) => {
                          //   handleRoutes(e, index);
                          // }}
                        />
                      </div>
                      {errors && routeTo.length <= 0 ? (
                        <label className="text-danger pt-2" htmlFor="">
                          {" "}
                          choose Route To Please .
                        </label>
                      ) : (
                        " "
                      )}
                    </div>
                    <div className="col-md-3">
                      <div className=" pt-2 ">
                        <label className="font-weight-bold"></label>
                      </div>
                      <div className="form-check form-control   ">
                        <input
                          className="form-check-input ml-1 promo-return"
                          type="checkbox"
                          name="on_return"
                          defaultChecked={item.on_return}
                          id="flexCheckDefault"
                          // onChange={(e) => {
                          //   setDisBtn(false);

                          //   handleRoutes(e, index);
                          // }}
                        />
                        <label
                          className="form-check-label ml-7"
                          htmlFor="flexCheckDefault"
                        >
                          Apply on Return?
                        </label>
                      </div>
                    </div>
                    {showRow.length > 1 && (
                      <div className="col-md-1 text-right">
                        <div className="pt-2 ">
                          <label className="font-weight-bold"></label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="row ">
                <div className="col-md-12">
                  <h4 className="text-muted">Promo Airlines</h4>
                </div>
              </div>
              <div className=" row mt-2 mb-2 ">
                {showAirlinecode.map((airlinesingle, index) => (
                  <div
                    key={index}
                    className={`row col-md-12 mt-2 airlinerow${index}`}
                  >
                    <div className=" col-md-11">
                      <div className=" ">
                        <label className="font-weight-bold">
                          {" "}
                          Select Airline
                        </label>
                      </div>
                      <div className="">
                        {console.log("dddd ", airlinesingle.airline_code)}
                        <select
                          className="form-control promo-airlinecode"
                          placeholder="Enter Promo Title"
                          name="airlinecode"
                          value={airlinesingle.airline_code}
                          onChange={(e) => {
                            handlePromoCode(e, index);
                          }}
                        >
                          {AirlinesJson.map(
                            (option, index) =>
                              airlinesingle.airline_code === option.value && (
                                <option key={index} value={option.value}>
                                  {option.label}
                                </option>
                              )
                          )}
                        </select>
                      </div>
                    </div>
                    {showAirlinecode.length > 1 && (
                      <div className="col-md-1 text-right">
                        <div className="pt-2 ">
                          <label className="font-weight-bold"></label>
                        </div>
                      </div>
                    )}
                    {showAirlinecode.length - 1 === index && (
                      <div className="col-md-12 mt-2 "></div>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </>
        ) : (
          <div className="d-flex flex-column text-center plane-loader">
            <Plane secondaryColor="#378edd" color="#378edd" />
            <h3>Please Wait... We are Adding New Continent</h3>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
