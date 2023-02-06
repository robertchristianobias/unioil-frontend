import React ,{ useState, useEffect} from 'react';
import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';

const EtaModule = React.lazy(() => import('components/EtaModule'));

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

export function Eta()
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
    noInput: true,
  },
];

 const Customfields = [{
    name: 'logintime',
    label: 'Log-In Time',
    type: 'datetimepicker',

  },
  {
    name: 'timefinishedloading',
    label: 'Time Finished Loading',
    type: 'datetimepicker',

  },
   {
    name: 'timeleftdepot',
    label: 'Time Left Depot',
    type: 'datetimepicker',

  },
  {
    name: 'timearrivedatcust',
    label: 'Time Arrived',
    type: 'datetimepicker',

  },
  {
    name: 'timedepartmentfromcust',
    label: 'Date Departed',
    type: 'datetimepicker',
  },
   {
    name: 'timereturntodepot',
    label: 'Time Return to Depot',
    type: 'datetimepicker',
  },
];

  return (
    <EtaModule
      name="ETA"
      singularName="ETA"
      formSize={SidepanelSize.small}
      fields={Customfields}
      api="/deliveries"
      customSidepanelContent={Customfields}
    />
  );
}

export default Eta;
