import React from 'react';
const CustomersModule = React.lazy(() => import('components/CustomersModule'));

export function Customer()
{


  return (
    <CustomersModule
      name="Customer Information"
      singularName="Customer Information"
      api="/customers"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Customer;
