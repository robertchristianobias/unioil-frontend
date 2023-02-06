import React, { useState, useEffect } from 'react';

import './css/Module.css';

import { Datatable } from 'components/Datatable';
import { CustomDatatable, DatatableControl } from 'components/CustomDatatable';
import { CustomScheduleDatatable,DatatableCustomControl } from 'components/CustomScheduleDatatable';
//import { useDatatableSelection } from 'components/hooks/useDatatableSelection';
import Modal from 'react-bootstrap/Modal';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';

import { DatatableSplitScreenSearch } from 'components/DatatableSplitScreenSearch';

import { apiService } from 'services/apiService';
import { apiCustomService } from 'services/apiCustomService';
import { alert } from 'helpers';
import moment from 'moment'
import swal from 'sweetalert';

import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";


//import { onRowSelected} from 'components/CustomModule';
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
 import { Events } from 'helpers/events';

/* Initialize events for the Modal */
const ModalEvents = new Events();

/* Controls for the Modal */


export function CustomScheduleModule(
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
})
{
const ModalControl =
{
  /* Show the Modal */
  show: () => ModalEvents.trigger('toggle', true),

  /* Close the Modal */
  close: () => ModalEvents.trigger('toggle', false),

  /* Togggle the Modal */
  toggle: state => ModalEvents.trigger('toggle', state),
}

  const [ datafields, setDatafields ] = useState([]);
  const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
  const [unsignShow, setunsignShow] = useState(false);


  const [orderModalShow, setOrderModalShow] = useState(false);
  const [ordersShow, setOrdersShow] = useState(false);

  const [ScheduleIds, setScheduleIds] = useState(false);

  const [ orderList, setOrderList] = useState([]);
  const [ orderDataList, setOrderDataList] = useState([]);
  const [dataLabelList,setDataLabelList] =useState([])
  /* State for the module's data */
  const [ data, setData ] = useState([]);

  /* States for the usage of the AutoForm component. */
  const [ record, setRecord ] = useState({});

  /* Selection of the rows of the table  */

  const { selectedCustomRows, setSelectedCustomRows } = useState({});
  const [ seletedSchedId, setSeletedSchedId] = useState([]);
  const [isLoading,setIsLoading] = useState(false)
  /* Effect for getting the data from the API. */

  const onSchedRowSelected = (data) =>
  {
if(!data.selectedRows.length)
{
   return true
}

    let oIds = [];
    let SchedID =[];
    setRecord(data.selectedRows)
    let dataList =[];
    let dataLabel =[];
    let trip = data.selectedRows[0]['trip']
    
    for(let order of data.selectedRows) {
         if(!SchedID.includes(order.id))
            {
              SchedID.push(order.id)
               
            }

         let count = 0;

         for(let ordersData of order.ordersList[0])
         {
            // if(!oIds.includes(ordersData.[count]._id))
            // {

                oIds.push(ordersData._id)
                dataList.push(ordersData._id)
                for(let tl of data.selectedRows[0].tripList[0])
                {
                  if(tl.trip == trip && tl.order._id == ordersData._id)
                  {
                         dataLabel.push(
                          {
                            "id": ordersData._id,
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

     data.selectedRows.map(({ id}, i) => {

        schedIds.push(id);

        }
      )

      // data.selectedRows.map(({ id}, i) => {

      //   schedIds.push(id);

      //   }
      // )

    setScheduleIds(schedIds);
    if(schedIds.length === 0)
    {
         setunsignShow(false);
    }
    else
    {
         setunsignShow(true);

    }




    return true;
  };
  useEffect(() =>
  {
    async function getData()
    {

    const apiResponse = await apiService.get(api);
     const orders = [];
    let count = 1;
   for(let order of apiResponse) {
      //loop through products
      const { products } = order;

      let orderInfo = {};
      let customerName = '';
      let vehicleName  = '';
      let contractorName = '';
       let totalCapacity = '';
      if(order.hasOwnProperty('vehicle')) {
        const { vehicle } = order;

        if(vehicle !== null) {
          if(vehicle.hasOwnProperty('displayName')) {
            vehicleName = vehicle.displayName;
            totalCapacity = vehicle.totalCapacity;
          } else {
            vehicleName = 'no data';
          }

          if(vehicle.hasOwnProperty('contractorDetails')) {
            contractorName = vehicle.contractorDetails.contractorName;
          } 
          else
          {
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
         let ordersList = [order.orders];
         let tripList = [order.tripDetails];
         let contractor = order.hasOwnProperty('vehicle') ?"" : "";
         let getIndex   = 0;


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

         for(let ordersData of order.orders)
         {
               let trip = "" ;
               let drop = "";
              let countIndex = 0;
             
              for(let tripDetail of order.tripDetails )
              {
                   if(ordersData._id == tripDetail.order._id)
                   {
                         trip = tripDetail.trip;
                         drop = tripDetail.drop


                   }
                   
              }
                ;
              orderInfo = {
                  "id": order.id,
                  "hauler": contractor,
                  "status": order.status,
                  "orderId": order.id,
                  "hauler":contractorName,
                  "shipmentNo": ordersData.shipmentId,
                  "deliveryNo": order.deliveryNo,
                  "vehicle": vehicleName,
                  "totalCapacity": totalCapacity ,
                  "trip": trip,
                  "drop": drop,
                  "date": moment(ordersData.createdAt).format('MMMM D, YYYY'),
                  "customer":  ordersData.hasOwnProperty('customerDetails') ? ordersData.customerDetails.customerName1 : '---' ,
                  "address":  ordersData.hasOwnProperty('customerDetails') ? (ordersData.customerDetails.customerName1 != null ? ordersData.customerDetails.street + " " + ordersData.customerDetails.city : '') : '---' ,
                  "ordersList" : ordersList,
                  "tripList": tripList,
                };
                 orders.push(orderInfo);
              countOrderKey++
              getIndex++
          }
     count++



    }

     setData(orders);
    }


    getData();


  }, [ api, name ]);

const orderData = () => {
 const orders = [];
    let count = 1;
   for(let order of data) {
      //loop through products
      const { products } = order;
      let orderInfo = {};
      let customerName = '';
      let vehicleName  = '';
       let totalCapacity = '';
       if(order.hasOwnProperty('vehicle')) {
        const { vehicle } = order;

        if(vehicle !== null) {
          if(vehicle.hasOwnProperty('displayName')) {
            vehicleName = vehicle.displayName;
            totalCapacity = vehicle.totalCapacity;
          } else {
            vehicleName = 'no data';
          }
        } else {
          vehicleName = 'no data';
        }
      } else {
        vehicleName = 'no data';
      }
         let countOrderKey = 1;
         let ordersList = [order.orders];
         let contractor = order.hasOwnProperty('vehicle') ?  "" : "";

          for(let tripDetail of order.tripDetails )
              {
                 
                    orderInfo = {
                  "id": order.id,
                 "hauler": contractor,
                  "status": order.status,
                  "orderId": order.id,
                  "vehicle": vehicleName,
                  "totalCapacity": totalCapacity ,
                  "trip": tripDetail.trip,
                  "drop": tripDetail.drop,
                  "date": moment(tripDetail.order.createdAt).format('MMMM D, YYYY'),
                  "customer":  tripDetail.order.hasOwnProperty('customerDetails') ? tripDetail.order.customerDetails.customerName1 : '---' ,
                  "address":  tripDetail.order.hasOwnProperty('customerDetails') ? (tripDetail.order.customerDetails.customerName1 != null ? tripDetail.order.customerDetails.street + " " + tripDetail.order.customerDetails.city : '') : '---' ,
                  "ordersList" : ordersList,
                };
                 orders.push(orderInfo);
              }

         for(let ordersData of order.orders)
         {
              let trip = "";
              let drop = "";
             
              
             
              countOrderKey++
          }
     count++



    }
    return orders;
}

const onRowSelected = (data) =>
  {

   
    const ids = [];
    const orderStatus = [];
    var dataStatus = [];
    var count = 0;
    data.selectedRows.map(({ id , status}, i) => {

        // ids.push(id);
        // dataStatus = { 'id': id, 'status': status};
        // orderStatus.push(dataStatus);
        }
      )
    // setSelectedRowsChange(ids);
    // setStatus(orderStatus);

    return (ids);
  };

  /* Listen for Sidepanel toggling. */
  const onSidepanelToggle = isOpened =>
  {
    if(isOpened)
    {
      alert.closeAll();
      AutoFormControl.setErrors();
    }
  };

  /* Pressing the add button */
  const onAdd = (data) =>
  {
    

    setRecord({}); /* Reset the record in the sidepanel. */
    setDatafields(fields);
    AutoFormControl.setTitle(`Add Deliveries`);
    SidepanelControl.open();
  };

   const onAssign = () =>
  {

    //setRecord({}); /* Reset the record in the sidepanel. */
    AutoFormControl.setTitle(`Assign Schedule`);


    //setChoices(schedulefields);
    setDatafields(schedulefields);
    SidepanelControl.open();
  };
const onRowClicked = (data) =>
  {
if(ScheduleIds.length > 1)
{
  swal("Failed!", `Cannot add orders to multiple vechicles.`, "error");
  return false
}
const orders  = {
  orders : selectedRows
}


swal({
  title: "Add order to existing Schedule?",
  text: "Save File!",
  icon: "info",
   button: {
    closeModal: false,
  },
  showCloseButton: true,
  dangerMode: true,
})
.then( async (willSave) => {
  if (willSave) {
 
  var count = 0;
  var tripCount = 1
  const orderStatus = {};
 const response =  await apiService.get(`/deliveries/${ScheduleIds[0]}`);
          let trip = "";
          let drop = "";
          let id = "";
          let tripdrop= [];
          let idList = [];
          let countTripOrder = 0
          orders.vehicle = response.vehicle._id
          const responseVehicle =  await apiService.get(`/deliveries`);

           
          var result = responseVehicle.filter(vehicle => vehicle.vehicle._id == response.vehicle._id);

          let getMaxTrip = 0;
          for(let filterDetail of result)
          {
            for(let tripDetail of filterDetail.tripDetails)
            {
                 if(parseInt(tripDetail.trip) >= getMaxTrip)
               {
                  getMaxTrip = parseInt(tripDetail.trip)
               }
            }

              
              
          }
        
         
       
          for(let tripDetail of response.tripDetails)
          {
            
            if(tripdrop.find( ({ order }) => order == `${tripDetail.order._id}`))
            {

            }
            else
            {
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
               
        for(let orderId of record[0].ordersList[0])
        {
          
          if(orders['orders'].find( ({ _id }) => _id == `${orderId._id}`))
            {

            }
            else
            {
               //orders['orders'].push({ _id: orderId._id});
               orderStatus.status = "assigned";
               const apiRes = await apiService.put(`/orders/${orderId._id}`,orderStatus);
            }
          
          
                
                for(let orderId of selectedRows)
              {
                 
          if(!idList.includes(orderId._id)){
            if(tripdrop.find( ({ order }) => order == `${orderId._id}`))
            {

            }
            else
            {
               orderStatus.status = "assigned";
              const apiRes = await apiService.put(`/orders/${orderId._id}`,orderStatus);
               tripdrop.push({
                 "trip": `${finaltripNumber}`,
                  "drop":`${tripCount}`,
                  "order" : orderId._id   
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
    const apiResponse =  await apiService.post(`/deliveries`, orders);

    
      return apiResponse

    } else {
      
    }
}).then((result)=>{
  
     if(result)
     {
           swal("Success!", `Order has been added.`, "success");
         setInterval(() => window.location.reload(), 1000);
     }
     else
    {
      swal("Cancelled!");
    }
    
     

});


    setDatafields(fields);

  };
  /* Clicking a row in the datatable */


  /* Submitting the form to the API. */
  const submit = async (record, id) => {
    setIsLoading(true)
    for (const field of fields)
    {
      /* Set the default values for fields that have default values. */
      if (field.default !== undefined) {
        record[field.name] = field.default;
      }

      /* Remove the fields that are not to be sent in the API. */
      if (field.noAPI) {
        delete record[field.name];
      }
    }

    const newData = [ ...data ];
    record.orders = selectedRows;
    record.status = "assigned";
    const orderStatus = {};
   
       let tripDetail = []
     let count = 1;
      for(let orderId of record.orders)
      {
          orderStatus.status = "assigned";
        const apiRes = await apiService.put(`/orders/${orderId._id}`,orderStatus);
 
         tripDetail.push({
            "trip":"1",
            "drop":`${count}`,
            "order" : orderId._id       
         })
        count++
      }

    record.tripDetails = tripDetail


      const apiResponse = await apiService.post(`/deliveries`, record);



      //const Resp = await apiService.post(`/deliveries`, tripDrop);

       

       //newData.push(apiResponse);
       swal("Success!", `${selectedRows.length > 1? `${name} have` : `${singularName} has`} been assigned.`, "success");
       setInterval(() => window.location.reload(), 1000);
     return true;
 
    setData(newData);
    SidepanelControl.close();
  };

  /* Clicking confirm on the delete modal and deleting the selected rows. */
  const onSchedConfirm = async (data) =>
  {
   setIsLoading(true)
   
   for(let ids of ScheduleIds)
   {
      const apiResponse = await apiService.delete(`${api}`,ids);

   }

const orderStatus = {};
   for(let orderId of orderList)
       {
          orderStatus.status = "open";
         const apiRes = await apiService.put(`/orders/${orderId}`,orderStatus);
     
       }
    // if(!apiResponse.success) {
    //   return alert.error(apiResponse.message || `Cannot Unassign ${singularName}. An error occurred.`);
    // }

 setSmShow(false);
swal("Success!", `Schedule Deliveries has been saved.`, "success");
setIsLoading(false)
  setInterval(() => window.location.reload(), 1000);


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
const SortableItem = sortableElement(( {value} ) => (
  <div className="dragElement">
   {dataLabelList.map(({id,label,trip}, index) => (
       value == id ? `Trip ${trip} - ${label} - ${id}`  : ""   

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

const SortableItems = () =>
{

    const dragList  = <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {dataLabelList.map((value, index) => (
           <SortableItem key={`item-${index}`} index={index} value={value.id} />
          
        ))}
      </SortableContainer>

    return <div className="p-2 pl-3">{dragList}</div>;
}


const onDropChange = async () =>
  {
      setIsLoading(true)
      let scheduleID = seletedSchedId[0];
      const reOrderedIds = [];
      const ID = []

  const response =  await apiService.get(`/deliveries/${ScheduleIds[0]}`);
          let trip = "";
          let drop = "";
          let id = "";
          let tripdrop= [];
          let idList = [];
          let countTripOrder = 0
          let countLoop = 1
          for(let list of dataLabelList)
          {
               tripdrop.push({
                 "trip": `${list.trip}`,
                  "drop":`${countLoop}`,
                  "order" : list.id   
               })
              countLoop++
          }
         
          for(let tripDetail of response.tripDetails)
          {
            
         
            if(tripdrop.find( ({ order }) => order == `${tripDetail.order._id}`))
            {

            }
            else
            {
              tripdrop.push({
                 "trip": `${tripDetail.trip}`,
                  "drop":`${tripDetail.drop}`,
                  "order" : tripDetail.order._id   
               })
              
            }
          
              
          }


        const tripDrop = {
        "tripDetails": tripdrop
      };
       
      const apiRes = await apiService.put(`/deliveries/${ScheduleIds[0]}`, tripDrop);
  
     if(apiRes)
     {
       swal("Success!", `Drop successfully updated!`, "success");
       setInterval(() => window.location.reload(), 1000);
       setIsLoading(false)
      return true;
    }
  }

  return (
    // data.length !== 0 &&
    <>
      <div className="datatable-header d-flex align-items-center justify-content-between w-100">
        <div>

          <button className="btn btn-sm btn-primary btn-add mx-1"
            onClick={onAdd}>
            <i className="fa fa-plus mr-1"></i> Add
          </button>

          <button className="btn btn-sm btn-primary mx-1"
            hidden={unsignShow === false}
           onClick={() => setSmShow(true)}
          >
            <i className="fa fa-unlink mr-1"></i> Unassign
          </button>

          <button className="btn btn-sm btn-primary mx-1"
            hidden={unsignShow === false}
           onClick={() => setLgShow(true)}
          >
            <i className="fa fa-unlink mr-1"></i> Update Drop
          </button>
           <button className="btn btn-sm btn-primary mx-1"
            hidden={unsignShow === false}
           onClick={() => onRowClicked()}
          >
            <i className="fa fa-unlink mr-1"></i> add Orders
          </button>

        </div>
        <DatatableSplitScreenSearch className="search" onSearch={search => DatatableCustomControl.setSearch(search)} />
      </div>
      <CustomScheduleDatatable
        fields={fields}
        datasched={data}
        onRowSelected={onSchedRowSelected}
        onSchedRowSelected={onSchedRowSelected}
        onRowClicked={onRowClicked}
        objectKey={objectKey}
      />

     <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          Unassign Schedule
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {seletedSchedId.length > 1 ? "Cannot porcess multiple vechicles" : "Are you sure you want to Unassign Schedule?"}

        </Modal.Body>
        <Modal.Footer>
        <button className="btn btn-default" type="button" onClick={() =>
        {

         setSmShow(false);
        }}>
          <i className="fa fa-times mr-1"></i> Close
        </button>
         {seletedSchedId.length > 1 ? "" :
          <button className="btn btn-warning" disabled={isLoading}  type="button" onClick={() =>
          {
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
            <div className ="row">
                <div className="col-12">
                 {seletedSchedId.length > 1 ? "Cannot Change Drop" : <SortableItems/>}
                </div>

            </div>
          </div>
          </>
        </Modal.Body>
        <Modal.Footer>
        <button className="btn btn-default" type="button" onClick={() =>
        {

         setLgShow(false);
        }}>
          <i className="fa fa-times mr-1"></i> Close
        </button>
         {seletedSchedId.length > 1 ? "" :
          <button className="btn btn-warning" disabled={isLoading}  type="button" onClick={() =>
          {
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

    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default CustomScheduleModule;
