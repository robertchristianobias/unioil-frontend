import React, { useState, useEffect } from 'react';

import './css/Module.css';
import classes from './CustomModule.module.css';

import { CustomDatatable, DatatableControl } from 'components/CustomDatatable';
// import { useDatatableSelection } from 'components/hooks/useDatatableSelection';

import { Modal, ModalControl } from 'components/Modal';
import { AutoForm, AutoFormControl } from 'components/AutoForm';
import { Sidepanel, SidepanelControl } from 'components/Sidepanel';

import { DatatableOrderSearch } from 'components/DatatableOrderSearch';

import { apiService } from 'services/apiService';
import { apiCustomService } from 'services/apiCustomService';
import { alert } from 'helpers';
import swal from 'sweetalert';
import moment from 'moment';
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




export function CustomModule(
  {
    name,
    singularName,
    formSize,
    customSidepanelContent,
    fields,
    api,
    objectKey,
    schedulefields,
    selectedRows,
    setSelectedRowsChange,
  }) {

  const onRowSelected = (data) => {
    console.log(data.selectedRows[0])
    console.log(data.selectedRows)

    const ids = [];
    const orderStatus = [];
    var dataStatus = [];
    var count = 0;


    data.selectedRows.map(({ id, status }, i) => {

      if (status == 'assigned') {

        swal("Oops!", "This Order is already assigned", "error");
      }
      else {
        ids.push({ '_id': id })
        setSelectedRowsChange(ids);
      }
      ;
      dataStatus = { 'id': id, 'status': status };
      orderStatus.push(dataStatus);
    }
    )

    setStatus(orderStatus);
    //  console.log(ids)
    return (ids);
  };

  const [ids, setIds] = useState([]);

  const [datafields, setDatafields] = useState([]);

  /* State for the module's data */
  const [data, setData] = useState([]);
  const [datastatus, setStatus] = useState([]);

  /* States for the usage of the AutoForm component. */
  const [record, setRecord] = useState({});

  /* Selection of the rows of the table  */
  // const { selectedRows, setSelectedRows } = useDatatableSelection();

  /* Effect for getting the data from the API. */


  /* Listen for Sidepanel toggling. */
  const onSidepanelToggle = isOpened => {
    if (isOpened) {
      alert.closeAll();
      AutoFormControl.setErrors();
    }
  };




  /* Pressing the add button */


  const unAssign = () => {

    //setRecord({}); /* Reset the record in the sidepanel. */
    AutoFormControl.setTitle(`Unassign Schedule`);
    SidepanelControl.open();

    //setChoices(schedulefields);
    setDatafields(schedulefields);
    console.log(schedulefields);

  };

  /* Clicking a row in the datatable */
  const onRowClicked = clickedRow => {

    swal({
      text: 'Additional Remarks',
      content: "input",
      buttons: {
        cancel: 'Cancel',
        confirm: { text: 'Save', className: 'sweet-warning', closeModal: false },
      }

    })
      .then(name => {
        if (!name) throw null;


        const remarks = {
          "addRemarks": name
        }

        const resp = apiService.put(`/orders/${clickedRow.id}`, remarks)
        if (resp) {
          return resp;
        }
        else {
          throw null;
        }

      })
      .then(results => {
        if (results) {
          swal("Customer remarks saved!");
          setInterval(() => window.location.reload(), 1000);
          return true
        }
        else {
          return swal("Cannot save remarks!");
        }
      })

      .catch(err => {
        console.log("error", err)
        if (err) {
          swal("Failed!", "The request failed!", "error");
        } else {
          swal.stopLoading();
          swal.close();
        }
      });
    AutoFormControl.setTitle(`Update ${singularName}`);

  };
  useEffect(() => {
    async function getData() {

      const apiResponse = await apiService.get(api);

      console.log('useEffect', apiResponse);
      console.log("order", apiResponse)
      setData(apiResponse);
    }
    getData();
  }, [api, name]);

  const ordersData = () => {
    const orders = [];

    for (let order of data) {
      let orderInfo = {};
      let customerName = '';
      let productName = '';

      if (order.hasOwnProperty('customer')) {
        const { customer } = order;

        if (customer !== null) {
          if (customer.hasOwnProperty('customerName1')) {
            customerName = customer.customerName1;
          } else {
            customerName = '---';
          }
        } else {
          customerName = '---';
        }
      } else {
        customerName = '---';
      }

      // Loop through productDetails
      if (order.hasOwnProperty('productDetails')) {
        const { productDetails } = order;

        for (let productData of productDetails) {
          const { product } = productData;
          if (product.hasOwnProperty('shortDescription')) {
            productName = product.shortDescription;
          } else {
            productName = '---';
          }

          orderInfo = {
            "id": order._id,
            "status": order.status,
            "_id": order.orderId,
            "deliveryNo": order.deliveryNo,
            "shipmentNo": order.shipmentId,
            "customer": customerName,
            "date": moment(order.createdAt).format('MMMM D, YYYY'),
            "product": productName,
            "volume": product.volume,
            "remarks": product.remarks,
            "addRemarks": order.addRemarks

          };

          orders.push(orderInfo);
        }
      }

    }

    return orders;
  };



  return (
    data.length !== 0 &&
    <>
      <div className={`datatable-header d-flex align-items-center justify-content-between pull-right ${classes.dataTableHeader}`}>
        <DatatableOrderSearch className="search" onSearch={searchOrder => DatatableControl.setSearchOrder(searchOrder)} />
      </div>

      <CustomDatatable
        fixedHeader="true"
        fields={fields}
        data={ordersData()}
        onRowSelected={onRowSelected}
        onRowClicked={onRowClicked}
        objectKey={objectKey}
      />
    </>
  );
}

/* Default export for code-splitting (React.lazy import) */
export default CustomModule;
