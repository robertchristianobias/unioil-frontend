import React, { useState, useEffect} from 'react';
import { SidepanelSize } from 'components/Sidepanel';
import { apiService } from 'services/apiService';

const ModuleDriverWorkingHours = React.lazy(() => import('components/ModuleDriverWorkingHours'));

async function getData(api)
{
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value._id, 'label': value.contractorName });
  });

  return choices;
};

export function DriverWorkingHours()
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
      name: 'id',
      label: 'Driver Name',
      type: 'int',
      hidden: true,

    },
    {
      name: 'driverName',
      label: 'Driver Name',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      label: 'Delivery Date',
      type: 'text',
      required: false,
      noInput:true,
      selector: 'DeliveryDate',
    },
    {
      name: 'dutyType',
      label: 'Duty Type',
      type: 'text',
      hidden: true,
    },
    {
      name: 'workingHours',
      label: 'Working Hours',
      type: 'text',
    },
    {
        name: 'shiftRestHours',
        label: 'Shift Rest Hours',
        type: 'text',
      },
      {
        name: 'drivingHours',
        label: 'Driving Hours',
        type: 'text',
      },
      {
        name: 'afterDutyRest',
        label: 'After Duty Rest ',
        type: 'text',
      },
      {
        name: 'excessWorkingHours',
        label: 'Excess Working Hours ',
        type: 'text',
      },
  ];

  return (
    <ModuleDriverWorkingHours
      name="DriverWorkingHours"
      singularName="DriverWorkingHours"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/drivers"
      choices={choices}
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default DriverWorkingHours;
