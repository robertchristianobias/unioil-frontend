import React from 'react';
import { SidepanelSize } from 'components/Sidepanel';

const Module = React.lazy(() => import('components/Module'));

export function Products()
{
  const fields =
  [
    {
      name: 'productCode',
      label: 'Product Code',
      type: 'text',
      required: true,
    },
    {
      name: 'productDescription',
      label: 'Product Name',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      label: 'Short Description',
      type: 'text',
      required: true,
      hidden: true,
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
      name="Products"
      singularName="Product"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/products"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Products;
