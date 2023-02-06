import React, { useState, useEffect, useCallback } from 'react';

import './css/Module.css';

import { DeliveriesDatatable, DatatableCustomControl } from 'components/DeliveriesDatatable';
//import { CustomScheduleDatatable,DatatableCustomControl } from 'components/CustomScheduleDatatable';
// import { useDatatableSelection } from 'components/hooks/useDatatableSelection';

import Modal from 'react-bootstrap/Modal';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';

import { DatatableOrderSearch } from 'components/DatatableOrderSearch';
import _ from "lodash";

import { apiService } from 'services/apiService';
import { apiCustomService } from 'services/apiCustomService';
import { alert } from 'helpers';
import swal from 'sweetalert';
import moment from 'moment';
import { DatatableSplitScreenSearch } from 'components/DatatableSplitScreenSearch';
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
/**
 * @typedef Field
 * @property {string} name The name of the field.
 * @property {string} label The label for the field to be displayed in the UI.
 * @property {any} [default] The default value of the field.
 * @property {string} [type] The type of the field's input.
 * @property {string[]} [choices] Choices for select, checkboxes and radios.
 * @property {string[]} [richTextAreaOptions] Options for the Rich Text Area (TinyMCE).
 * @property {boolean} [hidden] If the field should be shown in the row's expandable area.
 * @property {boolean} [noDisplay] If the fiels should not be shown in the table.
 * @property {boolean} [noInput] If the field should not be in the form.
 * @property {boolean} [noAPI] If the field is not a field in the API (or database) as well.
 * @property {Function} [cell] A function for providing a custom cell for the field in the table.
 */

/**
 * @typedef ModuleProps
 * @property {string} name
 * @property {string} singularName
 * @property {FormSize} formSize
 * @property {Function} [customSidepanelContent]
 * @property {Field[]} fields
 * @property {string} api
 * @property {string} objectKey
 */

/** @param {ModuleProps} */




