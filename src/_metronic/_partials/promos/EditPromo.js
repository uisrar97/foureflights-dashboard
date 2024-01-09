import React, { useState, useEffect } from "react";
import { Plane } from "react-loader-spinner";
import { Button, Modal } from "react-bootstrap";
import { AirlinesJson } from "./AirlinesJson";
import CreatableSelect from "react-select/creatable";
import Autosuggests from "./autosuggests/AutoSuggests";
import Cities from "../../_helpers/Cities.json";

export default function EditPromo({
  showModal,
  handleShow,
  loader,
  submitUpdatePromo,
  data,
}) {
  const [disBtn, setDisBtn] = useState(true);
  const [showRow, setShowRow] = useState(data.promo_routes);
  const [promoTitle, setPromoTitle] = useState(data.promo_title);
  const [promoValue, setPromoValue] = useState(data.promo_original_value);
  const [PromoStartDate, setPromoStartDate] = useState(data.promo_from_date);
  const [PromoEndDate, setPromoEndDate] = useState(data.promo_to_date);
  const [routeFrom, setRouteFrom] = useState(data.promo_full_route_name_from);
  const [promoDescription, setPromoDescription] = useState(
    data.promo_description
  );
  const [startTravel, setStartTravel] = useState(data.travel_from_date);
  const [toTravel, setToTravel] = useState(data.travel_to_date);
  const [routeTo, setRouteTo] = useState(data.promo_full_route_name_to);
  const [promoType, setPromoType] = useState(data.promo_type);
  const [onReturn, setOnReturn] = useState("");
  const [fromAirport, setFromAirport] = useState("");

  const [codesState, setCodesState] = useState(data.promo_airlines);
  const [rowsState, setRowsState] = useState(data.promo_routes);
  const [errors, setErrors] = useState(false);
  const [toAirport, setToAirport] = useState("");
  const [showToList, setShowToList] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFromList, setShowFromList] = useState(false);
  const [cityFromList, setCityFromList] = useState([]);

  const [cityToList, setCityToList] = useState([]);

  const [showAirlinecode, setShowAirlineCode] = useState(data.promo_airlines);
  const Airports = Cities;
  let codesarray = [];
  let rowsArray = [];
  const addRowHandler = () => {
    setShowRow([
      ...showRow,
      {
        promo_full_route_name_from: "",
        promo_full_route_name_to: "",
        on_return: "",
      },
    ]);
    setDisBtn(false);
  };
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
    list[indexval]["promo_full_route_name_from"] = newValue;
    setShowRow(list);
    setroutesDirect();
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
    list[indexval]["promo_full_route_name_to"] = newValue;
    setShowRow(list);
    setroutesDirect();
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

  const handleRoutes = (e, index) => {
    setDisBtn(false);

    setRouteFrom(e.target.value);
    setRouteTo(e.target.value);

    const { name, value } = e.target;

    const list = [...showRow];
    if (name !== "on_return") {
      list[index][name] = value;
    } else {
      list[index]["on_return"] = e.target.checked;
    }

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
    setDisBtn(false);

    const list = [...showRow];
    list.splice(index, 1);
    setShowRow(list);
  };
  const addAirlineCodeHandler = () => {
    setDisBtn(false);

    setShowAirlineCode([
      ...showAirlinecode,
      {
        airline_code: "",
      },
    ]);
  };
  const startTravelHandler = (e) => {
    setDisBtn(false);

    setStartTravel(e.target.value);
    setDisBtn(false);
  };
  const toTravelHandler = (e) => {
    setToTravel(e.target.value);
    setDisBtn(false);
  };
  const setroutesDirect = () => {
    const timer = setTimeout(() => {
      let elements = document.getElementsByClassName("promo-rows");
      let toElements = document.getElementsByClassName("promo-to");
      let returnElments = document.getElementsByClassName("promo-return");

      for (
        let i = 0;
        i < elements.length &&
        i < toElements.length &&
        i < returnElments.length;
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
      return true;
    }, 1000);
  };
  const handlePromoCode = (e, index) => {
    const list = [...showAirlinecode];
    setDisBtn(false);

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
    setDisBtn(false);

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
      promoTitle.trim() === ""
      // // promoValue.trim() === "" ||
      // PromoStartDate.trim() === "" ||
      // PromoEndDate.trim() === "" ||
      // promoDescription.trim() === "" ||
      // routeFrom.trim() === "" ||
      // routeTo.trim() === ""
    ) {
      setErrors(true);
    } else {
      setDisBtn(false);
      // if(setroutesDirect()){
      setroutesDirect();

      let allData = {
        promo_id: data.id,
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
        submitUpdatePromo(allData);
      }, 2000);
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
        <Modal.Title className="text-center">Edit Promo</Modal.Title>
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
                      defaultValue={data.promo_title ? data.promo_title : ""}
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
                      defaultValue={data.promo_type ? data.promo_type : ""}
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
                      defaultValue={
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
                      defaultValue={
                        data.promo_from_date ? data.promo_from_date : ""
                      }
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
                      defaultValue={
                        data.promo_to_date ? data.promo_to_date : ""
                      }
                      type="date"
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
                      defaultValue={
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
                    defaultValue={data.travel_from_date}
                    type="date"
                    className="form-control"
                    id="continent-name"
                    placeholder="Enter Promo Title"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor=""> Travel End Date </label>
                  <input
                    defaultValue={data.travel_to_date}
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
                          name="promo_full_route_name_from"
                          indexval={index}
                          value={
                            item.promo_full_route_name_from
                              ? item.promo_full_route_name_from
                              : ""
                          }
                          onChange={onChangeFrom}
                          icon={<i className="fas fa-plane-departure" />}
                          AirportListDropdown={AirportListDropdown}
                          onRoutes={handleRoutes}
                          addClass="promo-rows"
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
                          name="promo_full_route_name_to"
                          indexval={index}
                          value={
                            item.promo_full_route_name_to
                              ? item.promo_full_route_name_to
                              : ""
                          }
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
                          placeholder="Enter Promo Title"
                          name="airlinecode"
                          defaultValue={AirlinesJson.filter(function (aircode) {
                            if (aircode.value === airlinesingle.airline_code) {
                              return aircode;
                            }
                          })}
                          options={AirlinesJson}
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
                    Update Promo
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
