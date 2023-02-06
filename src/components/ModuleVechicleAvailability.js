import React, { useState, useEffect } from 'react';

import './css/Module.css';

import { Datatable, DatatableControl } from 'components/Datatable';
import { DatatableVechicleAvailability } from 'components/DatatableVechicleAvailability';
import { VehiclesDatatable } from 'components/VehiclesDatatable';
import { DriversDatatable } from 'components/DriversDatatable';
import { useDatatableSelection } from 'components/hooks/useDatatableSelection';

import { Modal, ModalControl } from 'components/Modal';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';

import { DatatableDriverWorkingHoursSearch } from 'components/DatatableDriverWorkingHoursSearch';

import { apiService } from 'services/apiService';
import { apiCustomService } from 'services/apiCustomService';
import { alert } from 'helpers';
import swal from 'sweetalert';

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
export function ModuleVechicleAvailability(
{
  name,
  singularName,
  formSize,
  customSidepanelContent,
  fields,
  api,
  objectKey,
  sortBy,
  choices,
})
{
  /* State for the module's data */
  const [ data, setData ] = useState([]);
  const [ tempData, setTempData ] = useState([]);
  /* States for the usage of the AutoForm component. */
  const [ record, setRecord ] = useState({});

  const [ isLoading, setIsLoading ] = useState(false);

  /* Selection of the rows of the table  */
  const { selectedRows, setSelectedRows, onRowSelected } = useDatatableSelection();
  const [ dateValue, setDateValue ] = useState({});
  /* Effect for getting the data from the API. */
  useEffect(() =>
  {
    async function getData()
    {

      const apiResponse = await apiService.get(`/contractors${sortBy}`);
      console.log(apiResponse);
      console.log('useEffect', apiResponse);

      // if(!apiResponse.success)
      //   return alert.error(apiResponse.message || `Cannot get the ${name}. An error occurred.`);

      // for(const record of apiResponse.data)
      // {
      //   for(const { name, modifyData } of fields)
      //   {
      //     if(modifyData)
      //       record[name] = modifyData(record, apiResponse.data);
      //   }
      // }

      setTempData(apiResponse);
    }
    getData();
  }, [ api, name ]);

  /* Listen for Sidepanel toggling. */
  const onSidepanelToggle = isOpened =>
  {
    if(isOpened)
    {
      alert.closeAll();
      AutoFormControl.setErrors();
    }
  };

  /* Pressing the add button */
  const onAdd = () =>
  {
    setRecord({}); /* Reset the record in the sidepanel. */
    AutoFormControl.setTitle(`Add ${singularName}`);
    SidepanelControl.open();
  };

  /* Clicking a row in the datatable */
  const onRowClicked = clickedRow =>
  {
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

  const onCellClicked = clickedRow =>
  {
    console.log('cell is clicked');
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
    setIsLoading(true);

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
    if (!id)
    {
      if(api == '/orders')
      {
        const { deliveryId, shipmentId, customers, product_code, remarks } = record;
        const orderData = {
          "orderID": deliveryId,
          "customer": {
            "_id": customers
          },
          "products": [
            {
              "_id": product_code
            }
          ],
          "remarks": remarks,
          "shipmentId": shipmentId,
        };

        const apiResponse = await apiService.post(`${api}`, orderData);

          if(!apiResponse.success)
        {
            AutoFormControl.setErrors(apiResponse.errors);
            return alert.error(apiResponse.message ||  `Cannot add ${singularName}. An error occurred.`);
         }

          newData.push(apiResponse.data);
         return alert.success(`${singularName} has been saved.`);
      }

      const apiResponse = await apiService.post(`${api}`, record);

      if (apiResponse.success == false) {
        swal("Error", `Cannot update ${singularName}. An error occurred.`, "error");
      } else {
        // newData.push(apiResponse);
        swal("Success", `${singularName} has been saved.`, "success");
      }
    }
    else
    {
      //const recordIndex = data.findIndex(data => data._id === id);
      const apiResponse = await apiService.put(`${api}/${id}`, record);

      if (apiResponse.success == false) {
        swal("Error", `Cannot update ${singularName}. An error occurred.`, "error");
      } else {
        // newData[recordIndex] = apiResponse;
        swal("Success", `${singularName} has been updated.`, 'success');
      }
    }

    setData(newData);
    setIsLoading(false);
    SidepanelControl.close();
  };

  /* Clicking confirm on the delete modal and deleting the selected rows. */
  const onDelete = async () =>
  {
    ModalControl.close();
    DatatableControl.clearSelection();

    if(selectedRows.length > 1) {
      return alert.warning('Multiple deletes are not supported by the API yet.') //TODO: Implement in API.
    }

    const apiResponse = await apiService.delete(`${api}/delete`, selectedRows[0].id);
    if(!apiResponse.success) {
      return alert.error(apiResponse.message || `Cannot delete ${singularName}. An error occurred.`);
    }

    alert.success(`${selectedRows.length > 1?
      `${name} have` : `${singularName} has`} been deleted.`);

    const newData = data.filter(item => !selectedRows
      .some(({ id }) => item.id === id));

    setData(newData);
    setSelectedRows([]);
  };
const onSearch = async (d) =>
{

 
 //const res = await apiService.get(`/contractors`);
  const res = await apiService.get(`/vehicles?contractor=${d}`);
         let fil =  tempData.filter(item => item.id === d);
        console.log("contractor",res)
        let filteredData = [];
        let vehiclesData = [];
        for(let vehicles of res)
        {
          
          if(vehicles.vehicleAvailability.length > 0)
          {
           for(let vehicle of vehicles.vehicleAvailability)
            {
             
              if(vehicle.date === dateValue)
              {
                filteredData = {
                  'contractorName' : vehicles.contractor.contractorName,
                  'deliveryDate' : vehicle.date,
                  'vehicleName': vehicles.displayName,
                  'plant' : vehicle.plant,
                  'availability' : vehicle.isAvailable,
                  'shift' : vehicle.shift,
                  'start' : vehicle.start,
                  'end' : vehicle.end,
                  'vechicleId': vehicles.id,
                  "unavailableReason" : vehicle.unavailableReason
                }      
               
                vehiclesData.push(filteredData);
              }
                 
               
            }
          }
            
        }

       
        setData(vehiclesData);
}


const handleButtonClick = async () => {

  const modData = JSON.parse(localStorage.getItem('selectedData'));
    console.log("selectedData",modData);
    
    let vdata = [];
    for(let v of modData)
    {

      let s = v.start.length === 5 ?   v.start +":00.000" :  v.start ;
      let e =  v.end.length === 5 ? v.end +":00.000":v.end ;
      vdata.push({
        "date" : `${v.deliveryDate}`,
        "start": s,
        "end": e,
        "shift": `${v.shift}`,
        "isAvailable": v.availability,
        "unavailableReason": v.unavailableReason,

      })
      let vehicle_data = {
        "vehicleAvailability": vdata
      };
      const apiResponse = await apiService.put(`/vehicles/${v.vechicleId}`, vehicle_data);
      console.log("api",`drivers/${v.vechicleId}`, vehicle_data)
      console.log("selectedData---",apiResponse);
    }
         
    swal("Success", `Vehicles Availability has been updated.`, 'success'); 
    setInterval(() => window.location.reload(), 2000);        
}

  return (
    <>
      <div className="datatable-header  align-items-center justify-content-between w-20 col-2">
      <input className="form-control " type="date" onChange={ event => setDateValue(event.target.value)}/>
        <DatatableDriverWorkingHoursSearch className="search" choices={choices}  onSearch={onSearch} />
      </div>
     
                <DatatableVechicleAvailability
                fields={fields}
                data={data}
                onRowSelected={onRowSelected}
                onRowClicked={onRowClicked}
                objectKey={objectKey}
                apimodule={api}
                selectableRows="true"
              />
      <div>
      <button className="btn btn-sm btn-primary mx-1" onClick={handleButtonClick}>
            <i className="fa fa-save mr-1"></i> Update 
        </button>
        </div>
       


      <Sidepanel widthPercentage={formSize} onToggle={onSidepanelToggle}>
        {
          customSidepanelContent ||
          <AutoForm
            fields={fields}
            data={record}
            onCancel={() => SidepanelControl.close()}
            onSubmit={submit}
            isLoading={isLoading}
          />
        }
      </Sidepanel>

      <Modal
        title={`Delete ${selectedRows.length > 1? name : singularName}`}
        body=
        {
          <>
            {'Are you sure you want to delete '}
            {
              selectedRows.length === (data? data.length : 0)?
                `all ${name}?` :
              selectedRows.length === 1?
                `this ${singularName}?` : `the following ${name}?`
            }
            {
              (selectedRows.length !== (data? data.length : 0) && selectedRows.length > 1) &&
              <ul>
                {selectedRows.map(({ id }, i) =>
                  <li key={i}>{singularName} {id}</li>)}
              </ul>
            }
          </>
        }
        confirmButtonText={<><i className="fa fa-disk mr-1"></i>Delete</>}
        confirmButtonClass="btn-warning"
        onConfirm={onDelete}
      />
    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default ModuleVechicleAvailability;
