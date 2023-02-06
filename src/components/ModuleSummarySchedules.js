import React, { useState, useEffect } from 'react';
import moment from 'moment'

import { apiService } from 'services/apiService';
import { OrdersDatatable } from 'components/OrdersDatatable';
import { useDatatableSelection } from 'components/hooks/useDatatableSelection';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';
import swal from 'sweetalert';

import './css/Module.css';

/**
 * @typedef Field
 * @property {string} name The name of the field.
 * @property {string} label The label for the field to be displayed in the UI.
 * @property {any} [default] The default value of the field.
 * @property {string} [type] The type of the field's input.
 * @property {string[]} [choices] Choices for select, checkboxes and radios.
 * @property {string[]} [richTextAreaOptions] Options for the Rich Text Area (TinyMCE).
 * @property {boolean} [hidden] If the field should be shown in the row's expandable area.
 * @property {boolean} [noDisplay] If the fiels should not be shown in the table.
 * @property {boolean} [noInput] If the field should not be in the form.
 * @property {boolean} [noAPI] If the field is not a field in the API (or database) as well.
 * @property {Function} [cell] A function for providing a custom cell for the field in the table.
 */

/**
 * @typedef ModuleProps
 * @property {string} name
 * @property {string} singularName
 * @property {FormSize} formSize
 * @property {Function} [customSidepanelContent]
 * @property {Field[]} fields
 * @property {string} api
 * @property {string} objectKey
 */

/** @param {ModuleProps} */
export function ModuleSummarySchedules(
{
  name,
  singularName,
  formSize,
  fields,
  api,
  objectKey,
})
{
  /* State for the module's data */
  const [ data, setData ] = useState([]);

   /* States for the usage of the AutoForm component. */
   const [ record, setRecord ] = useState({});

  /* Selection of the rows of the table  */
  const { onRowSelected } = useDatatableSelection();

  /* Effect for getting the data from the API. */
  useEffect(() => {
    async function getData() {
      const apiResponse = await apiService.get(api);

      setData(apiResponse);
    }
    getData();
  }, [ api, name ]);

  console.log('dataaaa', data);

  /* Listen for Sidepanel toggling. */
  const onSidepanelToggle = isOpened =>
  {
    if(isOpened)
    {
      AutoFormControl.setErrors();
    }
  };

  // Assemble order data
  const deliveryData = () => {
    let deliveryInfo = {};
    let customerName = '--';
    let vehicleName = '--';
    let contractorName = '--';

    const deliveries = [];

    let trip = 1;
    for (let delivery of data) {
      const { id, status, orders } = delivery;

      let drop = 1;
      for (let order of orders) {

        // check if has vehicle
        if (delivery.hasOwnProperty('vehicle')) {
          vehicleName = delivery.vehicle.displayName;
          contractorName = delivery.vehicle.contractorDetails.contractorName;
        }

        // check if has customer details
        if (order.hasOwnProperty('customerDetails')) {
          customerName = order.customerDetails.customerName1;
        }

        deliveryInfo = {
          'deliveryId': id,
          'status': status,
          'orderId': order.orderId,
          'customer': customerName,
          'vehicle': vehicleName,
          'contractor': contractorName,
          'trip': trip,
          'drop': drop,
        };

        drop++;
        deliveries.push(deliveryInfo);
      }

      trip++;
    }

    return deliveries;
  };

  console.log('xxxxx', deliveryData());

  /* Clicking a row in the datatable */
  const onRowClicked = clickedRow => {
    AutoFormControl.setTitle(`Update ${singularName}`);

    for (const field of fields)
    {
      if (field.noDisplay) {
        delete clickedRow[field.name];
      }
    }

    setRecord(clickedRow);

    if (clickedRow)
    {
      if (clickedRow.id !== record.id) {
        SidepanelControl.open();
      } else  {
        SidepanelControl.toggle();
      }
    }
  };

  /* Submitting the form to the API. */
  const submit = async (record, id) => {
    for (const field of fields)
    {
      /* Set the default values for fields that have default values. */
      if (field.default !== undefined) {
        record[field.name] = field.default;
      }

      /* Remove the fields that are not to be sent in the API. */
      if (field.noAPI) {
        delete record[field.name];
      }
    }

    const newData = [ ...data ];
    const { deliveryId, status } = record;
    const recordData = {
      'status': status
    }
    const apiResponse = await apiService.put(`${api}/${deliveryId}`, recordData);

    if(apiResponse) {
      swal("Success", `${singularName} has been updated.`, 'success');
    }

    setData(newData);
    SidepanelControl.close();
  };

  return (
    data.length !== 0 && <>
      <OrdersDatatable
        fields={fields}
        data={deliveryData()}
        onRowSelected={onRowSelected}
        onRowClicked={onRowClicked}
        objectKey={objectKey}
        selectableRows="true"
      />
      <Sidepanel widthPercentage={formSize} onToggle={onSidepanelToggle}>
        {
          <AutoForm
            fields={fields}
            data={record}
            onCancel={() => SidepanelControl.close()}
            onSubmit={submit}
          />
        }
      </Sidepanel>
    </>
  );
}

export default ModuleSummarySchedules;
