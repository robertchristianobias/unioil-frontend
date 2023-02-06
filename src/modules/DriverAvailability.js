import React, { useRef, useState, useEffect, forwardRef } from "react";
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
import { getDriversAvailability, updateDriverSched } from 'services/apiCalls';
import moment from "moment";

const DriverAvailability = () =>{
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
  const [drivers, setDrivers] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadDrivers(startDate);
  };

  const columns = [
    {title:"ID", field:"id", hidden:true},
    {title:"Driver First Name", field:"driver.driverFirstName", editable:"never"},
    {title:"Driver Last Name", field:"driver.driverLastName", editable:"never"},
    {title:"Duty Type", field:"dutyType", 
      lookup:{onDuty:"On Duty", offDuty:"Off Duty"}},
    {title:"Working Hours Start", field:"workingHoursStart", type:'numeric'},
    {title:"Shift Rest Hours", field:"shiftRestHours"},
    {title:"Driving Hours", field:"drivingHours"},
    {title:"After Duty Rest", field:"afterDutyRest"},
    {title:"Working Hours Start", field:"workingHoursStart"},
    {title:"Working Hours End", field:"workingHoursEnd"},
    {title:"Excess Working Hour reason", field:"excessWorkingHourReason"},
    
  ];
  const token = localStorage.getItem('bG9naW4=');
  const loadDrivers = (date) => {
    getDriversAvailability(token, moment(date).format('yyyy-MM-DD')).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
          console.log("Drivers data: ", data[0]);
          console.log("Schedule ID: ", data[0]._id);
          setSchedId(data[0]._id);
          setDrivers(data[0].schedule);
        }
    });
  };
  const updateDriver = (changes) => {
    console.log("Driver Changes: ", changes);
    updateDriverSched(schedId, changes,token).then(data => {
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
    loadDrivers(startDate);
  }, []);
  return (
    <div className="d-flex flex-column h-100">
      <form className="flex-fill  px-4 py-1" ref={formRef}>
        <div className="tablerow">
        <DatePicker
                      name="driverScheduleDate"
                      onChange={handleDateChange}
                      value={startDate}
                      className="form-control"
                    />
        </div>
      </form>
      
      <MaterialTable icons={tableIcons}
      title="Driver Availability"
      data={drivers} columns={columns} 
      options={{ search: true, paging: true, filtering: true, 
        pageSize:10, pageSizeOptions:[10,20,30],
      exportButton: true, selection: false, actionsColumnIndex: -1}}  
      editable={{
        onBulkUpdate: (selectedRows) =>
        new Promise((resolve, reject) => {
          const rows = Object.values(selectedRows);
          const updatedRows = [...drivers]
          rows.map(emp=>{
            const index = emp.oldData.tableData.id
            updatedRows[index]=emp.newData
          })
          console.log("Updated Row: ", updatedRows);
          setDrivers(updatedRows);
          setTimeout(() => {
          updateDriver(updatedRows);

          resolve();
        }, 1000)
      })
      }}     
      />
    </div>
    
      

  )
};
export default DriverAvailability;
