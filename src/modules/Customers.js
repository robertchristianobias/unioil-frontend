import React from 'react';
import { SidepanelSize } from 'components/Sidepanel';

const Module = React.lazy(() => import('components/Module'));

export function Customers()
{
  const fields =
  [
    {
      name: 'customerCode',
      label: 'Code',
      type: 'text',
      required: true,
    },
    {
      name: 'customerName1',
      label: 'Customer Name 1',
      type: 'text',
      required: true,
    },
    {
      name: 'customerName2',
      label: 'Customer Name 2',
      type: 'text',
    },
    {
      name: 'alias',
      label: 'Alias',
      type: 'text',
      required: true,
    },
    {
      name: 'contactPerson1',
      label: 'Contact Person 1',
      type: 'text',
      hidden: true,
    },
    {
      name: 'contactPerson2',
      label: 'Contact Person 2',
      type: 'text',
      hidden: true,
    },
    {
      name: 'contactPerson3',
      label: 'Contact Person 3',
      type: 'text',
      hidden: true,
    },
    {
      name: 'contactNum1',
      label: 'Contact Number 1',
      type: 'text',
      hidden: true,
    },
    {
      name: 'contactNum2',
      label: 'Contact Number 2',
      type: 'text',
      hidden: true,
    },
    {
      name: 'contactNum3',
      label: 'Contact Number 3',
      type: 'text',
      hidden: true,
    },
    {
      name: 'street',
      label: 'Street',
      type: 'text',
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
    },
    {
      name: 'province',
      label: 'Province',
      type: 'text',
    },
    {
      name: 'postalCode',
      label: 'Postal Code',
      type: 'text',
    },
   {
      name: 'zone',
      label: 'Zone',
      type: 'text',
    },
    {
      name: 'district',
      label: 'District',
      type: 'text',
    },
    {
      name: 'deliveryMode',
      label: 'Delivery Mode',
      type: 'text',
      hidden: true,
    },
    {
      name: 'longitude',
      label: 'Longitude',
      type: 'text',
      hidden: true,
    },
    {
      name: 'latitude',
      label: 'Latitude',
      type: 'text',
      hidden: true,
    },
    {
      name: 'destinationRef',
      label: 'Destination Ref',
      type: 'select',
      choices: [
        { value: '0.1', label: '0.1' },
        { value: '0.2', label: '0.2' }
      ],
      hidden: true,
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
      name="Customers"
      singularName="Customer"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/customers"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Customers;
