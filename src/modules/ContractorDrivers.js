import React from 'react';

// import { _TEMP_USERS } from 'services/_TEMP_DATA';

import { SidepanelSize } from 'components/Sidepanel';
const Module = React.lazy(() => import('components/Module'));

export function ContractorDrivers()
{
  // TODO: Add group multi-select
  
  /** @type {import('components/Module').Field[]} */
  const fields =
  [
    {
      name: '_id',
      label: 'ID',
      noInput: true,
    },
    {
      name: 'driverLastName',
      label: 'Driver Lastname',
      type: 'text',
    },
    {
      name: 'driverFirstName',
      label: 'Driver Firstname',
      type: 'text',
    }, 
    {
      name: 'published_at',
      label: 'Published at',
      noInput: true,
      hidden: true,
    },
    {
      name: 'createdAt',
      label: 'Created at',
      noInput: true,
       hidden: true,
    },
   {
      name: 'updatedAt',
      label: 'Updated at',
      noInput: true,
      hidden: true,
    },
  ];

  return (
    <Module
      name="Contractor Drivers"
      singularName="Contractor Driver"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/contractors/60006fc483cb7ff1be6d5375"
      objectKey='drivers'
    />
  );
}

export default ContractorDrivers;
