import React from 'react';
import { SidepanelSize } from 'components/Sidepanel';

const Module = React.lazy(() => import('components/Module'));

export function Rates()
{
  const fields =
  [
    {
      name: 'rateCode',
      label: 'Code',
      type: 'text',
      required: true,
    },
    {
      name: 'source',
      label: 'Source',
      type: 'text',
      required: true,
    },
    {
      name: 'destination',
      label: 'Destination',
      type: 'text',
      required: true,
    },
    {
      name: 'km',
      label: 'KM',
      type: 'text',
      required: true,
    },
    {
      name: 'rates',
      label: 'Rates',
      type: 'text',
      required: true,
    },
  ];

  return (
    <Module
      name="Rates"
      singularName="Rate"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/rates"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Rates;
