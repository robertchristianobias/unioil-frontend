import React, {useRef, useState, useEffect } from 'react';
import moment from 'moment'

import { apiService } from 'services/apiService';
import { DispatchDatatable } from 'components/DispatchDatatable';
import { useDatatableSelection } from 'components/hooks/useDatatableSelection';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';
import { InputField } from 'components/inputField';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal';
import './css/Module.css';
import Select from 'react-select';
import { __esModule } from 'react-offcanvas/lib/OffCanvas';
/**
 * @typedef Field
 * @property {string} name The name of the field.
 * @property {string} label The label for the field to be displayed in the UI.
 * @property {any} [default] The default value of the field.
 * @property {string} [type] The type of the field's input className="form-control".
 * @property {string[]} [choices] Choices for select, checkboxes and radios.
 * @property {string[]} [richTextAreaOptions] Options for the Rich Text Area (TinyMCE).
 * @property {boolean} [hidden] If the field should be shown in the row's expandable area.
 * @property {boolean} [noDisplay] If the fiels should not be shown in the table.
 * @property {boolean} [noInput className="form-control"] If the field should not be in the form.
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
export function ModuleDispatch(
{
  name,
  singularName,
  formSize,
  fields,
  api,
  objectKey,
})
{
  /* State for the module's data */
  const [ data, setData ] = useState([]);
  const formRef = useRef();
   /* States for the usage of the AutoForm component. */
   const [ record, setRecord ] = useState({});
   const [isLoading,setIsLoading] = useState(false)
   const [lgShow, setLgShow] = useState(false);
  /* Selection of the rows of the table  */
  const { onRowSelected } = useDatatableSelection();
  const [ drivers, setDrivers ] = useState([]);
  let [ errors, setErrors ] = useState();
  const inputs = fields.filter(({ noInput }) => !noInput);
  const [state, setState] = useState('')
  /* Effect for getting the data from the API. */
  useEffect(() => {
    async function getData() {
      const apiResponse = await apiService.get(api);

      setData(apiResponse);
      console.log("del",apiResponse)
      const apiRes = await apiService.get('/drivers');
      setDrivers(apiRes);
    }

    getData();
  }, [ api, name ]);

  console.log('dataaaa', data);

  /* Listen for Sidepanel toggling. */
  const onSidepanelToggle = isOpened =>
  {
    if(isOpened)
    {
      AutoFormControl.setErrors();
    }
  };

  // Assemble order data
  const deliveryData = () => {
    let deliveryInfo = {};
    let customerName = '--';
    let customerAddress = '--';
    let vehicleName = '--';
    let contractorName = '--';
    let driverName = "---";
    let driverId = "---";
    const deliveries = [];



    for (let delivery of data) {
      const { id, status, tripDetails,vehicle,etaChange } = delivery;


      let logInTime = "--";
      let logInDate= "--";
      let timeFinishedLoading = "--";
      let dateFinishedLoading = "--";
      let timeLeftDepot = "--";
      let timeArrivedAtCustomer = "--";
      let timeDepartedFromCustomer = "--";
      let timeReturnToDepot = "--";
      let trip = "" ;
      let drop = "";
      let  contractorId = "";
      let person = "--";
      let etaTime = "";
      let etaDate = "";
      let customerCode ="";
      let customerContact ="";
      let destinationRef = ""
      if(etaChange.length > 0)
      {
        for(let etaData of etaChange)
        {
          person = etaData.user.username;
        }

      }
      else
      {
        person = "--";
      }

      let count = 0;
      for (let order of tripDetails) {


        // check if has vehicle
        if (delivery.hasOwnProperty('vehicle')) {
          vehicleName = delivery.vehicle.displayName;
          contractorName = delivery.vehicle.contractorDetails.contractorName;
          contractorId = delivery.vehicle.contractor
        }

        // check if has customer details
        if (order.hasOwnProperty('customerDetails')) {
          customerName = order.customerDetails.customerName1;
          customerAddress = order.customerDetails.street + " " +  order.customerDetails.city;
          customerCode = order.customerDetails.customerCode;
          destinationRef = order.customerDetails.destinationRef;
        }

        if (delivery.hasOwnProperty('driver')) {
          driverId = delivery.driver.id;
          driverName = delivery.driver.driverFirstName + " " +  delivery.driver.driverLastName;
          console.log("driver",order.driver)
        }
              logInTime = order.logInTime;
              timeFinishedLoading = order.timeFinishedLoading;
              timeLeftDepot = order.timeLeftDepot;
              timeArrivedAtCustomer = order.timeArrivedAtCustomer;
              timeDepartedFromCustomer = order.timeDepartedFromCustomer;
              timeReturnToDepot = order.timeReturnToDepot;
              trip = order.trip;
              drop = order.drop;
        if(delivery.hasOwnProperty('etaChange'))
        {

        }
        deliveryInfo = {
          'deliveryId': id,
          'status': status,
          'orderId': order.order.orderId,
          'orderNo': order.order._id,
          'customer': customerName,
          'customerUrl': order.order.customer,
          'vehicle': vehicleName,
          'contractor': contractorName,
          'trip': trip,
          'drop': drop,
          'ddate': moment(order.order.date).format('yyyy-MM-D'),
          'deliveryNo': order.order.deliveryNo,
          'totalCapacity':delivery.vehicle.totalCapacity,
          'address': customerAddress,
          'logInDate' :moment(logInTime).format('yyyy-MM-DD'),
          'logInTime' :logInTime,
          'timeFinishedLoading':timeFinishedLoading,
          'timeLeftDepot':timeLeftDepot,
          'timeArrivedAtCustomer':timeArrivedAtCustomer,
          'timeDepartedFromCustomer':timeDepartedFromCustomer,
          'timeReturnToDepot':timeReturnToDepot,
          'person': person,
          'etaChange': delivery.etaChange,
          'etaDate': moment(delivery.etaChange.etaChangeDate).format('yyyy-MM-DD'),
          'etaTime': delivery.etaChange.etaChangeDate,
          'remarks': delivery.remarks,
          'driverId':driverId,
          'driverName':driverName,
          'customerCode':customerCode,
          'customerContact':customerContact,
          'destinationRef':destinationRef,
          'contractorId':contractorId
        };


        deliveries.push(deliveryInfo);
        count++
      }


    }

    return deliveries;
  };

  /* Clicking a row in the datatable */
  const onRowClicked = clickedRow => {
    AutoFormControl.setTitle(`Update ${singularName}`);

    for (const field of fields)
    {
      if (field.noDisplay) {
        delete clickedRow[field.name];
      }
    }

    setRecord(clickedRow);
    setLgShow(true)
    // if (clickedRow)
    // {
    //   if (clickedRow.id !== record.id) {
    //     SidepanelControl.open();
    //   } else  {
    //     SidepanelControl.toggle();
    //   }
    // }
  };

  /* Submitting the form to the API. */
  const submit = async (record, id) => {
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
    const { deliveryId, status } = record;
    const recordData = {
      'status': status
    }
    const apiResponse = await apiService.put(`${api}/${deliveryId}`, recordData);

    if(apiResponse) {
      swal("Success", `${singularName} has been updated.`, 'success');
    }

    setData(newData);
    SidepanelControl.close();
  };
  const onSubmit = async (e) => {
    const buttonVal = e.target.value



    if(record.etaChange.length >= 4)
    {
      swal("Failed", `You have already reached the maximum allowed number of changes.`, 'error');
      return false;
    }

    setIsLoading(true)
    const form = formRef.current;


    const formData = {};
    const etaDate = formRef.current['ddate'].value + " " +formRef.current['dtime'].value;
    const etaData = moment(etaDate).format()

    const logIn = formRef.current['logInDate'].value + " " +formRef.current['logInTime'].value;
    const logInData = moment(logIn).format()

    const FinishedLoading = formRef.current['dateFinishedLoading'].value + " " +formRef.current['timeFinishedLoading'].value;
    const FinishedLoadingData = moment(FinishedLoading).format()

    const leftDepot = formRef.current['dateLeftDepot'].value + " " +formRef.current['timeLeftDepot'].value;
    const leftDepotData = moment(leftDepot).format()

    const arrivedAtCustomer = formRef.current['dateArrivedAtCustomer'].value + " " +formRef.current['timeArrivedAtCustomer'].value;
    const arrivedAtCustomerData = moment(arrivedAtCustomer).format()

    const departedFromCustomer = formRef.current['dateDepartedFromCustomer'].value + " " +formRef.current['timeDepartedFromCustomer'].value;
    const departedFromCustomerData = moment(departedFromCustomer).format()

    const returnToDepot = formRef.current['dateReturnToDepot'].value + " " +formRef.current['timeReturnToDepot'].value;
    const returnToDepotData = moment(returnToDepot).format()

    const td =
    formData.tripDetails = [
      {
        "trip":`${record.trip}`,
        "drop":`${record.drop}`,
        "order" : `${record.orderNo}`,
        "logInTime": buttonVal != 1 ? logInData : record.logInTime ,
        "timeFinishedLoading":(buttonVal != 1 ? FinishedLoadingData : record.timeFinishedLoading),
        "timeLeftDepot":(buttonVal != 1 ? leftDepotData : record.timeLeftDepot),
        "timeArrivedAtCustomer":(buttonVal != 1 ? arrivedAtCustomerData : record.timeArrivedAtCustomer),
        "timeDepartedFromCustomer":(buttonVal != 1 ? departedFromCustomerData : record.timeDepartedFromCustomer),
        "timeReturnToDepot":(buttonVal != 1 ? returnToDepotData: record.timeReturnToDepot),
      }
    ];

    let items = [];
    if(record.etaChange.length >  0)
    {
      for(let etaChange of record.etaChange)
      {

          if(etaChange != null)
          {
            items.push(
              {
                "etaChangeDate":   moment(etaChange.etaChangeDate).format(),
                "user":  etaChange.user.id,
                "reasonForChange":  etaChange.reasonForChange
               })
          }

      }
    }
    if(buttonVal != 2 )
    {
      items.push({
        "etaChangeDate":moment().format(),
       // "user":formRef.current['person'].value,
       "user":"6022bbbc20166ce064c8e6e1", // temp
        "reasonForChange":formRef.current['reason'].value
       })
    }

    formData.etaChange = items ;
    formData.driver = formRef.current['driver'].value;
    formData.remarks = formRef.current['remarks'].value;
    console.log("----",formData);

    const apiRes = await apiService.put(`/deliveries/${record.deliveryId}`,formData);


    if(apiRes)
    {
      const res = await apiService.get(`/deliveries`);
      swal("Success", `ETA Information has been updated.`, 'success');
      setIsLoading(false)
      setLgShow(false)
      setInterval(() => window.location.reload(), 1000);
      return true;
    }
    else
    {
      swal("Failed", `Cannot save ETA Information.`, 'error');
      setIsLoading(false)
      return false;
    }
  };


  const FormModal =  ({ data }) =>
  {

    if(!record)
    return true
    console.log("test 1",record)

    let driverList= [];
    let driverCount = 0;

    for(let driver of drivers)
    {
      driverList.push({ value: driver._id, label: driver.driverFirstName + ", " + driver.driverLastName})
      driverCount++
    }
    const items = []
    let countEta = 0;
    let etaName= "ORIG ETA";
    let etaName1= "ETA Chg1";
    let etaName2= "ETA Chg2";
    let etaName3= "ETA Chg3";
    for(let etaChange of record.etaChange)
    {

     items.push(<tr>
      <td>{countEta == 0  ? etaName : `ETA Chg${countEta}`}</td>
      <td> { etaChange === null ? "" : moment(etaChange.etaChangeDate).format('yyyy-MM-DD')  }</td>
      <td> { etaChange === null ? "" : moment(etaChange.etaChangeDate).format('HH:mm:ss.SSS')  }</td>
      <td> { etaChange === null ? "" : etaChange.user.username }</td>
      <td> { etaChange === null ? "" : etaChange.reasonForChange}</td>
    </tr>)
    countEta++
    }
    if(record.etaChange.length < 4)
    {
      let addLoop =   4 - record.etaChange.length;
      let loopCount = record.etaChange.length;
      for(let x = 1;x <= addLoop;x++)
      {
        items.push(<tr>
          <td>{ loopCount == 0 ? etaName :`ETA Chg${loopCount}`}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>)
        loopCount++
      }
    }
    console.log("dir",driverList)
    const expandFields  = <form ref={formRef} className="form-inline"> <div  className="container">
    <div className ="row">
      <div className="col-6">
        <div className="row">
          <fieldset style={{ padding: "2%", border: "1px solid #ccc"}}>
            <legend>Order Information</legend>
            <div className ="row">
              <div className="col-6">
                <div className="form-group">
                  <div className="col-6">
                    <label>Delivery Date:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Delivery Date " name="deliverydate" value={record.ddate} disabled="true" />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <div className="col-6">
                        <label>Trip:</label>
                      </div>
                      <div className="col-6">
                        <input className="form-control-plaintext" type="text" placeholder="Trip" name="Trip" value={record.trip} disabled="true"/>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <div className="col-6">
                        <label>Drop:</label>
                      </div>
                      <div className="col-6">
                        <input className="form-control-plaintext" type="text" placeholder="Drop" name="Drop" value={record.drop} disabled="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className ="row">
              <div className="col-6">
                <div className="form-group">
                  <div className="col-6">
                    <label>Order No:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Order No." name="Order No." value={record.orderId} disabled="true" />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <div className="col-6">
                    <label>Delivery No:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Delivery No." name="Delivery No." value={record.deliveryNo} disabled="true" />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="row">
          <fieldset style={{ padding:"2%", border: "1px solid #ccc"}}>
            <legend>Hauler Information <a href="/contractor" target="_blank" onClick={() => localStorage.setItem('contractor',record.contractorId)}><i className="fas fa-info-circle"></i></a></legend>
            <div className="row">
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Vehicle:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Vehicle" name="vehicle" value={record.vehicle} disabled="true"/>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Cap:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Cap" name="totalCapacity" value={record.totalCapacity} disabled="true" />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Hauler:</label>
                  </div>
                  <div className="col-6">
                    <input className="form-control-plaintext" type="text" placeholder="Hauler" name="contractor" value={record.contractor} disabled="true"/>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset style={{ padding:"2%", border: "1px solid #ccc"}}>
            <legend>Customer Information <a href="/customer" target="_blank" onClick={() => localStorage.setItem('customer',record.customerUrl)}><i className="fas fa-info-circle"></i></a></legend>
            <div className="row">
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Customer Code:</label>
                  </div>
                  <div className="col-6">
                    {record.customerCode} {record.customer}
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Address:</label>
                  </div>
                  <div className="col-6">
                    {record.address.substr(1, 10)} ...
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <div className="col-6">
                    <label>Tel No:</label>
                  </div>
                  <div className="col-6">
                    {record.customerContact}
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset style={{ padding:"2%", border: "1px solid #ccc", width: "100%"}}>
            <legend>Remarks</legend>
            <div className="row">
              <div className="col-12">
                <textarea className="form-control" name="remarks" style={{width: "100%"}}>{record.remarks}</textarea>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
      <div className="col-6">
        <fieldset>
          <legend>ETA Information</legend>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <div className="col-6">
                  <label>Date:</label>
                </div>
                <div className="col-6">
                  <InputField type="date" name="ddate" defaultValue={record.etaDate} />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <div className="col-6">
                  <label>Time:</label>
                </div>
                <div className="col-6">
                  <InputField type="time"  name="dtime" defaultValue={moment(record.etaTime).format('HH:mm:ss')} />
                </div>
              </div>

            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <div className="col-6"><label>Person:</label></div>
                <div className="col-6">
                  <InputField type="text" name="person" defaultValue={record.person} />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <div className="col-6">
                  <label >Reason:</label>
                </div>
                <div className="col-6">
                  <select className="form-control" name="reason" >
                    <option value="initialETA">Initial ETA</option>
                    <option value="customerInitiated">Customer Initiated</option>
                    <option value="delayedFromLastTrip">Delayed from last trip</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <div className="col-6">
                  <label>Driver:</label>
                </div>
                <div className="col-6">
                  <Select
                    name="driver"
                    options={driverList}
                    className="form-control p-0"
                    placeholder="Select Driver"
                    defaultValue={{ label: `${record.driverName}` , value: `${record.driverId}` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset style={{ padding:"2%",border: "1px solid #ccc"}}>
          <legend >Trip Information</legend>
          <div className="row ">
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Login Time:</label>
              <InputField type="date" name="logInDate"  defaultValue={record.logInDate}/>
              <InputField type="time" name="logInTime" defaultValue={moment(record.logInTime).format('HH:mm:ss.SSS')} />
            </div>
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Time Finished Loading:</label>
              <InputField  type="date" name="dateFinishedLoading"  defaultValue={moment(record.timeFinishedLoading).format('yyyy-MM-DD')}/>
              <InputField  type="time"  name="timeFinishedLoading"  defaultValue={moment(record.timeFinishedLoading).format('HH:mm:ss.SSS')}/>
            </div>
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Time Left Depot:</label>
              <InputField  type="date" name="dateLeftDepot"  defaultValue={moment(record.timeLeftDepot).format('yyyy-MM-DD')}/>
              <InputField  type="time" name="timeLeftDepot"  defaultValue={moment(record.timeLeftDepot).format('HH:mm:ss.SSS')}/>
            </div>
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Time Arrival:</label>
              <InputField  type="date"  name="dateArrivedAtCustomer"  defaultValue={moment(record.timeArrivedAtCustomer).format('yyyy-MM-DD')} />
              <InputField  type="time"  name="timeArrivedAtCustomer"   defaultValue={moment(record.timeArrivedAtCustomer).format('HH:mm:ss.SSS')} />
            </div>
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Timer Departed From Customer:</label>
              <InputField  type="date"  name="dateDepartedFromCustomer"  defaultValue={moment(record.timeDepartedFromCustomer).format('yyyy-MM-DD')} />
              <InputField  type="time"  name="timeDepartedFromCustomer"  defaultValue={moment(record.timeDepartedFromCustomer).format('HH:mm:ss.SSS')} />
            </div>
            <div className="col-12 d-flex ti">
              <label style={{ width: "100%"}}>Time Return to Depot":</label>
              <InputField  type="date" name="dateReturnToDepot"  defaultValue={moment(record.timeReturnToDepot).format('yyyy-MM-DD')}/>
              <InputField type="time"  name="timeReturnToDepot"   defaultValue={moment(record.timeReturnToDepot).format('HH:mm:ss.SSS')}/>
            </div>

          </div>
        </fieldset>
      </div>
    </div>
    <div class="row">
      <div className ="col-12">
        <fieldset style={{ border: "1px solid #ccc"}}>
          <legend >Retrieved ETA</legend>
          <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Prsn Infrmd</th>
                  <th>Reason for change</th>
                </tr>
              </thead>
              <tbody>
                {items}
              </tbody>
            </table>
        </fieldset>
        </div>
    </div>
    </div>
    </form>

    return <div className="">{expandFields}</div>;
  };
  return (
    data.length !== 0 && <>

<Modal
        size="xl"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
          Dispatch
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <>

        {record  ? <FormModal/> : ""}

          </>
        </Modal.Body>
        <Modal.Footer>
        <button className="btn btn-default" type="button" onClick={() =>
        {
         setLgShow(false);
        }}>
          <i className="fa fa-times mr-1"></i> Close
        </button>
        <button className="btn btn-primary" disabled={isLoading}  type="button" onClick={onSubmit} value="1">
        {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-save mr-1"></i> Save ETA Information</>}
        </button>
        <button className="btn btn-info" disabled={isLoading}  type="button" onClick={onSubmit} value="2">

        {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-save mr-1"></i> Save Trip Information</>}
        </button>
          {/* <button className="btn btn-warning" disabled={isLoading}  type="button" onClick={onSubmit} value="3">

           {isLoading ? <><i class="fas fa-spinner fa-spin"></i> Loading...</> : <> <i className="fa fa-save mr-1"></i> Save </>}
        </button> */}

        </Modal.Footer>
      </Modal>

      <DispatchDatatable
        fields={fields}
        data={deliveryData()}
        onRowSelected={onRowSelected}
        onRowClicked={onRowClicked}
        objectKey={objectKey}
        selectableRows="true"
      />
      <Sidepanel widthPercentage={formSize} onToggle={onSidepanelToggle}>
        {
          <AutoForm
            fields={fields}
            data={record}
            onCancel={() => SidepanelControl.close()}
            onSubmit={submit}
          />
        }
      </Sidepanel>
    </>
  );
}

export default ModuleDispatch;
