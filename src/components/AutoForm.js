import React, { useRef, useEffect, useState } from 'react';

import DatePicker from 'react-date-picker';
import DateTimePicker from 'react-datetime-picker';
import { Events } from 'helpers/events';
import { RichTextArea } from 'components/RichTextArea';
import Select from 'react-select';
import tinymce from 'tinymce';

/* Initialize the events for the AutoForm */
const AutoFormEvents = new Events();

/* Controls for the AutoForm */
export const AutoFormControl =
{
  /* Set the AutoForm title */
  setTitle: title => AutoFormEvents.trigger('title', title),

  /* Set errors to the AutoForm */
  setErrors: errors => AutoFormEvents.trigger('errors', errors),

  /* Clear errors */
  clearErrors: () => AutoFormEvents.trigger('errors'),
}

export function AutoForm({
  fields = [],
  data = {},
  title: initialTitle,
  onSubmit = () => {},
  onCancel = () => {},
  selectedRows,
  isLoading,
}) {
  if (fields.some(({ type }) => type === 'multiselect')) {
    console.warn('Please note that the multi-select element may have some issues with updating its selected value/s.');
  }

  const mountedRef = useRef(true)

  /* State for the form errors. */
  let [ errors, setErrors ] = useState();

  /* State for the title. */
  const [ title, setTitle ] = useState(initialTitle);

  /* State for datepicker */
  const [ dateValue, dateOnChange ] = useState(new Date());

  /* Removes fields that shouldn't be in the form (has `noInput` set) */
  const inputs = fields.filter(({ noInput }) => !noInput);

  /** @type {{ current: HTMLFormElement }} */
  const formRef = useRef();

  /* Check when the title is set. */
  AutoFormEvents.listen('title', newTitle => setTitle(newTitle));

  /* Check when errors are set. */
  AutoFormEvents.listen('errors', errors => setErrors(errors));

  console.log('isLoading', isLoading);
  /* Callback for getting all the form data */
  const submit = () =>
  {
   
    if (selectedRows) {
      data['orderId'] = selectedRows;
    }

    const formData = !data ? {} : data;
    let errors = {};

    for (const { name, type, required } of inputs)
    {
      const input = formRef.current[name];

      if (type === 'richtextarea') {
        formData[name] = tinymce.get(name).getContent();
      } else if(type === 'multiselect') {
        formData[name] = input.nodeName === 'INPUT'?
          (input.value !== ''? [ input.value ] : [] ) :
          Array.from(input).map(({ value }) => value);
      } else if(type === 'checkbox') {
        formData[name] = input.checked;
      } else if(type === 'checkboxes') {
        formData[name] = Array.from(input).reduce((checked, choice) =>
          checked.concat(choice.checked? choice.value : []), []);
      } else {
        formData[name] = input.value;
      }

      // Check if field is required
      if (required) {
        if (input.value === '') {
          errors[name] = 'This field is required';
        } else {
          errors = {};
        }
      } else {
        errors = {};
      }
    }

    setErrors(errors);

    if(Object.keys(errors).length === 0) {
      onSubmit(formData, data ? data._id : null);
    }
  };

  /* Handling changing the input values based on provided data. */
  useEffect(() =>
  {
    // setValues(data);
    for(const { name, type } of inputs)
    {
      const input = formRef.current[name];
      const value = data[name];
      if (!value)
      {
        if (type === 'richtextarea') {
          tinymce.get(name).resetContent();
        } else if (type === 'checkbox') {
          input.checked = false;
        } else if (type === 'checkboxes' || type === 'radio') {
          for(const checkbox of input) {
            checkbox.checked = false;
          }
        } else {
          input.value = '';
        }

        continue;
      }

      input.value = value;
    }

    return () => {
      mountedRef.current = false
    }

  }, [ data, inputs, formRef ]);

  console.log('errors 2', errors);
  console.log('data', data);
  console.log('inputs', inputs);

  return (
    <div className="d-flex flex-column h-100">
      {
        title &&
        <div className="modal-header">
          <h5 className="modal-title" id="modalLabel">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </h5>
          <button className="btn btn-sm btn-default mx-1"
          type="button" onClick={onCancel}>
          <i className="fa fa-times mr-1"></i> Cancel
        </button>
        <button className="btn btn-sm btn-success mx-1"
          type="submit" onClick={submit} disabled={isLoading}>
          <i className="fa fa-save mr-1"></i> {isLoading ? "Loading..." : "Save"}
        </button>
        </div>
      }

      <form className="flex-fill overflow-auto px-4 py-3" ref={formRef}>
        <div className="row">
        {
          inputs.map(
            (input, index) =>
              <div
                className={`form-group ${input.colClass} ${input.name}`}
                key={input.name}>
                <small className="text-violet">{input.label}</small>
                {
                  /* Textarea */
                  input.type === 'textarea'
                  ? <textarea
                      name={input.name}
                      className="form-control"
                      rows={3} />
                  :
                  /* Rich Textarea */
                  input.type === 'richtextarea' || input.type === 'fullrichtextarea'
                  ? <RichTextArea
                      name={input.name}
                      key={input.name}
                      id={input.name}
                      init={input.richTextAreaOptions}
                    />
                  :
                  /* Select */
                  input.type === 'select'
                  ? <Select
                      name={input.name}
                      options={input.choices}
                      className="form-select"
                      isOptionDisabled={(option) => option.isdisabled}
                    />
                    :
                     /* Select */
                  input.type === 'select2' ?
                    <Select
                      name={input.name}
                      options={input.productChoices}
                      className="form-control"
                    />
                    :

                  /* Multi-Select */
                  input.type === 'multiselect'
                  ? <Select
                      defaultValue={data[input.name] ?
                        data[input.name]
                          .filter(item => input.choices.includes(item))
                          .map(item => ({ value: item, label: item })) :
                        null}
                      name={input.name}
                      theme={theme =>
                      ({
                        ...theme,
                        borderRadius: 0,
                        colors:
                        {
                          ...theme.colors,
                          primary: window
                            .getComputedStyle(document.documentElement)
                            .getPropertyValue('--accent'),
                        }
                      })}
                      isMulti
                      closeMenuOnSelect={false}
                      options={input.choices.map(choice =>
                      ({
                        value: choice,
                        label: choice,
                      }))}
                    />
                  :
                  /* Checkbox */
                  input.type === 'checkbox'
                  ? <div className="d-flex align-items-center">
                      <input
                        className="mr-1"
                        type="checkbox"
                        name={input.name}
                      />
                      {input.label}
                    </div>
                  :
                  /* Multiple Checkbox */
                  input.type === 'checkboxes'?

                    <div>
                    {
                      input.choices.map(choice =>
                      <div key={choice} className="d-flex align-items-center ">
                        <input className="mr-1" type="checkbox"
                          name={input.name} value={choice}/>
                        {choice}
                      </div>)
                    }
                    </div>
                  :
                  /* Radio Buttons */
                  input.type === 'radio'?
                    <div className="d-flex align-items-center mr-4">
                    {
                      input.choices.map(choice =>
                        <div key={choice}  className="pt-4 pb-4 d-flex  mr-4 align-items-center">
                          <input className="mr-1 mb-2"
                            type="radio" name={input.name} value={choice} />
                          {choice}
                        </div>
                      )
                    }
                    </div>
                  :
                  /* Datepicker */
                  input.type === 'datepicker'
                  ? <DatePicker
                      name={input.name}
                      onChange={dateOnChange}
                      value={dateValue}
                      className="form-control"
                    />
                  :
                  /*Datetimepicker */
                  input.type === 'datetimepicker'
                  ? <DateTimePicker
                      name={input.name}
                      onChange={dateOnChange}
                      value={dateValue}
                      className="form-control"
                    />
                  :
                  /* Default */
                  <input
                    name={input.name}
                    className="form-control"
                    type={input.type ? input.type : 'text'}

                  />
                }
                <small className="form-text text-muted text-danger">
                  { errors
                    ? typeof errors[input.name] !== undefined ? errors[input.name] : ''
                    : ''
                  }
                </small>
              </div>
          )
        }
      </div>
      </form>
      <div className="modal-footer">
        
      </div>

    </div>
  );
}
