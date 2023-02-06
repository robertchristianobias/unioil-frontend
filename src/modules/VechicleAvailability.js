import React, { useRef, useState, useEffect, forwardRef } from "react";
import moment from 'moment';
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import OpenInNewOutlinedIcon from '@material-ui/icons/OpenInNewOutlined';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import DatePicker from 'react-date-picker';
import { getTransports, updateTransport } from 'services/apiCalls';

const VechicleAvailability = () =>{
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Link: forwardRef((props, ref) =><OpenInNewOutlinedIcon {...props} ref={ref}/>)

};
  /** @type {{ current: HTMLFormElement }} */
  const formRef = useRef();
  const [schedId, setSchedId] = useState();
  const [vehicles, setVehicles] = useState();
  const [selectedDate, setSelectedDate] =useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadVehicles(selectedDate);
  };

  const columns = [
    {title:"ID", field:"id", hidden:true},
    {title:"Contractor", field:"vehicle.containerName", editable:"never"},
    {title:"Display Name", field:"vehicle.displayName", editable:"never"},
    {title:"Tractor Plate", field:"vehicle.tractorPlate", editable:"never"},
    {title:"Plant", field:"vehicle.plant", editable:"never"},
    {title:"Availability", field:"availability", 
      lookup:{available:"Available", notAvailable:"Not Available", phasedOut:"Phased Out", spare:"Spare"}}
  ];
  const token = localStorage.getItem('bG9naW4=');
  const loadVehicles = (date) => {
    getTransports(token, moment(date).format('yyyy-MM-DD')).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
          console.log("vehicles: ", data[0].vehicle);
          console.log("Schedule ID: ", data[0]._id);
          setSchedId(data[0]._id);
          setVehicles(data[0].vehicle);
        }
    });
  };
  const updateVehicle = (changes) => {
    console.log("Vehicle Changes: ", changes);
    updateTransport(schedId, changes,token).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
          /*
          const dataUpdate = [...vehicles];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setVehicles([...dataUpdate]);  
          */
         console.log("Update response: ", data);
        }
    });
  };
  useEffect(() => {
    loadVehicles(selectedDate);
  }, []);
  console.log("Selected date outside: ", selectedDate);
  return (
    <div className="d-flex flex-column h-100">
      <form className="flex-fill  px-4 py-1" ref={formRef}>
        <div className="tablerow">
        <DatePicker
                      name="vehicleDate"
                      onChange={handleDateChange}
                      value={selectedDate}
                      className="form-control"
                    />
        
        </div>
      </form>
      
      <MaterialTable icons={tableIcons}
      title="Vehicle Availability"
      data={vehicles} columns={columns} 
      options={{ search: true, paging: true, filtering: true, 
        pageSize:10, pageSizeOptions:[10,20,30],
        exportButton: true, selection: false, actionsColumnIndex: -1}}  
      editable={{
        onBulkUpdate: (selectedRows) =>
          new Promise((resolve, reject) => {
            const rows = Object.values(selectedRows);
            const updatedRows = [...vehicles]
            const req = [];
            rows.map(emp=>{
              const index = emp.oldData.tableData.id
              updatedRows[index]=emp.newData
              req[index] = {
                vehicle : emp.newData.vehicle._id,
                availability : emp.newData.availability
              }
            })
            console.log("Updated Row: ", updatedRows);
            setVehicles(updatedRows);
            setTimeout(() => {
            updateVehicle(req);

            resolve();
          }, 1000)
      })
      }}     
      />
    </div>
    
      

  )
};
export default VechicleAvailability;
