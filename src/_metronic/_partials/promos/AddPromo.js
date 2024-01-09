import React, { useState, useEffect } from "react";
import { Plane } from "react-loader-spinner";
import { Button, Modal } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { AirlinesJson } from "./AirlinesJson";
import Autosuggests from "./autosuggests/AutoSuggests";
import Cities from "../../_helpers/Cities.json";
import "./autosuggests/autosuggests.css";
import { split } from "lodash";
export default function AddPromo({
  showModal,
  handleShow,
  loader,
  submitPromo,
}) {
  const [disBtn, setDisBtn] = useState(true);
  const [showRow, setShowRow] = useState([{ from: "", to: "", on_return: "" }]);
  const [promoTitle, setPromoTitle] = useState("");
  const [promoValue, setPromoValue] = useState("");
  const [PromoStartDate, setPromoStartDate] = useState("");
  const [PromoEndDate, setPromoEndDate] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [startTravel, setStartTravel] = useState("");
  const [toTravel, setToTravel] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [promoType, setPromoType] = useState("percentage");
  const [onReturn, setOnReturn] = useState("");
  const [promoAirlineCode, setPromoAirlineCode] = useState([]);
  const [codesState, setCodesState] = useState([]);
  const [rowsState, setRowsState] = useState([]);
  const [errors, setErrors] = useState(false);
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [cityFromList, setCityFromList] = useState([]);
  const [cityToList, setCityToList] = useState([]);

  const [showToList, setShowToList] = useState(false);
  const [showFromList, setShowFromList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAirlinecode, setShowAirlineCode] = useState([
    {
      airlinecode: "",
    },
  ]);
  const Airports = Cities;
  let codesarray = [];
  let rowsArray = [];
  // autosuggest code start here

  const search = async (value, save) => {
    let val = value.toLowerCase();
    let result = [];
    if (val.length === 3) {
      result = Airports.filter((city) => city.code.toLowerCase().match(val));
      if (result.length === 0) {
        result = Airports.filter((city) =>
          city.city_name.toLowerCase().match(val)
        );
      }
    } else if (val.length < 3 || val.length > 3) {
      result = Airports.filter(
        (city) =>
          city.code.toLowerCase().match(val) ||
          city.city_name.toLowerCase().match(val)
      );
    } else {
      result = [];
    }

    if (save === "fromAirport") {
      setCityFromList(result);
    } else {
      setCityToList(result);
    }
  };

  const onChangeFrom = (newValue, clear, indexval) => {
    AirportListDropdown("fromAirport");
    setFromAirport(newValue);
    setRouteFrom(newValue);
    setCurrentIndex(indexval);
    const list = [...showRow];
    list[indexval]["from"] = newValue;
    setShowRow(list);

    if (newValue.length >= 3 && clear === false) {
      search(newValue, "fromAirport");
    } else {
      setCityFromList([]);
    }
  };

  const onChangeTo = (newValue, clear, indexval) => {
    AirportListDropdown("toAirport");
    setToAirport(newValue);
    setRouteTo(newValue);
    setCurrentIndex(indexval);
    const list = [...showRow];
    list[indexval]["to"] = newValue;
    setShowRow(list);

    if (newValue.length >= 3 && clear === false) {
      search(newValue, "toAirport");
    } else {
      setCityToList([]);
    }
  };

  const AirportListDropdown = (trigger) => {
    if (trigger === "fromAirport") {
      setShowFromList(true);
      setShowToList(false);
    } else if (trigger === "toAirport") {
      setShowFromList(false);
      setShowToList(true);
    } else {
      setShowFromList(false);
      setShowToList(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", function (e) {
      if (e.target.className.indexOf("close-suggest") === -1) {
        setShowFromList(false);
        setShowToList(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setShowFromList(false);
        setShowToList(false);
      }
    });
  }, []);

  //autosuggest code end here
  const addRowHandler = () => {
    setShowRow([...showRow, { from: "", to: "", on_return: "" }]);
  };

  const handleRoutes = (e, index) => {
    setRouteFrom(e.target.value);
    setRouteTo(e.target.value);

    const { name, value } = e.target;

    const list = [...showRow];
    if (name !== "on_return") {
      list[index][name] = value;
    }

    list[index]["on_return"] = e.target.checked;
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
      if (returnElments[i].checked) {
        returnValue = "1";
      }
      setOnReturn(e.target.checked);
      let from = elements[i].value.split("|")[0];
      let to = toElements[i].value.split("|")[0];
      let newRow = {
        from: from.trim(),
        to: to.trim(),
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

  const setroutesDirect = () => {
    let elements = document.getElementsByClassName(" promo-rows");
    let toElements = document.getElementsByClassName("promo-to");
    let returnElments = document.getElementsByClassName("promo-return");

    for (
      let i = 0;
      i < elements.length && i < toElements.length && i < returnElments.length;
      i++
    ) {
      let returnValue = "0";
      if (returnElments[i].checked) {
        returnValue = "1";
      }
      let from = elements[i].value.split("|")[0];
      let to = toElements[i].value.split("|")[0];
      let newRow = {
        from: from.trim(),
        to: to.trim(),
        on_return: returnValue,
      };

      rowsArray.push(newRow);
      setRowsState(rowsArray);
    }
  };
  const addAirlineCodeHandler = () => {
    setShowAirlineCode([
      ...showAirlinecode,
      {
        airlinecode: "",
      },
    ]);
  };
  const startTravelHandler = (e) => {
    setStartTravel(e.target.value);
  };
  const toTravelHandler = (e) => {
    setToTravel(e.target.value);
  };
  const handlePromoCode = (e, index) => {
    const list = [...showAirlinecode];
    list[index]["airline_code"] = e.value;
    setShowAirlineCode(list);
    setDisBtn(false);
    codesarray.length = 0;
    const timer = setTimeout(() => {
      let elements = document.getElementsByName("airlinecode");
      for (let i = 0; i < elements.length; i++) {
        let newobj = {
          airline_code: elements[i].value,
        };

        codesarray.push(newobj);
        setCodesState(codesarray);
      }
    }, 1000);
  };
  const removeAirlineHandler = (index) => {
    const items = [...showAirlinecode];
    items.splice(index, 1);

    setShowAirlineCode(items);
  };
  const handlePromoType = (e) => {
    setPromoType(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      promoTitle.trim() === "" ||
      promoValue.trim() === "" ||
      PromoStartDate.trim() === "" ||
      PromoEndDate.trim() === "" ||
      promoDescription.trim() === "" ||
      routeFrom.trim() === "" ||
      routeTo.trim() === ""
    ) {
      setErrors(true);
    } else {
      setDisBtn(false);
      setroutesDirect();
      let allData = {
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
      const timer = setTimeout(() => {
        submitPromo(allData);
        // console.log(allData);
      }, 1000);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleShow}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title className="text-center">Add Promo</Modal.Title>
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
                      type="search"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      onChange={(e) => {
                        setPromoTitle(e.target.value);
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
                      value={promoType}
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
                      type="date"
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
                      type="date"
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Title"
                      onChange={(e) => {
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
                      rows={1}
                      className="form-control"
                      id="continent-name"
                      placeholder="Enter Promo Description"
                      onChange={(e) => {
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
                      startTravelHandler(e);
                    }}
                    type="date"
                    className="form-control"
                    id="continent-name"
                    placeholder="Enter Promo Title"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor=""> Travel End Date </label>
                  <input
                    onChange={(e) => {
                      toTravelHandler(e);
                    }}
                    type="date"
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
                        <Autosuggests
                          name="from"
                          indexval={index}
                          value={item.from ? item.from : ""}
                          onChange={onChangeFrom}
                          icon={<i className="fas fa-plane-departure" />}
                          AirportListDropdown={AirportListDropdown}
                          addClass="promo-rows"
                          onRoutes={handleRoutes}
                        />
                        {showFromList &&
                          fromAirport.length > 2 &&
                          cityFromList.length > 0 &&
                          currentIndex === index && (
                            <div className="position-absolute overflow-y w-100 bg-white suggestions from-top">
                              {cityFromList.map((city, indexval) => {
                                return (
                                  <span
                                    className="suggest-item cursor-pointer w-100 p-2 close-suggest"
                                    key={indexval}
                                    onClick={() => {
                                      onChangeFrom(
                                        `${city.code} | ${city.city_name}`,
                                        true,
                                        index
                                      );
                                    }}
                                  >
                                    <span className=" row m-0 close-suggest">
                                      <div className="col-md-12 d-flex pl-0 close-suggest">
                                        <div className="col-1 m-auto close-suggest">
                                          <i className="fas  fa-plane mr-3 close-suggest" />
                                        </div>
                                        <div className="col-9 d-flex flex-column close-suggest">
                                          <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                            {city.city_name.split(",")[0]}
                                          </h6>
                                          <p className="col-md-12 remove-flex country-name-field close-suggest">
                                            {city.city_name
                                              .split(",")[1]
                                              .replace(", ", "")}
                                          </p>
                                        </div>
                                        <div className="col-2 m-auto close-suggest city-code">
                                          {city.code}
                                        </div>
                                      </div>
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                      </div>
                      {/* <div className="">
                        <input
                          type="text"
                          className="form-control  promo-rows"
                          name="from"
                          value={item.from ? item.from : ""}
                          placeholder="Enter From City"
                          onChange={(e) => {
                            handleRoutes(e, index);
                          }}
                        />
                      </div> */}
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
                      <div className=" position-relative inputs-filed">
                        <label className="font-weight-bold">To</label>
                        <Autosuggests
                          name="to"
                          indexval={index}
                          value={item.to ? item.to : ""}
                          onChange={onChangeTo}
                          icon={<i className="fas fa-plane-arrival" />}
                          AirportListDropdown={AirportListDropdown}
                          addClass="promo-to"
                          onRoutes={handleRoutes}
                        />
                        {showToList &&
                          toAirport.length > 2 &&
                          cityToList.length > 0 &&
                          currentIndex === index && (
                            <div className="position-absolute overflow-y w-100 bg-white suggestions to-top">
                              {cityToList.map((city, indexl) => {
                                return (
                                  <span
                                    className="suggest-item cursor-pointer w-100 p-2 close-suggest"
                                    key={indexl}
                                    onClick={() => {
                                      onChangeTo(
                                        `${city.code} | ${city.city_name}`,
                                        true,
                                        index
                                      );
                                    }}
                                  >
                                    <span className=" row m-0 close-suggest">
                                      <div className="col-md-12 d-flex pl-0 close-suggest">
                                        <div className="col-1 m-auto close-suggest">
                                          <i className="fas fa-plane mr-3 close-suggest" />
                                        </div>
                                        <div className="col-9 d-flex flex-column close-suggest">
                                          <h6 className="col-md-12 remove-flex airport-name close-suggest">
                                            {city.city_name.split(",")[0]}
                                          </h6>
                                          <p className="col-md-12 remove-flex country-name-field close-suggest">
                                            {city.city_name
                                              .split(",")[1]
                                              .replace(", ", "")}
                                          </p>
                                        </div>
                                        <div className="col-2 m-auto close-suggest">
                                          {city.code}
                                        </div>
                                      </div>
                                    </span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                      </div>
                      {/* <div className="">
                        <input
                          type="text"
                          className="form-control  promo-to"
                          name="to"
                          value={item.to ? item.to : ""}
                          placeholder="Enter To city"
                          onChange={(e) => {
                            handleRoutes(e, index);
                          }}
                        />
                      </div> */}
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
                          checked={item.on_return}
                          id="flexCheckDefault"
                          onChange={(e) => {
                            handleRoutes(e, index);
                          }}
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
                        <button
                          onClick={() => removeRowHandler(index)}
                          title="Remove This Route"
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    )}
                    {showRow.length - 1 === index && (
                      <div className="col-md-12 row my-3 ml-0 ">
                        <div className="pt-2">
                          <label className="font-weight-bold"></label>
                        </div>
                        <button
                          onClick={addRowHandler}
                          className="btn btn-primary"
                        >
                          {" "}
                          Add New
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="row mt-5">
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
                        {/* <select
                          className="form-control promo-airlinecode"
                          placeholder="Enter Promo Title"
                          name="airlinecode"
                          value={airlinesingle.airlinecode}
                          onChange={(e) => {
                            handlePromoCode(e, index);
                          }}
                        > */}
                        {/* <option defaultValue="">select Airline</option> */}
                        {/* {AirlinesJson.map((option) => (
                            <option defaultValue={airlinesingle.airlinecode}> 
                              {option.name}
                            </option>
                          ))}
                        </select> */}
                        <CreatableSelect
                          className=" promo-airlinecode"
                          name="airlinecode"
                          options={AirlinesJson}
                          defaultValue={airlinesingle.airlinecode}
                          onChange={(e) => {
                            handlePromoCode(e, index);
                          }}
                        />
                      </div>
                    </div>
                    {showAirlinecode.length > 1 && (
                      <div className="col-md-1 text-right">
                        <div className="pt-2 ">
                          <label className="font-weight-bold"></label>
                        </div>
                        <button
                          onClick={() => {
                            removeAirlineHandler(index);
                          }}
                          title="Remove This Airline"
                          className="btn btn-danger btn-sm"
                        >
                          {" "}
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    )}
                    {showAirlinecode.length - 1 === index && (
                      <div className="col-md-12 mt-2 ">
                        <button
                          onClick={addAirlineCodeHandler}
                          className="btn btn-primary"
                        >
                          {" "}
                          Add New
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="row">
                <div className="col-12 text-center mt-2">
                  <button
                    disabled={disBtn}
                    type="submit"
                    variant="primary"
                    className="submit-btn btn btn-primary"
                  >
                    Add Promo
                  </button>
                </div>
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
