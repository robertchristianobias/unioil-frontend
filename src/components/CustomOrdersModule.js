import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { apiService } from 'services/apiService';
import { OrdersDatatable } from 'components/OrdersDatatable';
import { useDatatableSelection } from 'components/hooks/useDatatableSelection';

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
export function CustomOrdersModule(
{
  name,
  fields,
  api,
  objectKey,
})
{
  /* State for the module's data */
  const [ data, setData ] = useState([]);

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

  console.log('orderData', data);
  // Assemble order data
  const ordersData = () => {
    const orders = [];

    for (let order of data) {
      let orderInfo = {};
      let customerName = '';
      let productName = '';

      if (order.hasOwnProperty('customer')) {
        const { customer } = order;

        if (customer !== null) {
          if (customer.hasOwnProperty('customerName1')) {
            customerName = customer.customerName1;
          } else {
            customerName = '---';
          }
        } else {
          customerName = '---';
        }
      } else {
        customerName = '---';
      }

      // Loop through productDetails
      if (order.hasOwnProperty('productDetails')) {
        const { productDetails } = order;

        for (let productData of productDetails) {
          const { product } = productData;
          if(product.hasOwnProperty('shortDescription')) {
            productName = product.shortDescription;
          } else {
            productName = '---';
          }

          orderInfo = {
            "status": order.status,
            "orderId": order.orderId,
            'deliveryNo': order.deliveryNo,
            'shipmentNo': order.shippingPoint,
            "customer": customerName,
            'sapLineNo': order.sapLineItem,
            "date": moment(order.createdAt).format('MMMM D, YYYY'),
            "product": productName,
            "remarks": product.remarks,
            "volume": product.volume,
          };

          orders.push(orderInfo);
        }
      }

    }

    return orders;
  };

  /* Clicking a row in the datatable */
  const onRowClicked = clickedRow => {
    console.log(clickedRow, 'row is clicked');
  };

  return (
    data.length !== 0 && <>
      <OrdersDatatable
        fields={fields}
        data={ordersData()}
        onRowSelected={onRowSelected}
        onRowClicked={onRowClicked}
        objectKey={objectKey}
        selectableRows="true"
      />
    </>
  );
}

export default CustomOrdersModule;
