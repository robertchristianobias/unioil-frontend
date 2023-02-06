import React from 'react';
import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';

const ModuleDispatch = React.lazy(() => import('components/ModuleDispatch'));

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

export function Dispatch()
{
  const fields = [
    {
      name: 'contractor',
      label: 'Hauler',
      noInput: true,
    },
    {
      name: 'vehicle',
      label: 'Vehicle',
      noInput: true,
    },
    {
      name: 'totalCapacity',
      label: 'Total Capacity',
      noInput: true,
    },
    {
      name: 'shipmentNo',
      label: 'Shipment No',
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
      name: 'customer',
      label: 'Customer',
      noInput: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      choices: [
        { value: 'queueing', label: 'Queueing', isdisabled:false },
        { value: 'on_the_way', label: 'On the way', isdisabled:false },
        { value: 'arrive_at_customer', label: 'Arrived at Customer', isdisabled:true },
        { value: 'start_of_discharge', label: 'Start of discharge', isdisabled:true },
        { value: 'end_of_discharge', label: 'End of discharge' , isdisabled:true},
        { value: 'delivered', label: 'Delivered', isdisabled:false },
        { value: 'returning_to_plant', label: 'Returning to Plant', isdisabled:true },
        { value: 'arrived_at_plant', label: 'Arrived at Plant', isdisabled:true },
      ],
    },
  ];

  return (
    <ModuleDispatch
      name="Dispatch"
      singularName="Dispatch"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/deliveries"
    />
  );
}

export default Dispatch;
