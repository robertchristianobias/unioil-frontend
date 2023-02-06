import React, { useState, useEffect} from 'react';

import { apiService } from 'services/apiService';
import { SidepanelSize } from 'components/Sidepanel';
const CustomOrdersModule = React.lazy(() => import('components/CustomOrdersModule'));

async function getData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.customerName1 });
  });

  return choices;
};

async function getProductData(api) {
  const response = await apiService.get(api);
  const choices = [];

  Object.entries(response).forEach(([key, value]) => {
    choices.push({ 'value': value.id, 'label': value.productDescription });
  });

  return choices;
};

export function Orders() {
  const [ choices, setChoices ] = useState([]);
  const [ productChoices, setProductChoices ] = useState([]);
  useEffect(() =>
  {
    (async () =>
    {
      const choicesData = await getData('/customers');
      setChoices(choicesData);
      const ProductChoicesData = await getProductData('/products');
      setProductChoices(ProductChoicesData);
    })();
  }, []);

  const fields = [
      {
        name: 'status',
        label: 'status',
      },
      {
        name: 'orderId',
        label: 'Order No',
      },
      {
        name: 'deliveryNo',
        label: 'Delivery No',
      },
      {
        name: 'shipmentNo',
        label: 'Shipment Point',
      },
      {
        name: 'customer',
        label: 'Customer Name',
      },
      {
        name: 'sapLineNo',
        label: 'SAP Line'
      },
      {
        name: 'date',
        label: 'Date',
      },
      {
        name: 'product',
        label: 'Product Name',
      },
      {
        name: 'volume',
        label: 'Volume',
      },
      {
        name: 'remarks',
        label: 'Remarks',
      }
    ];

    return (
      <CustomOrdersModule
        name="Orders"
        singularName="Order"
        formSize={SidepanelSize.small}
        fields={fields}
        api="/orders?_sort=createdAt:DESC"
      />
    );
  }

export default Orders;
