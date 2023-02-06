import React, { useState,useEffect } from 'react';

import './css/Datatable.css';

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
export function CustomScheduleDatatable({ fields, datasched, onRowClicked, onSchedRowSelected, objectKey ,onRowChecked })
{

 
  // columns = window.innerWidth < 1024? columns.slice(0, 3) : columns;
  const [dataTableData, setDataTableData ] =  useState([...datasched]);


 useEffect(() => {
    setDataTableData(datasched)
  }, [])


  const columns = fields
    .filter(({ hidden, noDisplay }) => !hidden && !noDisplay)
    .map(field =>
    ({
      name: field.label,
      selector: field.name,
      sortable: true,
      cell: row =>
      {
        const datasched = row[field.name];
        const cell =
          field.cell?
            field.cell(datasched) :
          Array.isArray(datasched)?
            datasched.join(', ') :
            datasched;

        return  datasched;
      }
    }));
  /* Centering first ID column */
  columns[0].center = true;

   let tableData = datasched;

    if (objectKey in datasched) {
      tableData = datasched[objectKey];
    }


  /* Handle filtering the data if filter is provided. */
  DatatableEvents.listen('search', filter =>
  {

     let tableData = datasched.filter(item =>
      {
        const conditions = [];
        let count = 0
        for(const { selector } of columns)
        {
           
          if(item[selector] === undefined)
            continue;
     
         
          if(item[selector] === filter)
          {
           
            conditions.push(item); 
         
          }
          
            count++
        }
       
        return conditions.some(condition => condition);
      });
      setDataTableData(tableData)
  });
  /* state for clearing the selected rows. */
  const [ clearSelected, setClearSelected ] = useState();
  /* Handle clearing of the selected rows. */
  DatatableEvents.listen('clear', () => setClearSelected(!clearSelected))
  /* Expandable Row component */
  const Expand = ({ data }) =>
  {
    const expandFields = fields
      .filter(({ hidden }) => hidden)
      .map(({ name, label }, i) =>
        <div key={i} className="expand-item py-2">
          <span className="font-weight-bold mr-4">{label}</span>
          <span>{data[name]}</span>
        </div>)
    return <div className="p-2 pl-3">{expandFields}</div>;
  };
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
      data={tableData}
      pagination
      noHeader
      striped
      className="vehicles-datatable"
      paginationRowsPerPageOptions={[ 10, 20, 50, 100, 300 ]}
      selectableRows="true"
      clearSelectedRows={onRowChecked}
      pointerOnHover
      highlightOnHover
      defaultSortField={columns[0].selector}
      //onRowClicked={data => onRowClicked(data)}
      onSelectedRowsChange={onSchedRowSelected}
      selectableRowsComponent={checkbox}
    />
  );
}
