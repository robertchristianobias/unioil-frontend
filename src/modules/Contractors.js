import React from 'react';
import { SidepanelSize } from 'components/Sidepanel';

const Module = React.lazy(() => import('components/Module'));

export function Contractors() {

  const fields = [
    {
      name: 'contractorCode',
      label: 'Code',
      type: 'text',
      required: true,
    },
    {
      name: 'contractorName',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'displayName',
      label: 'Display Name',
      type: 'text',
      required: true,
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textArea',
      required: true,
    }];

  return (
    <Module
      name="Contractors"
      singularName="Contractor"
      formSize={SidepanelSize.small}
      fields={fields}
      api="/contractors"
      sortBy="?_sort=createdAt:DESC"
    />
  );
}

export default Contractors;
