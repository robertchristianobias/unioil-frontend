import React , { useState }from 'react';
import Select from 'react-select';
import './css/DatatableSearch.css';
import moment from 'moment'
export function DatatableSplitScreenSearch({ onSearch })
{
console.log("search ",onSearch);
	const status = [
      { value: 'loading', label: 'Loading'},
      { value: 'assigned', label: 'Assigned'}
    ]
     const [ selectedOption, setSelectedOption ] = useState();
     const [ textValue, setTextValue ] = useState();
     
  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    onSearch(selectedOption.value)
  };
  return (
  	<div className="d-flex">
      <div className="d-flex">
        <a href="#" type="button" 
            onClick={ event => onSearch("")}  className="d-block p-2">
            Reset
          </a>
      </div>
  	 	 <div className="d-flex">
  	 	  <input type="date" onChange={ event => onSearch(moment(event.target.value).format('MMMM D, YYYY'))}  className="d-block form-control" placeholder="Search"/>
       
    </div>
  	 <div className="d-flex">
        <Select
          value={selectedOption}
          onChange={handleChange}
          name="select"
          options={status}
          className="form-control-190  p-0 w-100"
          placeholder="Select Status"
         />
    </div>

    <div className="d-flex">
      <input onChange={ event => setTextValue(event.target.value)}  className="d-block form-control" placeholder="Search"/>
      <button className="btn btn-primary datatable-search-button"
        onClick={({ target }) => onSearch(textValue)}>
        <i className="fa fa-search"></i>
      </button>
    </div>
    </div>
  );
}
