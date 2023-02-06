import React ,{ useState, useEffect} from 'react';
import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';

const ModuleSummarySchedules = React.lazy(() => import('components/ModuleSummarySchedules'));

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

export function Schedules()
{
  const [ choices, setChoices ] = useState([]);
  useEffect(() => {(async () => {
      const choicesData = await getData('/customers');
      setChoices(choicesData);
  })();
  }, []);

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
      label: 'Trip Status',
      type: 'select',
      choices: [
        { value: 'loading', label: 'Loading', isdisabled:false}
      ],
    },
    // {
    //   name: 'orderId',
    //   label: 'Order ID',
    //   noInput: true,
    // },
  ];

  return (
    <ModuleSummarySchedules
      name="Summary Schedules"
      singularName="Summary Schedules"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/deliveries"
    />
  );
}

export default Schedules;
