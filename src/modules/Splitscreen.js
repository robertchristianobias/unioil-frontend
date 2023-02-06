import React, { useState, useEffect, Suspense } from 'react';

import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import classes from './Splitscreen.module.css';

const CustomModule = React.lazy(() => import('components/CustomModule'));
const CustomScheduleModule = React.lazy(() => import('components/CustomScheduleModule'));
const DeliveriesModule = React.lazy(() => import('components/DeliveriesModule'));

async function getSchedData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({
      'value': value.id, 'label': value.customerName1,
    });
  });


  return choices;
};

async function getVehiclesData(api) {
  const response = await apiService.get(api);
  const choices = [];
  console.log(response)
  Object.entries(response).forEach(([key, value]) => {
    choices.push({
      'value': value.id, 'label': value.displayName,
    });
  });

  //console.log(choices);
  return choices;
};


export function Splitscreen() {

  const [selectedRows, setSelectedRowsChange] = useState([]);
  const [choices, setChoices] = useState([]);
  const [vehiclesChoices, setVehiclesChoices] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState([]);

  useEffect(() => {
    (async () => {
      const choicesData = await getData('/customers');
      setChoices(choicesData);
      const vehiclesChoices = await getVehiclesData('/vehicles');
      setVehiclesChoices(vehiclesChoices);
      //console.log(vehiclesChoices)
    })();
  }, []);

  // TODO: Add group multi-select
  //
  /** @type {import('components/Module').Field[]} */

  // Hauler
  // Vehicle
  // Total Capacity
  // Trip
  // Drop
  // Customer
  // Address
  // Trip Status
  const sched_fields = [
    {
      name: 'id',
      label: 'ID',
      noInput: true,
      hidden: true
    }
    ,
    {


      name: 'status',
      label: 'Trip Status',
      type: 'select',
      noInput: true,

      choices: [
        { value: 'open', label: 'Open' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'loaded', label: 'Loaded' },
        { value: 'onTheWay', label: 'On the way' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
      ],
    },
    {
      name: 'hauler',
      label: 'Hauler',
      noInput: true,
    },
    {
      name: 'vehicle',
      label: 'Vehicle',
      type: 'select',
      choices: vehiclesChoices
    },
    {
      name: 'shipmentNo',
      label: 'Shipment No',
      noInput: true,
    },
    {
      name: 'ld',
      label: ' Ld(%)',
      noInput: true,
    },
    {
      name: 'totalCapacity',
      label: 'Tot Cap',
      noInput: true,
    },
    {
      name: 'trip',
      label: 'Trip',
      noInput: true,
    },
    {
      name: 'drop',
      label: 'Drop',
      noInput: true,
    },
    {
      name: 'date',
      label: 'Date',
      noInput: true,
      hidden: true
    },
    {
      name: 'customer',
      label: 'Customer',
      noInput: true,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      noInput: true,
    },
    {
      name: 'orderList',
      label: 'OrderList',
      type: 'textarea',
      noInput: true,
      hidden: true
    },
    {
      name: 'loginTime',
      label: 'Login Time',
      noInput: true,
    },
    {
      name: 'timeFinishedLoading',
      label: 'Time Finished Loading',
      noInput: true,
    },
    {
      name: 'timeLeftDepot',
      label: 'Time Left Depot',
      noInput: true,
    },
    {
      name: 'timeArrivedAtCustomer',
      label: 'Time Arrived at Customer',
      noInput: true,
    },
    {
      name: 'timeDepartedFromCustomer',
      label: 'Time Departed from Customer',
      noInput: true,
    },
    {
      name: 'timeReturnToDepot',
      label: 'Time Return to Depot',
      noInput: true,
    },
  ];

  const fields = [
    {
      name: 'orderId',
      label: 'Order No',
      hidden: true,
    },

    {
      name: 'status',
      label: 'status',
    },
    {
      name: '_id',
      label: 'Order No',
    },
    {
      name: 'deliveryNo',
      label: 'Delivery No',
    },
    {
      name: 'shipmentNo',
      label: 'Shipment No',
    },
    {
      name: 'customer',
      label: 'Customer',
    },
    {
      name: 'date',
      label: 'Date',
      hidden: true
    },
    {
      name: 'product',
      label: 'Product',
    },
    {
      name: 'volume',
      label: 'Qty',
    },
    {
      name: "addRemarks",
      label: "Additional Remarks"
    },
    {
      name: 'remarks',
      label: 'SAP Text',
    },


  ];

  const schedulefields = [{
    name: 'status',
    label: 'Schedule',
    type: 'radio',
    choices: [
      { value: '1', label: 'March 3, 2021 9pm', status: "Open" },
      { value: '2', label: 'March 4, 2021 9pm', status: "Open" },
      { value: '3', label: 'March 5, 2021 9pm', status: "Open" },
      { value: '4', label: 'March 6, 2021 9pm', status: "Open" },
      { value: '5', label: 'March 7, 2021 9pm', status: "Open" },
      { value: '6', label: 'March 8, 2021 9pm', status: "Open" },
    ]
  }];

  return (
    <SplitterLayout
      primaryIndex={0}
      primaryMinSize={300}
      secondaryInitialSize={400}
      vertical
      customClassName={classes.splitScreenContainer}
    >
      <div className="my-pane">
        <Suspense fallback={<h1>Loading Data...</h1>}>
          <DeliveriesModule
            name="Orders"
            singularName="Order"
            formSize={SidepanelSize.small}
            fields={sched_fields}
            api="/deliveries"
            schedulefields={sched_fields}
            selectedRows={selectedRows}
            setSelectedRowsChange={setSelectedRowsChange}
          />
        </Suspense>
      </div>
      <div className="my-pane">
        <CustomModule
          name="Splitscreen"
          singularName="Splitscreen"
          formSize={SidepanelSize.small}
          fields={fields}
          api="/orders"
          schedulefields={sched_fields}
          selectedRows={selectedRows}
          setSelectedRowsChange={setSelectedRowsChange}
        />
      </div>
    </SplitterLayout>
  );
}

export default Splitscreen;
