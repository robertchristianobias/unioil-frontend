import React, { useState,useRef,useEffect } from 'react';

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
export function DatatableDatatableDriverWorkingHours({ fields, data, onRowClicked, onRowSelected, objectKey ,onRowChecked,apimodule })
{
  // columns = window.innerWidth < 1024? columns.slice(0, 3) : columns;
  const [selectedData, setSelectedData] = useState();
  const [inputList, setInputList] = useState([{ dutyType: "", workingHoursStart: "" ,workingHoursEnd: ""}]);

  const formRef = useRef();
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
      console.log('click')
    }
  }, []);

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
   
  columns[2] =
  {
    name: 'Duty Type',
    sortable: true,
    cell: (row, index )=>
       <div> 
           <select name="dutyType" className="form-control" onChange={ e => handleCellChange(e.target.value,index,e.target.name) }  >
             <option value="">---</option>
           { row.dutyType == "onDuty" ?   <option value="onDuty" selected >On Duty</option>  :  <option value="onDuty"  >On Duty</option>}
           { row.dutyType == "offDuty" ?   <option value="offDuty" selected >Off Duty</option>  :  <option value="offDuty"  >Off Duty</option>}
 
           </select>
           </div>

  }
  columns[3] =
  {
    name: 'Working Hours',
    sortable: true,
    cell: (row, index ) =>

       <div> 
          <input onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.workingHoursStart.slice(0, -4)}   className="form-control" name="workingHoursStart" type="time" />
      </div>

  }
  columns[4] =
  {
    name: 'Shift Rest Hours',
    sortable: true,
    cell:(row, index ) =>

    <div> 
    <input onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.workingHoursEnd.slice(0, -4)}    className="form-control" name="workingHoursEnd" type="time" />
</div>

  }
  columns[5] =
  {
    name: 'Driving Hours',
    sortable: true,
    cell: (row, index )=>

       <div> 
           <input  onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.drivingHours} className="form-control" name="drivingHours" type="number" />
           </div>

  }
  columns[6] =
  {
    name: 'After Duty Rest',
    sortable: true,
    cell:  (row, index ) =>

       <div> 
           <input   onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.afterDutyRest} className="form-control" name="afterDutyRest" type="time" />
           </div>

  }
  columns[7] =
  {
    name: 'Excess Working Hour Reason',
    sortable: true,
    cell: (row, index )=>

       <div> 
         {/* <select className="form-control">
            <option>--</option>
            <option>Heavy Traffic</option>
               
           </select> */}
           <input  onChange={ e => handleCellChange(e.target.value,index,e.target.name) } defaultValue={row.excessWorkingHourReason}  className="form-control" name="excessWorkingHourReason" type="text" />
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
        className="custom-control-input yes"
        ref={ref}
        {...rest}
        // defaultChecked={true}
        // checked={true}
      />
      <label className="custom-control-label" onClick={onClick} ref={inputRef} />
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
    console.log("local---",);
    //const objIndex = JSON.parse(localStorage.getItem('selectedData'));
    //console.log("selectedData",objIndex);
  }
  const rowSelectCritera = row => row.date.length >= 0;
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
      className={apimodule == '/customers' ? "customers-datatable": "contractors-datatable"}
      paginationRowsPerPageOptions={[ 10, 20, 50, 100, 300 ]}
      selectableRows="true"
      clearSelectedRows={onRowChecked}
      pointerOnHover
      highlightOnHover
      defaultSortField={columns[0].selector}
      onRowClicked={data => onRowClicked(data)}
      //onSelectedRowsChange={onRowSelected}
      onSelectedRowsChange={handleChange}
      selectableRowsComponent={checkbox}
      selectableRowSelected={rowSelectCritera}
    />
  );
}
