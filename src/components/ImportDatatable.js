import React, { useState } from 'react';
import moment from 'moment';

import './css/Datatable.css';

import DataTable from 'react-data-table-component';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';
import memoize from 'memoize-one';
import swal from 'sweetalert';
import { getLogin, logout } from 'helpers';

// import { compareStrings } from 'helpers';
import { Events } from 'helpers/events';
import { alert } from 'helpers';
/* Initialize events for the Datatable */
const DatatableEvents = new Events();

/* Controls for the Datatable */
export const DatatableControl =
{
  /* Clear the selected rows. */
  clearSelection: () => DatatableEvents.trigger('clear'),

  /* Setting the search filter. */
  setSearch: filter => DatatableEvents.trigger('search', filter),
}

/**
 * @typedef DatatableProps
 * @property {[]} fields
 * @property {[]} data
 * @property {string} filter
 * @property {function} onRowClicked
 * @property {function} onRowSelected
 * @property {boolean} clearSelected
 * @property {[]}
 */
/** @param {DatatableProps} */
export function ImportDatatable({ fields, data, onRowClicked, onRowSelected, objectKey ,onRowChecked ,customerfields,productfields})
{
  const [ record, setRecord ] = useState({});
  const [ dataType, setDataType ] = useState({});
  const [ enableImport, setEnableImport ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ orderData, setOrderData ] = useState([]);

  // On customer click
  const onCustomerClick = (clickedRow) => {
    console.log('abcEEEEE');
    AutoFormControl.setTitle(`Update Customer`);

    setDataType('customer');
    //setRecord(clickedRow);
    SidepanelControl.open();
  };

  // On product click
  const onProductClick = () => {
    AutoFormControl.setTitle(`Update Product  `);

    setDataType('product')
    SidepanelControl.open();
  };

  const onSidepanelToggle = isOpened => {
    if(isOpened)
    {
      AutoFormControl.setErrors();
    }
  };

  console.log('record', record);
  const submit = async (record, id) => {}

  // columns = window.innerWidth < 1024? columns.slice(0, 3) : columns;
  const columns = fields
    .filter(({ hidden, noDisplay }) => !hidden && !noDisplay)
    .map(field =>
    ({
      name: field.label,
      selector: field.name,
      sortable: true,
      cell: row =>
      {
        const data = row[field.name];
        const cell =
          field.cell?
            field.cell(data) :
          Array.isArray(data)?
            data.join(', ') :
            data;

        return cell || data;
      }
    }));

  /* Centering first ID column */
  columns[1] =
  {
    name: 'Status',
    sortable: true,
    class: 'status',
    cell: row =>
      <div>{row.message}</div>
  }
  columns[2] =
  {
    name: 'Delivery No',
    sortable: true,
    class: 'delivery-no',
    cell: row =>
      <div>{row.deliveryNo}</div>
  }
  columns[3] =
  {
    name: 'Shipping Point',
    sortable: true,
    cell: row =>
      <div>{row.shippingPoint}</div>
  }
  columns[4] =
  {
    name: 'Customer',
    sortable: true,
    cell: row =>
      <div data-tag="allowRowEvents">
        {
          row.customer === 'Update Customer'
          ? <a type="button" className=" mx-1" onClick={onCustomerClick}>{row.customerCode}</a>
          : row.customer
        }
      </div>
  }
  columns[5] =
  {
    name: 'SAP Line Item',
    sortable: true,
    cell: row =>
      <div>{row.sapLineItem}</div>
  }

  columns[6] =
  {
    name: 'Product',
    sortable: false,
    cell: row =>
      <div>
        {
          row.product === 'Update Product'
            ? <a type="button" className=" mx-1" onClick={onProductClick}>{row.productCode}</a>
            : row.product
        }
      </div>
  }
  columns[7] =
  {
    name: 'Volume',
    sortable: true,
    cell: row =>
      <div>{row.volume}</div>
  }
  columns[8] =
  {
    name: 'Remarks',
    sortable: true,
    cell: row =>
      <div>
        {row.remarks}
      </div>
  }

  let tableData = data;

  if (objectKey in data) {
    tableData = data[objectKey];
  }

  console.log('tableData', tableData);

  /* Handle filtering the data if filter is provided. */
  DatatableEvents.listen('search', filter =>
  {
    console.log('re-implement searching');
    // if(filter && filter.length !== 0)
    //   tableData = data.filter(item =>
    //   {
    //     const conditions = [];
    //     for(const { selector } of columns)
    //     {
    //       if(item[selector] === undefined)
    //         continue;

    //       conditions.push(compareStrings(item[selector], filter));
    //     }

    //     return conditions.some(condition => condition);
    //   });
  });

  /* state for clearing the selected rows. */
  const [ clearSelected, setClearSelected ] = useState();

  /* Handle clearing of the selected rows. */
  DatatableEvents.listen('clear', () => setClearSelected(!clearSelected))

  /* Checkbox component */
  const checkbox = React.forwardRef(({ onClick, ...rest }, ref) =>
  (
    <div className="custom-control custom-checkbox">
      <input
        type="checkbox"
        className="custom-control-input"
        ref={ref}
        {...rest}
      />
      <label className="custom-control-label" onClick={onClick} />
    </div>
  ));

  console.log('cols', columns);

  // Handle selected orders
  const handleSelectedOrder = (state) => {
    const selectedRow = state.selectedRows;

    console.log('selectedRow', selectedRow);

    if (selectedRow.length) {
      setEnableImport(true);

      let arrayId = [];
      let customerCode = [];
      let count = 0;

      selectedRow.map(orders => {
        if (customerCode.includes(orders.customerCode)) {
          customerCode.indexOf(orders.customerCode)
          console.log('same customerCode', orders.customerCode);

          const index = customerCode.indexOf(orders.customerCode)
          const addData = {
            "productCode": orders.productCode,
            "volume": orders.volume,
            "remarks": orders.remarks.replace(/(\r\n|\n|\r)/gm, ""),
          }

          arrayId[index].productDetails.push(addData)
        } else {
          let isnum1 = /^\d*\.?\d+$/.test(orders.orderNo);
          console.log('not same customerCode', orders.customerCode);

          if (isnum1) {
            customerCode.push(orders.customerCode);

            arrayId[count] = {
              'orderId': orders.orderNo,
              'customerCode': orders.customerCode,
              'deliveryId': orders.deliveryNo,
              'shippingPoint': orders.shippingPoint,
              'date': orders.date,
              'productDetails': [{
                'productCode': orders.productCode,
                'volume': orders.volume,
                'remarks': orders.remarks.replace(/(\r\n|\n|\r)/gm, ""),
                'sapLineItem': orders.sapLineItem,
              }],
            };
            count++;
          }
        }
      });
      setOrderData(arrayId);
    } else {
      setEnableImport(false);
    }
  };

  const submitOrder = () => {
    console.log('xxxx: ', orderData);

    const login = getLogin();
    const api = route => `https://api.unioil.thenerds.solutions${route}`;
    const body = JSON.stringify(orderData);
    const orders = [];

    setIsLoading(true);

    fetch(api('/orders/uploadOrders'),
    {
      method: 'POST',
      headers:
      {
        'Authorization': `Bearer ${login}`,
        'Content-Type': 'application/json'
      },
      'body': body
    })
    .then((response) => response.json())
    .then((response) =>
    {
      setIsLoading(false);

      if (response.error) {
        swal("Oops!", "Importing of file failed. Please try again later.", "error");
      } else {
        if (Object.keys(response).length) {
          // Loop through the result
          swal("Success!", "Selected orders are successfully imported", "success");
        } else {
          swal("Oops!", "Invalid csv format. Please check the file if it has the correct format.", "error");
        }
      }
    })
    .catch(error => {
      setIsLoading(false);
      swal("Oops!", "Importing of file failed. Please try again later.", "error");
      console.error(error);
    });
  };

  const checkOrders = (row) => {
    return row.message === 'Duplicate';
  };

  return (
      <div id="orders-imported">
        <h2>Orders Imported</h2>
        <div className="import-button">
          <button
            className="btn btn-sm btn-primary btn-add mx-1"
            disabled={!enableImport}
            onClick={submitOrder}>
            <i className="fa fa-plus mr-1"></i> {isLoading ? "Loading..." : "Import Selected Order/s"}
          </button>
        </div>

        <DataTable
          columns={columns}
          className="import-datatable"
          data={tableData}
          pagination
          noHeader
          striped
          paginationRowsPerPageOptions={[ 10, 20, 50, 100, 300 ]}
          selectableRows="true"
          clearSelectedRows={onRowChecked}
          pointerOnHover
          highlightOnHover
          ignoreRowClick={true}
          onSelectedRowsChange={handleSelectedOrder}
          selectableRowsComponent={checkbox}
          wrap={true}
          selectableRowDisabled={checkOrders}
        />

        <Sidepanel widthPercentage="30" onToggle={onSidepanelToggle}>
          <AutoForm
            fields={dataType === 'customer' ? customerfields : productfields}
            data={record}
            onCancel={() => SidepanelControl.close()}
            onSubmit={submit}
          />
        </Sidepanel>
    </div>
  );
}
