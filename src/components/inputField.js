import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import './css/Module.css';
export function InputField({name,label,type,defaultValue,disabled = false}) {
  const [state, setState] = useState('')
  return (
    <>
      <input type={type}
      value={state === '' ? defaultValue : state} 
      defaultValue={defaultValue}
      name={name}
      disabled={disabled}
      className="form-control mb-2"
      onChange={(e) => setState(e.target.value)} />
    </>
  );
}
export default InputField;