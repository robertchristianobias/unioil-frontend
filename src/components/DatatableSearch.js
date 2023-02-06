import React , { useState }from 'react';
import Select from 'react-select';
import './css/DatatableSearch.css';

export function DatatableSearch({ onSearch })
{

const [ textValue, setTextValue ] = useState();

  return (
    <div className="d-flex">
      <input onChange={ event => setTextValue(event.target.value)}  className="d-block form-control" placeholder="Search"/>
      <button className="btn btn-primary datatable-search-button"
        onClick={({ target }) => onSearch(textValue)}>
        <i className="fa fa-search"></i>
      </button>
    </div>
  
  );
}
