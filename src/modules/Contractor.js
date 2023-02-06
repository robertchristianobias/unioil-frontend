import React from 'react';
const HaulersModule = React.lazy(() => import('components/HaulersModule'));

export function Contractor()
{


  return (
    <HaulersModule
      name="Haulers Information"
      singularName="Hauler Information"
      api="/contractors"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Contractor;
