import React, { useState, useEffect } from 'react';

import './css/Module.css';


import { apiService } from 'services/apiService';
import { alert } from 'helpers';

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
export function HaulersModule(
{
  name,
  singularName,
  customSidepanelContent,
  api,
  objectKey,
  sortBy,
})
{
  /* State for the module's data */
  const [ data, setData ] = useState([]);


  /* Effect for getting the data from the API. */
  useEffect(() =>
  {
    async function getData()
    {

      const apiResponse = await apiService.get(`/contractors/${localStorage.getItem('contractor')}`);
      console.log(apiResponse);
      console.log('useEffect', apiResponse);

      

      setData(apiResponse);
    }
    getData();
  }, [ api, name ]);





  
  return (
    <>
 <div className="card ">
  <div className="card-body">
  <p className="font-weight-bold">Contractor Code: <span className="font-weight-light"> {data.contractorCode}</span> </p>
  <p className="font-weight-bold">Contractor Name: <span className="font-weight-light"> {data.contractorName}</span> </p>

<p className="font-weight-bold">Drivers:</p>
    <div className="col-3">
    <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
              { data.drivers  ?data.drivers.map(obj => {
                        return (
                            <tr key={ obj.driverLastName }>
                            <td>{ obj.driverFirstName } { obj.driverLastName }</td>
                            <td>{ obj.driverCode } </td>
                            </tr>
                        );
                        }) : ""
                    } 
              </tbody>
            </table>
    </div>

    <p className="font-weight-bold">Vehicles:</p>
    <div className="col-4">
    <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Display Name</th>
                  <th>Total Capacity</th>
                  <th>Dead Freight Volume</th>
                  <th>GPS Equip</th>
                  <th>Pump Available</th>
                </tr>
              </thead>
              <tbody>
              { data.vehicles  ? data.vehicles.map(obj => {
                        return (
                            <tr>
                            <td>{ obj.displayName }</td>
                            <td>{ obj.totalCapacity }</td>
                            <td>{ obj.deadFreightVol } </td>
                            <td>{ obj.gpsEquip ? "Yes" : "No"} </td>
                            <td>{ obj.pumpAvail ? "Yes" : "No"}</td>
                            </tr>
                        );
                        }) 
                        : ""
                    }
              </tbody>
            </table>
    </div>

  </div>
</div>
      
    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default HaulersModule;
