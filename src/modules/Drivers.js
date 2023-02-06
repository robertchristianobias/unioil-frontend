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

export function Drivers()
{
  const [ choices, setChoices ] = useState([]);

  useEffect(() =>
    {(async () => {
      const choicesData = await getData('/contractors');

      setChoices(choicesData);
    })();
  }, []);

  console.log('choices', choices);

  const fields = [
    {
      name: 'driverFirstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'driverLastName',
      label: 'Last Name',
      type: 'text',
      required: true,
    },
    {
      name: 'contractor',
      label: 'Contractor',
      type: 'select',
      choices,
      hidden: true,
      required: true,
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      required: true,
    },
  ];

  return (
    <Module
      name="Drivers"
      singularName="Driver"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/drivers"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Drivers;
