import React , { useState }from 'react';
import Select from 'react-select';
import './css/DatatableSearch.css';
import moment from 'moment'
export function DatatableDriverWorkingHoursSearch({ onSearch,choices })
{
console.log("search ",onSearch);
	const status = choices;
     const [ selectedOption, setSelectedOption ] = useState();
     const [ textValue, setTextValue ] = useState();
     
  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    onSearch(selectedOption.value)
  };
  return (
  
  <>	 	
  	 <div className="d-flex">
        <Select
          value={selectedOption}
          onChange={handleChange}
          name="select"
          options={status}
          className="form-control  p-0 w-100"
          placeholder="Select Hauler"
         />
    </div>
    </>
  );
}
