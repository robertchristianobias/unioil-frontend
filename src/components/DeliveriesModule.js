import React, { useState, useEffect, useCallback } from 'react';

import './css/Module.css';
import classes from './DeliveriesModule.module.css';
import Divider from '@material-ui/core/Divider';
import { DeliveriesDatatable, DatatableCustomControl } from 'components/DeliveriesDatatable';
//import { CustomScheduleDatatable,DatatableCustomControl } from 'components/CustomScheduleDatatable';
// import { useDatatableSelection } from 'components/hooks/useDatatableSelection';

import Modal from 'react-bootstrap/Modal';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';
import MocaModal from './MocaModal/MocaModal';

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
  const [mocaClear, setMocaClear] = useState(false);
  const [mocaAuto, setMocaAuto] = useState(false);

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

  const [compartmentCap, setCompartmentCap] = useState();

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

      console.log('API', api);
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
      return false
    }
    console.log("record====", apiRes)

  }
  return (
    <>
      <div className={`datatable-header d-flex align-items-center justify-content-between w-100 ${classes.dataTableHeader}`}>
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

          {record.length > 0 &&
            <MocaModal
              record={record}
              mocaClear={mocaClear}
              setMocaClear={setMocaClear}
              mocaAuto={mocaAuto}
              setMocaAuto={setMocaAuto}
              setCompartmentCap={setCompartmentCap}
            />
          }

        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => setMocaClear(true)}
          >
            <i class="fa fa-eraser"></i> Clear All
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setMocaAuto(true)}
          >
            <i class="fa fa-link"></i> Moca All
          </button>
          <Divider orientation="vertical" flexItem classes={{ root: classes.divider }} />
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              save();
            }}
            disabled={!compartmentCap}
          >
            {isLoading ? <><i class="fa fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-save mr-1"></i> Save </>}
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