export function DeliveriesModule(
  {
    name,
    singularName,
    formSize,
    customSidepanelContent,
    fields,
    api,
    objectKey,
    schedulefields,
    selectedRows,
    setSelectedRowsChange,
  }) {

  const onRowSelected = (data) => {
    console.log(data.selectedRows[0])
    console.log(data.selectedRows)

    const ids = [];
    const orderStatus = [];
    var dataStatus = [];
    var count = 0;


    data.selectedRows.map(({ id, status }, i) => {

      if (status == 'assigned') {

        swal("Oops!", "This Order is already assigned", "error");
      }
      else {
        ids.push({ '_id': id })
        setSelectedRowsChange(ids);
      }
      ;
      dataStatus = { 'id': id, 'status': status };
      orderStatus.push(dataStatus);
    }
    )

    setStatus(orderStatus);
    //  console.log(ids)
    return (ids);
  };

  const [ids, setIds] = useState([]);

  const [datafields, setDatafields] = useState([]);

  /* State for the module's data */
  const [data, setData] = useState([]);
  const [datastatus, setStatus] = useState([]);

  /* States for the usage of the AutoForm component. */
  const [record, setRecord] = useState({});
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [mocaShow, setMocaShow] = useState(false);
  const [unsignShow, setunsignShow] = useState(false);
  const [ScheduleIds, setScheduleIds] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const [orderDataList, setOrderDataList] = useState([]);
  const [dataLabelList, setDataLabelList] = useState([])
  const [seletedSchedId, setSeletedSchedId] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [trip, setTrip] = useState([])


  //compartment default cap
  const [compartmentOne, setCompartmentone] = useState("0");
  const [compartmentTwo, setCompartmenttwo] = useState("0");
  const [compartmentThree, setCompartmentthree] = useState("0");
  const [compartmentFour, setCompartmentfour] = useState("0");
  const [compartmentFive, setCompartmentfive] = useState("0");
  const [compartmentSix, setCompartmentsix] = useState("0");
  const [compartmentSeven, setCompartmentseven] = useState("0");
  const [compartmentEight, setCompartmenteight] = useState("0");
  const [compartmentNine, setCompartmentnine] = useState("0");
  const [compartmentTen, setCompartmentten] = useState("0");
  //remcap
  const [cOne, setCone] = useState("0");
  const [cTwo, setCtwo] = useState("0");
  const [cThree, setCthree] = useState("0");
  const [cFour, setCfour] = useState("0");
  const [cFive, setCfive] = useState("0");
  const [cSix, setCsix] = useState("0");
  const [cSeven, setCseven] = useState("0");
  const [cEight, setCeight] = useState("0");
  const [cNine, setCnine] = useState("0");
  const [cTen, setCten] = useState("0");
  const [cRow, setCrow] = useState();

  //rem cap
  const [rOne, setRone] = useState("0");
  const [rTwo, setRtwo] = useState("0");
  const [rThree, setRthree] = useState("0");
  const [rFour, setRfour] = useState("0");
  const [rFive, setRfive] = useState("0");
  const [rSix, setRsix] = useState("0");
  const [rSeven, setRseven] = useState("0");
  const [rEight, setReight] = useState("0");
  const [rNine, setRnine] = useState("0");
  const [rTen, setRten] = useState("0");

  const [lv, setLv] = useState("0");


  const [debouncedState, setDebouncedState] = useState("");
  const [collectNumbers, setCollectNumbers] = useState([])
  const [compartmentCap, setCompartmentCap] = useState({ "compartmentDetails": [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}] });

  const onSidepanelToggle = isOpened => {
    if (isOpened) {
      alert.closeAll();
      AutoFormControl.setErrors();
    }
  };
  const onAdd = (data) => {


    setRecord({}); /* Reset the record in the sidepanel. */
    setDatafields(fields);
    AutoFormControl.setTitle(`Add to Vehicle`);
    SidepanelControl.open();
  };
  const onRowClicked = (data) => {
    if (ScheduleIds.length > 1) {
      swal("Failed!", `Cannot add orders to multiple vechicles.`, "error");
      return false
    }
    const orders = {
      orders: selectedRows
    }

    let countTripOrder = 0

    swal({
      title: "Add order to existing Schedule?",
      text: "Save File!",
      icon: "info",
      buttons: {
        cancel: 'Cancel',
        confirm: { text: 'Save', className: 'sweet-warning', closeModal: false },
      },
      showCloseButton: true,
      dangerMode: true,
    })
      .then(async (willSave) => {
        if (willSave) {

          var count = 0;
          var tripCount = 1
          const orderStatus = {};
          const response = await apiService.get(`/deliveries/${ScheduleIds[0]}`);
          let trip = "";
          let drop = "";
          let id = "";
          let tripdrop = [];
          let idList = [];
          orders.vehicle = response.vehicle._id
          const responseVehicle = await apiService.get(`/deliveries`);


          var result = responseVehicle.filter(vehicle => vehicle.vehicle._id == response.vehicle._id);

          let getMaxTrip = 0;
          for (let filterDetail of result) {
            for (let tripDetail of filterDetail.tripDetails) {
              if (parseInt(tripDetail.trip) >= getMaxTrip) {
                getMaxTrip = parseInt(tripDetail.trip)
              }
            }



          }



          for (let tripDetail of response.tripDetails) {

            if (tripdrop.find(({ order }) => order == `${tripDetail.order._id}`)) {

            }
            else {
              // tripdrop.push({
              //    "trip": `${tripDetail.trip}`,
              //     "drop":`${tripDetail.drop}`,
              //     "order" : tripDetail.order._id
              //  })

            }
            idList.push(tripDetail.order._id)

          }
          let countTrip = response.tripDetails.length - 1

          let lastTripNumber = parseInt(response.tripDetails[countTrip].trip)
          let finaltripNumber = getMaxTrip + 1

          for (let orderId of record[0].ordersList[0]) {
            console.log('-------', orderId)
            if (orders['orders'].find(({ _id }) => _id == `${orderId._id}`)) {

            }
            else {
              //orders['orders'].push({ _id: orderId._id});
              orderStatus.status = "assigned";
              const apiRes = await apiService.put(`/orders/${orderId._id}`, orderStatus);
            }



            for (let orderId of selectedRows) {

              if (!idList.includes(orderId._id)) {
                if (tripdrop.find(({ order }) => order == `${orderId._id}`)) {

                }
                else {
                  orderStatus.status = "assigned";
                  const apiRes = await apiService.put(`/orders/${orderId._id}`, orderStatus);
                  tripdrop.push({
                    "trip": `${finaltripNumber}`,
                    "drop": `${tripCount}`,
                    "order": orderId._id
                  })
                  tripCount++;
                }


              }
            }


            count++
          }



          orders.tripDetails = tripdrop

          //const Resp = await apiService.put(`/deliveries/${ScheduleIds[0]}`, newTripDrop);
          //const apiResponse =  await apiService.put(`/deliveries/${ScheduleIds[0]}`, orders);
          const apiResponse = await apiService.post(`/deliveries`, orders);


          return apiResponse

        } else {

        }
      }).then((result) => {

        if (result) {
          swal("Success!", `Order has been added.`, "success");
          setInterval(() => window.location.reload(), 1000);
        }
        else {
          swal("Cancelled!");
        }



      });
    setDatafields(fields);

  };

  const onSchedRowSelected = (data) => {
    if (!data.selectedRows.length) {
      setunsignShow(false)
      return true
    }

    let oIds = [];
    let SchedID = [];
    setRecord(data.selectedRows)
    let dataList = [];
    let dataLabel = [];
    let trip = data.selectedRows[0]['trip']

    for (let order of data.selectedRows) {
      if (!SchedID.includes(order.id)) {
        SchedID.push(order.id)

      }

      let count = 0;


      for (let ordersData of order.ordersList[0]) {
        // if(!oIds.includes(ordersData.[count]._id))
        // {

        oIds.push(ordersData.order._id)
        dataList.push(ordersData._id)
        for (let tl of data.selectedRows[0].tripList[0]) {
          console.log("order", tl.order._id, ordersData._id)
          if (tl.trip == trip && tl.order._id == ordersData.order._id) {
            dataLabel.push(
              {
                "id": ordersData.order._id,
                "label": ordersData.customerDetails.customerName1,
                "trip": trip
              }
            )
          }
        }


        count++

      }

    }
    setSeletedSchedId(SchedID)

    setOrderList(oIds)
    setOrderDataList(dataList)
    setDataLabelList(dataLabel)

    const schedIds = [];
    const tripData = [];
    console.log("Selected Row", data.selectedRows)
    data.selectedRows.map(({ trip, vehicle, id }, i) => {

      schedIds.push(id);
      tripData.push({
        "trip": trip,
        "vehicle": vehicle
      })

    }
    )

    // data.selectedRows.map(({ id}, i) => {

    //   schedIds.push(id);

    //   }
    // )

    setScheduleIds(schedIds);
    setTrip(tripData)
    if (schedIds.length === 0) {
      setunsignShow(false);
    }
    else {

      if (data.selectedRows[0].status == "assigned") {
        setunsignShow(true);
      }

    }




    return true;
  };

  const submit = async (record, id) => {
    var moca = false;
    swal("A wild Pikachu appeared! What do you want to do?", {
      buttons: {
        yes: {
          text: "Yes",
          value: "yes",
        },
        no: {
          text: "No",
          value: "no",
        },
      },
    })
      .then((value) => {
        if (value == 'yes') {
          moca = "yes"
        }
        else {
          moca = "no"
        }
      });




    //setIsLoading(true)
    for (const field of fields) {
      /* Set the default values for fields that have default values. */
      if (field.default !== undefined) {
        record[field.name] = field.default;
      }

      /* Remove the fields that are not to be sent in the API. */
      if (field.noAPI) {
        delete record[field.name];
      }
    }

    const newData = [...data];
    record.orders = selectedRows;
    record.status = "assigned";
    const orderStatus = {};

    let tripDetail = []
    let count = 1;
    for (let orderId of record.orders) {
      orderStatus.status = "assigned";
      const apiRes = await apiService.put(`/orders/${orderId._id}`, orderStatus);

      tripDetail.push({
        "trip": "1",
        "drop": `${count}`,
        "order": orderId._id
      })
      count++
    }

    record.tripDetails = tripDetail


    const apiResponse = await apiService.post(`/deliveries`, record);
    if (moca == 'yes') {
      const result = await apiService.post(`/deliveryCompartment/${apiResponse.id}`, {
        "vehicle": apiResponse.vehicle.id
      });
      console.log('result---', result);
    }

    //newData.push(apiResponse);
    swal("Success!", `${selectedRows.length > 1 ? `${name} have` : `${singularName} has`} been assigned.`, "success");
    setInterval(() => window.location.reload(), 1000);
    return true;

    setData(newData);
    SidepanelControl.close();
  };

  const onSchedConfirm = async (data) => {
    setIsLoading(true)

    const response = await apiService.get(`/deliveries`);

    let tripD = [];
    for (let vehicle of response) {
      if (ScheduleIds[0] != vehicle.id) {
        if (vehicle.vehicle.displayName == trip[0].vehicle) {

          for (let tripData of vehicle.tripDetails) {
            if (tripData.trip > trip[0].trip) {

              tripD.push({
                "trip": `${tripData.trip - 1}`,
                "drop": `${tripData.drop}`,
                "order": `${tripData.order._id}`
              })
            }

            else {
              tripD.push({
                "trip": `${tripData.trip}`,
                "drop": `${tripData.drop}`,
                "order": `${tripData.order._id}`
              })
            }

          }
          console.log("trip", tripD, "--", vehicle.id)
          let trip_data = {
            "tripDetails": tripD
          };
          const apiRes = await apiService.put(`/deliveries/${vehicle.id}`, trip_data);
          console.log("api", `/deliveries/${vehicle.id}`, trip_data)

        }



      }

    }

    for (let ids of ScheduleIds) {
      const apiResponse = await apiService.delete(`${api}`, ids);

    }

    let orderStatus = {};
    for (let orderId of orderList) {
      orderStatus.status = "open";
      const apiRes = await apiService.put(`/orders/${orderId}`, orderStatus);

    }
    // if(!apiResponse.success) {
    //   return alert.error(apiResponse.message || `Cannot Unassign ${singularName}. An error occurred.`);
    // }

    setSmShow(false);




    swal("Success!", `Schedule Deliveries has been saved.`, "success");
    setIsLoading(false)
    setInterval(() => window.location.reload(), 1000);

    return true;



    // setData(newData);
    //setSelectedRows([]);
  };
  const arrayMoveMutate = (array, from, to) => {
    array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  };

  const arrayMove = (array, from, to) => {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return array;
  };

  //Drag handler
  const DragHandle = sortableHandle(() => (
    <span className="dragHandler">
      <i className="fa fa-arrow-up mr-1"></i>
      <i className="fa fa-arrow-down mr-1"></i>
    </span>
  ));

  //Draggable elements
  const SortableItem = sortableElement(({ value }) => (
    <div className="dragElement">
      {dataLabelList.map(({ id, label, trip }, index) => (
        value == id ? `Drop ${index + 1} - ${label}` : ""

      ))}
      <DragHandle />
    </div>
  ));

  //Drag area
  const SortableContainer = sortableContainer(({ children }) => {
    return <div className="dragContainer">{children}</div>;
  });

  const onSortEnd = ({ oldIndex, newIndex }) => {

    const items = arrayMove(dataLabelList, oldIndex, newIndex)

    setDataLabelList(items)

  };

  const SortableItems = () => {
    const dragList = <SortableContainer onSortEnd={onSortEnd} useDragHandle>
      {dataLabelList.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value.id} />

      ))}
    </SortableContainer>

    return <div className="p-2 pl-3">{dragList}</div>;
  }


  const onDropChange = async () => {
    setIsLoading(true)
    let scheduleID = seletedSchedId[0];
    const reOrderedIds = [];
    const ID = []

    const response = await apiService.get(`/deliveries/${ScheduleIds[0]}`);
    let trip = "";
    let drop = "";
    let id = "";
    let tripdrop = [];
    let idList = [];
    let countTripOrder = 0
    let countLoop = 1
    for (let list of dataLabelList) {
      tripdrop.push({
        "trip": `${list.trip}`,
        "drop": `${countLoop}`,
        "order": list.id
      })
      countLoop++
    }

    for (let tripDetail of response.tripDetails) {


      if (tripdrop.find(({ order }) => order == `${tripDetail.order._id}`)) {

      }
      else {
        tripdrop.push({
          "trip": `${tripDetail.trip}`,
          "drop": `${tripDetail.drop}`,
          "order": tripDetail.order._id
        })

      }


    }


    const tripDrop = {
      "tripDetails": tripdrop
    };
    const apiRes = await apiService.put(`/deliveries/${ScheduleIds[0]}`, tripDrop);

    if (apiRes) {
      swal("Success!", `Drop successfully updated!`, "success");
      setInterval(() => window.location.reload(), 1000);
      setIsLoading(false)
      return true;
    }
  }
  useEffect(() => {
    async function getData() {

      const apiResponse = await apiService.get(api);
      setData(apiResponse);
    }
    getData();
  }, [api, name]);

  const ordersData = () => {
    const orders = [];
    let totalVol = 0;

    for (let order of data) {
      //loop through products
      const { products } = order;

      let orderInfo = {};
      let customerName = '';
      let vehicleName = '';
      let contractorName = '';
      let totalCapacity = '';
      let v = '';
      if (order.hasOwnProperty('vehicle')) {
        const { vehicle } = order;

        if (vehicle !== null) {
          v = vehicle;
          console.log("-------", v)
          if (vehicle.hasOwnProperty('displayName')) {
            vehicleName = vehicle.displayName;
            totalCapacity = vehicle.totalCapacity;

          } else {
            vehicleName = 'no data';
          }

          if (vehicle.hasOwnProperty('contractorDetails')) {
            contractorName = vehicle.contractorDetails.contractorName;
          }
          else {
            contractorName = 'no data';
          }


        } else {
          vehicleName = 'no data';
          contractorName = 'no data';
        }
      } else {
        vehicleName = 'no data';
        contractorName = 'no data';
      }
      let countOrderKey = 1;
      let ordersList = [order.tripDetails];
      let tripList = [order.tripDetails];
      let contractor = order.hasOwnProperty('vehicle') ? "" : "";
      let getIndex = 0;


      // for(let tripDetail of order.tripDetails )
      //     {

      //           orderInfo = {
      //         "id": order.id,
      //        "hauler": contractor,
      //         "status": order.status,
      //         "orderId": order.id,
      //         "vehicle": vehicleName,
      //         "totalCapacity": totalCapacity ,
      //         "trip": tripDetail.trip,
      //         "drop": tripDetail.drop,
      //         "date": moment(tripDetail.order.createdAt).format('MMMM D, YYYY'),
      //         "customer":  tripDetail.order.hasOwnProperty('customerDetails') ? tripDetail.order.customerDetails.customerName1 : '---' ,
      //         "address":  tripDetail.order.hasOwnProperty('customerDetails') ? (tripDetail.order.customerDetails.customerName1 != null ? tripDetail.order.customerDetails.street + " " + tripDetail.order.customerDetails.city : '') : '---' ,
      //         "ordersList" : ordersList,
      //       };
      //        orders.push(orderInfo);
      //     }


      for (let ordersData of order.tripDetails) {
        let trip = ordersData.trip;
        let drop = ordersData.drop;

        console.log("inner orderdata", ordersData)
        let countIndex = 0;


        for (let prod of ordersData.order.productDetails) {
          totalVol += parseInt(prod.volume);
        }

        orderInfo = {
          "vehicleData": v,
          "id": order.id,
          "hauler": contractor,
          "status": order.status,
          "orderId": order.id,
          "hauler": contractorName,
          "shipmentNo": ordersData.order.shipmentId,
          "ld": Math.round(totalVol / totalCapacity),
          "deliveryNo": order.deliveryNo,
          "vehicle": vehicleName,
          "totalCapacity": totalCapacity,
          "trip": trip,
          "drop": drop,
          "date": moment(ordersData.createdAt).format('MMMM D, YYYY'),
          "customer": ordersData.hasOwnProperty('customerDetails') ? ordersData.customerDetails.customerName1 : '---',
          "address": ordersData.hasOwnProperty('customerDetails') ? (ordersData.customerDetails.customerName1 != null ? ordersData.customerDetails.street + " " + ordersData.customerDetails.city : '') : '---',
          "ordersList": ordersList,
          "tripList": tripList,
          "logInTime": moment(ordersData.logInTime).format('LLL'),
          "timeFinishedLoading": moment(ordersData.timeFinishedLoading).format('LLL'),
          "timeLeftDepot": moment(ordersData.timeLeftDepot).format('LLL'),
          "timeArrivedAtCustomer": moment(ordersData.timeArrivedAtCustomer).format('LLL'),
          "timeDepartedFromCustomer": moment(ordersData.timeDepartedFromCustomer).format('LLL'),
          "timeReturnToDepot": moment(ordersData.timeReturnToDepot).format('LLL'),

        };
        orders.push(orderInfo);

        console.log("inner orderdata", orders)
        countOrderKey++
        getIndex++
      }
      //count++



    }


    return orders;
  };

  const style = {
    width: '67%',
    float: 'right',
  }
  const moca = () => {
    if (!record)
      return true
    let key = localStorage.getItem('bG9naW4=')
    let customer = localStorage.getItem('customer')
    let sData = localStorage.getItem('selectedData')
    let userId = localStorage.getItem('userId')
    let contractor = localStorage.getItem('contractor')
    let l = localStorage.getItem('length')
    localStorage.clear();
    localStorage.setItem('bG9naW4=', key)
    localStorage.setItem('customer', customer)
    localStorage.setItem('selectedData', sData)
    localStorage.setItem('userId', userId)
    localStorage.setItem('contractor', contractor)
    localStorage.setItem('length', l)

    console.log("test 1", record)
    setMocaShow(true);


  }

  const mathOp = (val1, val2, opt) => {

    let result = (opt == "+" ? val1 + val2 : (opt == "-" ? val1 - val2 : (opt == "*" ? val1 * val2 : (opt == "/" ? val1 / val2 : ""))))
    return result;
  }



  const MocaModal = ({ data }) => {
    if (!record)
      return true
    let items = [];

    let seq = '';
    let c = 0;
    let collectAllRow = [];
    let compartmentCapacity1 = 0;
    let compartmentCapacity2 = 0;
    let compartmentCapacity3 = 0;
    let compartmentCapacity4 = 0;
    let compartmentCapacity5 = 0;
    let compartmentCapacity6 = 0;
    let compartmentCapacity7 = 0;
    let compartmentCapacity8 = 0;
    let compartmentCapacity9 = 0;
    let compartmentCapacity10 = 0;
    for (let order of record[0].tripList) {

      for (let product of order[0].order.productDetails) {
        let count = c;

        compartmentCapacity1 = record[0].vehicleData.hasOwnProperty('compartmentCapacity1') ? record[0].vehicleData.compartmentCapacity1 : 0
        compartmentCapacity2 = record[0].vehicleData.hasOwnProperty('compartmentCapacity2') ? record[0].vehicleData.compartmentCapacity2 : 0
        compartmentCapacity3 = record[0].vehicleData.hasOwnProperty('compartmentCapacity3') ? record[0].vehicleData.compartmentCapacity3 : 0
        compartmentCapacity4 = record[0].vehicleData.hasOwnProperty('compartmentCapacity4') ? record[0].vehicleData.compartmentCapacity4 : 0
        compartmentCapacity5 = record[0].vehicleData.hasOwnProperty('compartmentCapacity5') ? record[0].vehicleData.compartmentCapacity5 : 0
        compartmentCapacity6 = record[0].vehicleData.hasOwnProperty('compartmentCapacity6') ? record[0].vehicleData.compartmentCapacity6 : 0
        compartmentCapacity7 = record[0].vehicleData.hasOwnProperty('compartmentCapacity7') ? record[0].vehicleData.compartmentCapacity7 : 0
        compartmentCapacity8 = record[0].vehicleData.hasOwnProperty('compartmentCapacity8') ? record[0].vehicleData.compartmentCapacity8 : 0
        compartmentCapacity9 = record[0].vehicleData.hasOwnProperty('compartmentCapacity9') ? record[0].vehicleData.compartmentCapacity9 : 0
        compartmentCapacity10 = record[0].vehicleData.hasOwnProperty('compartmentCapacity10') ? record[0].vehicleData.compartmentCapacity10 : 0


        let c1 = `row${count}cap1`
        let c2 = `row${count}cap2`
        let c3 = `row${count}cap3`
        let c4 = `row${count}cap4`
        let c5 = `row${count}cap5`
        let c6 = `row${count}cap6`
        let c7 = `row${count}cap7`
        let c8 = `row${count}cap8`
        let c9 = `row${count}cap9`
        let c10 = `row${count}cap10`
        let vol = `row${count}vol`
        let setVol = `setRow${count}vol`
        let orderID = order[0].order.orderId
        let prodShortDesc = product.product.shortDescription
        let drop = order.drop

        let manualMoca = {
          "order": order[0].order.id,
          "productShortDescription": product.product.shortDescription,
          "orderVolume": 0,
          "drop": order[0].drop
        }

        items.push(<tr>
          <td></td>
          <td>{order[0].order.orderId}</td>
          <td>{order[0].customerDetails.customerName1}</td>
          <td></td>
          <td></td>
          <td><div id={vol}> </div>{product.volume}</td>
          <td>{product.product.productDescription}</td>
          <td>{localStorage.getItem(vol)}</td>



          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c1] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity1, product.volume, vol, manualMoca)} className="form-control" id="cap1" name={c1} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity1') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c2] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity2, product.volume, vol, manualMoca)} className="form-control" id="cap2" name={c2} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity2') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c3] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity3, product.volume, vol, manualMoca)} className="form-control" id="cap3" name={c3} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity3') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c4] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity4, product.volume, vol, manualMoca)} className="form-control" id="cap4" name={c4} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity4') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c5] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity5, product.volume, vol, manualMoca)} className="form-control" id="cap5" name={c5} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity5') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c6] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity6, product.volume, vol), manualMoca} className="form-control" id="cap6" name={c6} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity6') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c7] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity7, product.volume, vol, manualMoca)} className="form-control" id="cap7" name={c7} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity7') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c8] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity8, product.volume, vol, manualMoca)} className="form-control" id="cap8" name={c8} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity8') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c9] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity9, product.volume, vol, manualMoca)} className="form-control" id="cap9" name={c9} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity9') ? false : true} /></td>
          <td><input defaultValue={collectNumbers.length > 0 ? collectNumbers[count][c10] : ""} onChange={e => handleCellChange(e.target.value, count, e.target.name, e.target.id, compartmentCapacity10, product.volume, vol, manualMoca)} className="form-control" id="cap10" name={c10} type="number" disabled={record[0].vehicleData.hasOwnProperty('compartmentCapacity10') ? false : true} /></td>
        </tr>)


        let rowData = {}
        rowData[c1] = "";
        rowData[c2] = "";
        rowData[c3] = "";
        rowData[c4] = "";
        rowData[c5] = "";
        rowData[c6] = "";
        rowData[c7] = "";
        rowData[c8] = "";
        rowData[c9] = "";
        rowData[c10] = "";
        collectAllRow.push(rowData)

        c++;

      }

      setCrow(c);
    }
    let lvData = parseInt(cOne) + parseInt(cTwo) + parseInt(cThree) + parseInt(cFour) + parseInt(cFive) + parseInt(cSix) + parseInt(cSeven) + parseInt(cEight) + parseInt(cNine) + parseInt(cTen)
    setLv(lvData)
    let fv = record[0].vehicleData.hasOwnProperty('deadFreightVol') ? parseInt(record[0].vehicleData.deadFreightVol) : 0
    let actualUtil = ((lv / fv) * 100).toFixed(2)
    localStorage.setItem('collectionNumber', JSON.stringify(collectAllRow));
    const expandFields = <>
      <div className="row">
        <div className="col-5">
          <div className="row justify-content-center">
            <div className="col-5">
              <table className="table table-striped table-bordered table-hover">
                <tbody>
                  <tr>
                    <td>Date</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Tractor</td>
                    <td>{record[0].vehicleData.hasOwnProperty('tractorPlate') ? record[0].vehicleData.tractorPlate : ""}</td>
                  </tr>
                  <tr>
                    <td>Trailer</td>
                    <td>{record[0].vehicleData.hasOwnProperty('trailerPlate') ? record[0].vehicleData.trailerPlate : ""}</td>
                  </tr>
                  <tr>
                    <td>Total Capacity</td>
                    <td>{record[0].vehicleData.hasOwnProperty('deadFreightVol') ? record[0].vehicleData.deadFreightVol : ""}</td>
                  </tr>
                  <tr>
                    <td>Loaded Volume</td>
                    <td>{lv}</td>
                  </tr>
                  <tr>
                    <td>Target Util</td>
                    <td>100%</td>
                  </tr>
                  <tr>
                    <td>Actual Util</td>
                    <td>{actualUtil}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-7">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Trailer</th>
                <th>Compt Cap 1</th>
                <th>Comp Cap 2</th>
                <th>Comp Cap 3</th>
                <th>Comp Cap 4</th>
                <th>Comp Cap 5</th>
                <th>Comp Cap 6</th>
                <th>Comp Cap 7</th>
                <th>Comp Cap 8</th>
                <th>Comp Cap 9</th>
                <th>Compa Cap 10</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Capacity</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity1') ? record[0].vehicleData.compartmentCapacity1 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity2') ? record[0].vehicleData.compartmentCapacity2 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity3') ? record[0].vehicleData.compartmentCapacity3 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity4') ? record[0].vehicleData.compartmentCapacity4 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity5') ? record[0].vehicleData.compartmentCapacity5 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity6') ? record[0].vehicleData.compartmentCapacity6 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity7') ? record[0].vehicleData.compartmentCapacity7 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity8') ? record[0].vehicleData.compartmentCapacity8 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity9') ? record[0].vehicleData.compartmentCapacity9 : ""}</td>
                <td>{record[0].vehicleData.hasOwnProperty('compartmentCapacity10') ? record[0].vehicleData.compartmentCapacity10 : ""}</td>
              </tr>
              <tr>
                <td>Part Fill</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
                <td>n</td>
              </tr>
              <tr>
                <td>Must Use </td>
                <td>y</td>
                <td>y</td>
                <td>y</td>
                <td>y</td>
                <td>y</td>
                <td>y</td>
                <td>y</td>
                <td>n</td>
                <td>n</td>
                <td>y</td>
              </tr>
              <tr>
                <td>Current Vol.</td>
                <td>{cOne}</td>
                <td>{cTwo}</td>
                <td>{cThree}</td>
                <td>{cFour}</td>
                <td>{cFive}</td>
                <td>{cSix}</td>
                <td>{cSeven}</td>
                <td>{cEight}</td>
                <td>{cNine}</td>
                <td>{cTen}</td>
              </tr>
              <tr>
                <td>Rem Cap</td>
                <td>{rOne == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity1') ? record[0].vehicleData.compartmentCapacity1 : 0 : rOne}</td>
                <td>{rTwo == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity2') ? record[0].vehicleData.compartmentCapacity2 : 0 : rTwo}</td>
                <td>{rThree == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity3') ? record[0].vehicleData.compartmentCapacity3 : 0 : rThree}</td>
                <td>{rFour == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity4') ? record[0].vehicleData.compartmentCapacity4 : 0 : rFour}</td>
                <td>{rFive == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity5') ? record[0].vehicleData.compartmentCapacity5 : 0 : rFive}</td>
                <td>{rSix == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity6') ? record[0].vehicleData.compartmentCapacity6 : 0 : rSix}</td>
                <td>{rSeven == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity7') ? record[0].vehicleData.compartmentCapacity7 : 0 : rSeven}</td>
                <td>{rEight == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity8') ? record[0].vehicleData.compartmentCapacity8 : 0 : rEight}</td>
                <td>{rNine == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity9') ? record[0].vehicleData.compartmentCapacity9 : 0 : rNine}</td>
                <td>{rTen == 0 ? record[0].vehicleData.hasOwnProperty('compartmentCapacity10') ? record[0].vehicleData.compartmentCapacity10 : 0 : rTen}</td>

              </tr>
              <tr>
                <td>% Util</td>
                <td>{cOne == 0 ? "0" : ((cOne / parseInt(record[0].vehicleData.compartmentCapacity1)) * 100).toFixed(2)}%</td>
                <td>{cTwo == 0 ? "0" : ((cTwo / parseInt(record[0].vehicleData.compartmentCapacity2)) * 100).toFixed(2)}%</td>
                <td>{cThree == 0 ? "0" : ((cThree / parseInt(record[0].vehicleData.compartmentCapacity3)) * 100).toFixed(2)}%</td>
                <td>{cFour == 0 ? "0" : ((cFour / parseInt(record[0].vehicleData.compartmentCapacity4)) * 100).toFixed(2)}%</td>
                <td>{cFive == 0 ? "0" : ((cFive / parseInt(record[0].vehicleData.compartmentCapacity5)) * 100).toFixed(2)}%</td>
                <td>{cSix == 0 ? "0" : ((cSix / parseInt(record[0].vehicleData.compartmentCapacity6)) * 100).toFixed(2)}%</td>
                <td>{cSeven == 0 ? "0" : ((cSeven / parseInt(record[0].vehicleData.compartmentCapacity7)) * 100).toFixed(2)}%</td>
                <td>{cEight == 0 ? "0" : ((cEight / parseInt(record[0].vehicleData.compartmentCapacity8)) * 100).toFixed(2)}%</td>
                <td>{cNine == 0 ? "0" : ((cNine / parseInt(record[0].vehicleData.compartmentCapacity9)) * 100).toFixed(2)}%</td>
                <td>{cTen == 0 ? "0" : ((cTen / parseInt(record[0].vehicleData.compartmentCapacity10)) * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>Seq</th>
                <th>Ord No</th>
                <th>Customer</th>
                <th>Line</th>
                <th>LI</th>
                <th>Volume</th>
                <th>Product</th>
                <th>Rem Vol</th>
                <th colSpan="10" width="53%"></th>
              </tr>
            </thead>
            <tbody>
              {items}
            </tbody>
          </table>
        </div>
      </div>
    </>


    return <div className="">{expandFields}</div>;
  }
  const debounce = useCallback(
    _.debounce((_val, name, compartment) => {
      // setDebouncedState(_searchVal);
      if (name == "collection") {

        setCollectNumbers(_val);
      }

      if (name == "compartment") {

        setCompartmentCap(_val);

        console.log("manualMoca____", compartmentCap);

      }

      if (name == "cap1") {
        setCone(_val);
        let cOneValue = parseInt(compartment) - parseInt(localStorage.getItem('cOne'))
        setRone(cOneValue)
      }
      if (name == "cap2") {
        setCtwo(_val);
        let cTwoValue = parseInt(compartment) - parseInt(localStorage.getItem('cTwo'))
        setRtwo(cTwoValue)
      }
      if (name == "cap3") {
        setCthree(_val);
        let cThreeValue = parseInt(compartment) - parseInt(localStorage.getItem('cThree'))
        setRthree(cThreeValue)
      }
      if (name == "cap4") {
        setCfour(_val);
        let cFourValue = parseInt(compartment) - parseInt(localStorage.getItem('cFour'))
        setRfour(cFourValue)
      }
      if (name == "cap5") {
        setCfive(_val);
        let cFiveValue = parseInt(compartment) - parseInt(localStorage.getItem('cFive'))
        setRfive(cFiveValue)
      }
      if (name == "cap6") {
        setCsix(_val);
        let cSixValue = parseInt(compartment) - parseInt(localStorage.getItem('cSix'))
        setRsix(cSixValue)
      }
      if (name == "cap7") {
        setCseven(_val);
        let cSevenValue = parseInt(compartment) - parseInt(localStorage.getItem('cSeven'))
        setRseven(cSevenValue)
      }
      if (name == "cap8") {
        setCeight(_val);
        let cEightValue = parseInt(compartment) - parseInt(localStorage.getItem('cEight'))
        setReight(cEightValue)
      }
      if (name == "cap9") {
        setCnine(_val);
        let cNineValue = parseInt(compartment) - parseInt(localStorage.getItem('cNine'))
        setRnine(cNineValue)
      }
      if (name == "cap10") {
        setCten(_val);
        let cTenValue = parseInt(compartment) - parseInt(localStorage.getItem('cTen'))
        setRten(cTenValue)
      }

      // send the server request here		
    }, 1000),
    []
  );

  const handleCellChange = (v, i, n, cap, compartment, vol, rem, manualMoca) => {


    const modData = JSON.parse(localStorage.getItem('collectionNumber'));

    if (collectNumbers.length === 0) {
      setCollectNumbers(modData);
    }
    if (collectNumbers.length > 0) {
      const numberData = collectNumbers[i][n] = v;
      debounce(collectNumbers, "collection");
      console.log("t", i)
      let r1 = collectNumbers[i][`row${i}cap1`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap1`]);
      let r2 = collectNumbers[i][`row${i}cap2`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap2`]);
      let r3 = collectNumbers[i][`row${i}cap3`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap3`]);
      let r4 = collectNumbers[i][`row${i}cap4`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap4`]);
      let r5 = collectNumbers[i][`row${i}cap5`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap5`]);
      let r6 = collectNumbers[i][`row${i}cap6`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap6`]);
      let r7 = collectNumbers[i][`row${i}cap7`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap7`]);
      let r8 = collectNumbers[i][`row${i}cap8`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap8`]);
      let r9 = collectNumbers[i][`row${i}cap9`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap9`]);
      let r10 = collectNumbers[i][`row${i}cap10`] == "" ? 0 : parseInt(collectNumbers[i][`row${i}cap10`]);


      let cap1RemVol = r1 + r2 + r3 + r4 + r5 + r6 + r7 + r8 + r9 + r10
      let remVol = parseInt(vol) - cap1RemVol;
      localStorage.setItem(rem, remVol)
    }


    if (cap == "cap1") {
      let totalCap1 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][0] = manualMoca;
      debounce(compartmentCap, "compartment");


      for (let cap1 of collectNumbers) {

        let capData = 0
        let remvol = 0
        if (cap1[`row${count}cap1`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap1[`row${count}cap1`])
        }
        totalCap1 = totalCap1 + capData
        count++

      }
      localStorage.setItem('cOne', totalCap1)
      debounce(totalCap1, "cap1", compartment);

    }
    if (cap == "cap2") {
      let capData = 0
      let totalCap2 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][1] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap2 of collectNumbers) {
        if (cap2[`row${count}cap2`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap2[`row${count}cap2`])
        }
        totalCap2 = totalCap2 + capData
        count++

      }

      localStorage.setItem('cTwo', totalCap2)
      debounce(totalCap2, "cap2", compartment);

    }
    if (cap == "cap3") {
      let capData = 0
      let totalCap3 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][2] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap3 of collectNumbers) {
        if (cap3[`row${count}cap3`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap3[`row${count}cap3`])
        }
        totalCap3 = totalCap3 + capData
        count++

      }

      localStorage.setItem('cThree', totalCap3)
      debounce(totalCap3, "cap3", compartment);

    }
    if (cap == "cap4") {
      let capData = 0
      let totalCap4 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][3] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap4 of collectNumbers) {
        if (cap4[`row${count}cap4`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap4[`row${count}cap4`])
        }
        totalCap4 = totalCap4 + capData
        count++

      }

      localStorage.setItem('cFour', totalCap4)
      debounce(totalCap4, "cap4", compartment);

    }
    if (cap == "cap5") {
      let capData = 0
      let totalCap5 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][4] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap5 of collectNumbers) {
        if (cap5[`row${count}cap5`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap5[`row${count}cap5`])
        }
        totalCap5 = totalCap5 + capData
        count++

      }

      localStorage.setItem('cFive', totalCap5)
      debounce(totalCap5, "cap5", compartment);

    }
    if (cap == "cap6") {
      let capData = 0
      let totalCap6 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][5] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap6 of collectNumbers) {
        if (cap6[`row${count}cap6`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap6[`row${count}cap6`])
        }
        totalCap6 = totalCap6 + capData
        count++

      }

      localStorage.setItem('cSix', totalCap6)
      debounce(totalCap6, "cap6", compartment);

    }
    if (cap == "cap7") {
      let capData = 0
      let totalCap7 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][6] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap7 of collectNumbers) {
        if (cap7[`row${count}cap7`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap7[`row${count}cap7`])
        }
        totalCap7 = totalCap7 + capData
        count++

      }

      localStorage.setItem('cSeven', totalCap7)
      debounce(totalCap7, "cap7", compartment);

    }
    if (cap == "cap8") {
      let capData = 0
      let totalCap8 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][7] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap8 of collectNumbers) {
        if (cap8[`row${count}cap8`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap8[`row${count}cap8`])
        }
        totalCap8 = totalCap8 + capData
        count++

      }

      localStorage.setItem('cEight', totalCap8)
      debounce(totalCap8, "cap8", compartment);

    }
    if (cap == "cap9") {
      let capData = 0
      let totalCap9 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][8] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap9 of collectNumbers) {
        if (cap9[`row${count}cap9`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap9[`row${count}cap9`])
        }
        totalCap9 = totalCap9 + capData
        count++

      }

      localStorage.setItem('cNine', totalCap9)
      debounce(totalCap9, "cap9", compartment);

    }
    if (cap == "cap10") {
      let capData = 0
      let totalCap10 = 0;
      let count = 0;
      manualMoca['orderVolume'] = v;

      compartmentCap['compartmentDetails'][9] = manualMoca;
      debounce(compartmentCap, "compartment");
      for (let cap10 of collectNumbers) {
        if (cap10[`row${count}cap10`] == "") {
          capData = 0
        }
        else {
          capData = parseInt(cap10[`row${count}cap10`])
        }
        totalCap10 = totalCap10 + capData
        count++

      }

      localStorage.setItem('cTen', totalCap10)
      debounce(totalCap10, "cap10", compartment);

    }


  }

  const save = async () => {
    setIsLoading(true)
    const apiRes = await apiService.post(`/manualDeliveryCompartment/${record[0].id}`, compartmentCap);
    if (apiRes) {
      swal("Success!", `MOCA has been saved.`, "success");
      setIsLoading(false)
      setInterval(() => window.location.reload(), 1000);
      return true
    }
    else {
      swal("Falied!", `Failed to save MOCA.`, "error");
      setIsLoading(false)
      setInterval(() => window.location.reload(), 1000);
      return true
      return false
    }
    console.log("record====", apiRes)

  }
  return (

    <>
      <div className="datatable-header d-flex align-items-center justify-content-between w-100">
        <div>

          <button className="btn btn-sm btn-primary btn-add mx-1"
            onClick={onAdd}>
            <i className="fa fa-plus mr-1"></i> Add
          </button>
          <button className="btn btn-sm btn-primary mx-1"
            disabled={unsignShow === false}
            // hidden={unsignShow === false}
            onClick={() => onRowClicked()}
          >
            <i className="fa fa-tasks mr-1"></i> Assign
          </button>

          <button className="btn btn-sm btn-primary mx-1"
            disabled={unsignShow === false}
            onClick={() => setSmShow(true)}
          >
            <i className="fa fa-minus mr-1"></i> Deassign
          </button>

          <button className="btn btn-sm btn-primary mx-1"
            disabled={unsignShow === false}
            onClick={() => setLgShow(true)}
          >
            <i className="fa fa-edit mr-1"></i> Update Drop
          </button>


          <button className="btn btn-sm btn-primary mx-1"
            disabled={unsignShow === false}
            // hidden={unsignShow === false}
            onClick={() => moca()}
          >
            <i className="fa fa-unlink mr-1"></i> MOCA
          </button>
        </div>
        <DatatableSplitScreenSearch className="search" onSearch={search => DatatableCustomControl.setSearch(search)} />
      </div>


      <Modal
        dialogClassName="modal-90w"
        show={mocaShow}
        onHide={() => setMocaShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Moca
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {record.length > 0 ? <MocaModal /> : ""}

        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" type="button" onClick={() => {
            save();

          }}>
            {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-save mr-1"></i> Save </>}
          </button>
          <button className="btn btn-default" type="button" onClick={() => {
            setMocaShow(false);
          }}>
            <i className="fa fa-times mr-1"></i> Close
          </button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Deassign
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {seletedSchedId.length > 1 ? "Cannot porcess multiple vechicles" : "Are you sure you want to Deassign?"}

        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" type="button" onClick={() => {

            setSmShow(false);
          }}>
            <i className="fa fa-times mr-1"></i> Close
          </button>
          {seletedSchedId.length > 1 ? "" :
            <button className="btn btn-warning" disabled={isLoading} type="button" onClick={() => {
              onSchedConfirm();

            }}>

              {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-check mr-1"></i> Confirm </>}
            </button>}
        </Modal.Footer>
      </Modal>


      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Change Drop Schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>

            <div className="container">
              <div className="row">
                <div className="col-12">
                  {seletedSchedId.length > 1 ? "Cannot Change Drop" : <SortableItems />}
                </div>

              </div>
            </div>
          </>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-default" type="button" onClick={() => {

            setLgShow(false);
          }}>
            <i className="fa fa-times mr-1"></i> Close
          </button>
          {seletedSchedId.length > 1 ? "" :
            <button className="btn btn-warning" disabled={isLoading} type="button" onClick={() => {
              onDropChange();

            }}>

              {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-check mr-1"></i> Confirm </>}
            </button>
          }
        </Modal.Footer>
      </Modal>
      <Sidepanel widthPercentage={formSize} onToggle={onSidepanelToggle}>
        <AutoForm
          fields={datafields}
          data={record}
          onCancel={() => SidepanelControl.close()}
          onSubmit={submit}
          selectedRows={selectedRows}
          isLoading={isLoading}
        />
      </Sidepanel>


      {data.length !== 0
        ? <DeliveriesDatatable
          fields={fields}
          data={ordersData()}
          onRowSelected={onSchedRowSelected}
          onSchedRowSelected={onSchedRowSelected}
          onRowClicked={onRowClicked}
          objectKey={objectKey}
        />
        : <p className="text-center"></p>
      }

    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default DeliveriesModule;
