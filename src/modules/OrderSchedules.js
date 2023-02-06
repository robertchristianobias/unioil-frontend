import React ,{ useState, useEffect} from 'react';
import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';

const Module = React.lazy(() => import('components/Module'));

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

export function OrderSchedules()
{

const [ choices, setChoices ] = useState([]);
  useEffect(() =>
  {
    (async () =>
    {
      const choicesData = await getData('/customers');
      setChoices(choicesData);
    })();
  }, []);

  const fields = [{
    name: 'status',
    label: 'Status',
    type: 'select',
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
    name: 'customerCode',
    label: 'Customer',
    type: 'select',
    choices
  },
  {
    name: 'vehicleCode',
    label: 'Vehicle',
    type: 'select',
    choices: [
      { value: 'aaa', label: 'Vehicle 1' }
    ]
  },
  {
    name: 'orderDate',
    label: 'Date',
    type: 'datepicker',
  },
  {
    name: 'orderEta',
    label: 'ETA',
    type: 'datetimepicker',
  },
];

  return (
    <Module
      name="Schedules"
      singularName="Schedule"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/hauler-schedules"
    />
  );
}

export default OrderSchedules;
