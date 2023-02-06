import React, { useState } from 'react';

import './css/Datatable.css';
import classes from './SplitScreen.module.css';

import DataTable from 'react-data-table-component';

// import { compareStrings } from 'helpers';
import { Events } from 'helpers/events';

/* Initialize events for the Datatable */
const DatatableEvents = new Events();

/* Controls for the Datatable */
export const DatatableCustomControl =
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
export function DeliveriesDatatable({ fields, data, onRowClicked, onRowSelected, onSchedRowSelected, objectKey, onRowChecked }) {
  // columns = window.innerWidth < 1024? columns.slice(0, 3) : columns;
  const [dataTableDeliveryData, setDataTableDeliveryData] = useState(data);


  const columns = fields
    .filter(({ hidden, noDisplay }) => !hidden && !noDisplay)
    .map(field =>
    ({
      name: field.label,
      selector: field.name,
      sortable: true,
      cell: row => {
        const data = row[field.name];
        const cell =
          field.cell ?
            field.cell(data) :
            Array.isArray(data) ?
              data.join(', ') :
              data;

        return data;
      }
    }));
  /* Centering first ID column */
  columns[0].center = true;


  // columns[4] =
  // {
  //   name: 'Product Name',
  //   sortable: true,
  //   cell: row =>

  //      <div>  { row.products ? row.products.productDescription  : '---' }</div>

  // }


  let tableData = data;

  if (objectKey in data) {
    tableData = data[objectKey];
  }

  /* Handle filtering the data if filter is provided. */
  DatatableEvents.listen('search', filter => {

    // if(filter && filter.length !== 0)
    console.log(filter)
    let datSearch = data.filter(item => item.date.toLowerCase() == filter.toLowerCase() || item.status.toLowerCase() == filter.toLowerCase())
    if (datSearch.length > 0) {
      setDataTableDeliveryData(datSearch)
    }
    else {
      let tableData = data.filter(item => {
        const conditions = [];
        for (const { selector } of columns) {
          if (item[selector] === undefined)
            continue;
          let dataString = item[selector].toString().toLowerCase();

          if (dataString.includes(filter.toLowerCase())) {
            conditions.push(item);
          }
          // 

        }

        return conditions.some(condition => condition);
      });
      setDataTableDeliveryData(tableData)
    }





  });

  /* state for clearing the selected rows. */
  const [clearSelected, setClearSelected] = useState();

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

  return (
    /**
      * Check https://github.com/jbetancur/react-data-table-component
      * for reference on the DataTable component.
      */
    <DataTable
      columns={columns}
      data={dataTableDeliveryData}
      className={`vehicles-datatable ${classes.splitScreenTable}`}
      pagination
      noHeader
      striped
      paginationRowsPerPageOptions={[10, 20, 50, 100, 300]}
      selectableRows="true"
      clearSelectedRows={onRowChecked}
      pointerOnHover
      highlightOnHover
      defaultSortField={columns[0].selector}

      onSelectedRowsChange={onRowSelected}
      selectableRowsComponent={checkbox}

    />
  );
}
