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
export function CustomersModule(
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

  /* States for the usage of the AutoForm component. */
  const [ record, setRecord ] = useState({});

  const [ isLoading, setIsLoading ] = useState(false);


  /* Effect for getting the data from the API. */
  useEffect(() =>
  {
    async function getData()
    {

      const apiResponse = await apiService.get(`/customers/${localStorage.getItem('customer')}`);
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
  <p className="font-weight-bold">Customer Code: <span className="font-weight-light"> {data.customerCode}</span> </p>
  <p className="font-weight-bold">Customer Name: <span className="font-weight-light"> {data.customerName1}</span> </p>
  <p className="font-weight-bold">Street: <span className="font-weight-light"> {data.street}</span> </p>
  <p className="font-weight-bold">City: <span className="font-weight-light"> {data.city}</span> </p>
  <p className="font-weight-bold">District: <span className="font-weight-light"> {data.district}</span> </p>
  <p className="font-weight-bold">Zone: <span className="font-weight-light"> {data.zone}</span> </p>
  </div>
</div>
      
    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default CustomersModule;
