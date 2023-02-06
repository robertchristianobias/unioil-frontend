import React, { useState, useEffect} from 'react';
import { SidepanelSize } from 'components/Sidepanel';
import { apiService } from 'services/apiService';

const Module = React.lazy(() => import('components/Module'));

async function getData(api)
{
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value._id, 'label': value.contractorName });
  });

  return choices;
};

export function Vehicles()
{
  const [ choices, setChoices ] = useState([]);

  useEffect(() =>
    {(async () => {
      const choicesData = await getData('/contractors?_sort=contractorName:ASC');

      setChoices(choicesData);
    })();
  }, []);

  const fields = [{
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    required: true,
  },
  {
    name: 'vehicleDescription',
    label: 'Description',
    type: 'text',
    hidden: true,
    required: true,
  },
  {
    name: 'plateNoOne',
    label: 'Plate #1',
    type: 'text',
    hidden: true,
    required: true,
  },
  {
    name: 'plateNoTwo',
    label: 'Plate #2',
    type: 'text',
    hidden: true,
    required: true,
  },
  {
    name: 'contractor',
    label: 'Contractor',
    type: 'select',
    choices,
    hidden: true,
  },
  {
    name: 'plant',
    label: 'Plant',
    type: 'text',
    hidden: true,

  },
  {
    name: 'totalCapacity',
    label: 'Total Capacity',
    type: 'text',
  },
  {
    name: 'compartmentCapacity1',
    label: 'Compartment 1',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity2',
    label: 'Compartment 2',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity3',
    label: 'Compartment 3',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity4',
    label: 'Compartment 4',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity5',
    label: 'Compartment 5',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity6',
    label: 'Compartment 6',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity7',
    label: 'Compartment 7',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity8',
    label: 'Compartment 8',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity9',
    label: 'Compartment 9',
    type: 'text',
    hidden: true,
  },
  {
    name: 'compartmentCapacity10',
    label: 'Compartment 10',
    type: 'text',
    hidden: true,
  },
  {
    name: 'deadFreightVol',
    label: 'Dead Freight Volume',
    type: 'text',
  },
  {
    name: 'gpsEquip',
    label: 'GPS Equip',
    type: 'radio',
    choices: ['Yes', 'No']
  },
  {
    name: 'fleetStatus',
    label: 'Fleet Status',
    type: 'select',
    choices: [
      { value: 'core', label: 'Core' },
      { value: 'phaseout', label: 'Phaseout' },
      { value: 'spare', label: 'Spare' }
    ],
  },
  {
    name: 'pumpAvailable',
    label: 'Pump Available',
    type: 'radio',
    choices: ['Yes', 'No']
  },
  {
    name: 'remarks',
    label: 'Remarks',
    type: 'textarea',
    hidden: true,
  },
];

  return (
    <Module
      name="Vehicles"
      singularName="Vehicle"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/vehicles"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Vehicles;
