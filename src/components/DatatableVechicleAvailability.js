import React, { useState } from 'react';

import './css/Datatable.css';
import moment from 'moment';
import DataTable from 'react-data-table-component';

// import { compareStrings } from 'helpers';
import { Events } from 'helpers/events';

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
export function DatatableVechicleAvailability({ fields, data, onRowClicked, onRowSelected, objectKey ,onRowChecked,apimodule })
{
  const [selectedData, setSelectedData] = useState();
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
  columns[0].center = true;
   
    columns[4] =
    {
    name: 'Available',
    sortable: true,
    cell: (row ,index)=>
        <div> 
        <select name="availability" className="form-control" onChange={ e => handleCellChange(e.target.value,index,e.target.name) }  >
             <option value="">---</option>
           { row.availability === true ?   <option value="true" selected >Available</option>  :  <option value="true"  >Available</option>}
           { row.availability ===  false ?   <option value="false" selected >Unavailable</option>  :  <option value="false"  >Unavailable</option>}
 
           </select>
            </div>

    }
    columns[5] =
    {
    name: 'Shift',
    sortable: true,
    cell: (row ,index)=>
        <div> 
        <select name="shift" className="form-control" onChange={ e => handleCellChange(e.target.value,index,e.target.name) }  >
             <option value="">---</option>
           { row.shift === "single" ?   <option value="single" selected >Single</option>  :  <option value="single"  >Single</option>}
           { row.shift ===  "double" ?   <option value="double" selected >Double</option>  :  <option value="double"  >Double</option>}
 
           </select>
            </div>

    }
  columns[6] =
  {
    name: 'Start',
    sortable: true,
    cell:  (row ,index) =>

       <div> 
          <input onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.start.slice(0, -4)}    className="form-control" name="start" type="time" />
      </div>

  }
  columns[7] =
  {
    name: 'End',
    sortable: true,
    cell:  (row ,index) =>

    <div>  
      <input onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.end.slice(0, -4)}    className="form-control" name="end" type="time" />
</div>

  }
//   columns[5] =
//   {
//     name: 'Driving Hours',
//     sortable: true,
//     cell: row =>

//        <div> 
//            <input  className="form-control" name="dh[]" type="time" />
//            </div>

//   }
//   columns[6] =
//   {
//     name: 'AFter Duty Rest',
//     sortable: true,
//     cell: row =>

//        <div> 
//            <input  className="form-control" name="adr[]" type="time" />
//            </div>

//   }
  columns[8] =
  {
    name: 'UnAvail Remarks',
    sortable: true,
    cell: (row ,index) =>

       <div> 
  
           <input  onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.unavailableReason} className="form-control" name="unavailableReason" type="text" />
           </div>

  }
  let tableData = data;

  if (objectKey in data) {
    tableData = data[objectKey];
  }

  /* Handle filtering the data if filter is provided. */
  DatatableEvents.listen('search', filter =>
  {
    console.log(filter);
    if(filter && filter.length !== 0)
      tableData = data.filter(item =>
      {
        const conditions = [];
        for(const { selector } of columns)
        {
          if(item[selector] === undefined)
            continue;
       console.log( item[selector] , ' ---',filter)
          //conditions.push(compareStrings(item[selector], filter));
        }

        return conditions.some(condition => condition);
      });
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
  const handleChange = (state) => {
    setSelectedData(state.selectedRows);
    console.log("selectedData",selectedData);
  };
  const handleCellChange = (v,i,n) =>
  {
     const evt =  selectedData[i][n] = v;
    setSelectedData(selectedData)
    

    localStorage.setItem('selectedData',JSON.stringify(selectedData));
    console.log("local---",v,i,n);
    //const objIndex = JSON.parse(localStorage.getItem('selectedData'));
    console.log("selectedData",selectedData);
  }
  const rowSelectCritera = row => row.deliveryDate.length >= 0;
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
      
      paginationRowsPerPageOptions={[ 10, 20, 50, 100, 300 ]}
      selectableRows="true"
      clearSelectedRows={onRowChecked}
      pointerOnHover
      highlightOnHover
      defaultSortField={columns[0].selector}
      //onRowClicked={data => onRowClicked(data)}
      onSelectedRowsChange={handleChange}
      selectableRowsComponent={checkbox}
      selectableRowSelected={rowSelectCritera}
    />
  );
}
