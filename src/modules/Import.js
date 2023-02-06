import React,{useState, useEffect } from 'react';

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { ImportDatatable } from 'components/ImportDatatable';
import { apiService } from 'services/apiService';
import swal from 'sweetalert';
import { getLogin, logout } from 'helpers';

async function getData(api) {
  const response = await apiService.customget(api);

  Object.entries(response).forEach(([key, value]) => {
    const customer = value.customerName1;
    const id = value;

    return customer
  });
};

async function postData(api, method, data) {
  const response = await apiService.batchrequest(api, method, data);

  return response;
};

export function Import() {
  const fields = [];

  const customerfields =
    [{
      name: 'customerName1',
      label: 'Name 1',
      type: 'text',
      required: true,
    },
  ];

  const productfields =
  [
    {
      name: 'productCode',
      label: 'Code',
      type: 'text',
    },
    {
      name: 'productDescription',
      label: 'Name',
      type: 'text',
    },
    {
      name: 'shortDescription',
      label: 'Description',
      type: 'textarea',
    },
  ];

  const [data,  setData ] = useState([]);
  const [newData,  setNewData ] = useState([]);
  const [apiData,  setApiData ] = useState([]);
  const [orderData, setOrderData ] = useState([]);
  const [isLoading, setIsLoading ] = useState(false);

  const handleChangeStatus = ({ meta, remove, file }, status) => {
    if (status === 'rejected_file_type') {
      swal("Oops!", "Invalid filetype", "error");
    } else if (status === 'done') {
      handleCsv(file);
      //handleUpload();
      remove()
    }

    console.log('meta: ', meta);
  }

  const handleCsv = (file) => {
      var reader = new FileReader();

      reader.onload = function(e) {
        const title = ["orderId", "deliveryNo", "shippingPoint", "customerCode", "sapLineItem", "date", 'productCode', "volume", "text"];
        let contents = e.target.result;
        let count_row = 0

        contents.split('\n').map(entry => {
          const obj =  {}
          var count = 0;
          const value = {}

          entry.split('|').forEach(keyValue => {
            obj[title[count]] = keyValue;

            count++
          });

          newData[count_row++] = obj

          return obj;
        });

        setData(newData);

        let arrayId = [];
        let customerCode = [];
        let count = 0;

        newData.map(orders => {
          if (customerCode.includes(orders.customerCode)) {
            customerCode.indexOf(orders.customerCode)
            console.log('same customerCode', orders.customerCode);

            const index = customerCode.indexOf(orders.customerCode)
            const addData = {
              "productCode": orders.productCode,
              "volume": orders.volume,
              "remarks": orders.text.replace(/(\r\n|\n|\r)/gm, ""),
              'sapLineItem': orders.sapLineItem,
            }

            arrayId[index].productDetails.push(addData)
          } else {
            let isnum1 = /^\d*\.?\d+$/.test(orders.orderId);
            console.log('not same customerCode', orders.customerCode);

            if (isnum1) {
              customerCode.push(orders.customerCode);

              arrayId[count] = {
                'orderId': orders.orderId,
                'customerCode': orders.customerCode,
                'deliveryId': orders.deliveryNo,
                'shippingPoint': orders.shippingPoint,
                'date': orders.date,
                'productDetails': [{
                  'productCode': orders.productCode,
                  'volume': orders.volume,
                  'remarks': orders.text.replace(/(\r\n|\n|\r)/gm, ""),
                  'sapLineItem': orders.sapLineItem,
                }],
              };
              count++;
            }
          }
        });

        setApiData(arrayId);

        console.log('arrayID', arrayId);

        //Upload
        const login = getLogin();
        const api = route => `https://api.unioil.thenerds.solutions${route}`;
        const body = JSON.stringify(arrayId);
        const orders = [];

        setIsLoading(true);

        fetch(api('/orders/previewOrders'),
        {
          method: 'POST',
          headers:
          {
            'Authorization': `Bearer ${login}`,
            'Content-Type': 'application/json'
          },
          'body': body
        })
        .then((response) => response.json())
        .then((response) =>
        {
          setIsLoading(false);
          console.log('promise fulfilled');
          console.log('api response', response);

          if (response.error) {
            swal("Oops!", "Importing of file failed. Please try again later.", "error");
          } else {
            if (Object.keys(response).length) {
              // Loop through the result
              for (let order of response ) {
                const { message, orderId, deliveryNo, shippingPoint, customer, productDetails, date } = order;
                let prodObj = {};
                let customerName = 'Update Customer';
                let productName = 'Update Product';

                // check if has customers
                if (customer.hasOwnProperty('customerName1')) {
                  customerName = customer.customerName1;
                }

                for (let productData of productDetails) {
                  const { product, volume, remarks, sapLineItem } = productData;

                  if(product.shortDescription !== '') {
                    productName = product.shortDescription;
                  }

                  prodObj = {
                    'message': message !== '' ? message : 'New',
                    'orderNo': orderId,
                    deliveryNo,
                    shippingPoint,
                    'customerId': customer.id,
                    'customerCode': customer.customerCode,
                    'customer': customerName,
                    sapLineItem,
                    date,
                    'productId': product.id,
                    'productCode': product.productCode,
                    'product': productName,
                    volume,
                    remarks,
                  }

                  orders.push(prodObj);
                }
              }

              setOrderData(orders);
              console.log('ordersDatable', orders);
            } else {
              swal("Oops!", "Invalid csv format. Please check the file if it has the correct format.", "error");
            }
          }
        })
        .catch(error => {
          setIsLoading(false);

          console.error(error);
          //return ({ success: false });
        });
      };

      reader.readAsText(file);
  }

  const xxxx = [
  {
    "orderNo": "5126438",
    "message": "Duplicate",
    "deliveryNo": "80210636",
    "shippingPoint": "30F1",
    "customerId": "604684646904eb03912f5a16",
    "customerCode": "100001",
    "customer": "BSP & COMPANY INC",
    "sapLineItem": "1",
    "date": "20200312",
    "productId": "6046a1126904eb03912f5a5f",
    "productCode": "TGV-ADO-E5",
    "product": "E5",
    "volume": "2000",
    "remarks": "DEL.DEC. 3  AT PSP NUMOZ NUEVA ECIJA / NAP GAS STATION"
  },
  {
    "orderNo": "5126438",
    "message": "New",
    "deliveryNo": "80210636",
    "shippingPoint": "30F1",
    "customerId": "604684646904eb03912f5a16",
    "customerCode": "100001",
    "customer": "BSP & COMPANY INC",
    "sapLineItem": "1",
    "date": "20200312",
    "productId": "6046a24d6904eb03912f5a61",
    "productCode": "TGV-E5GAS91",
    "product": "REG 91",
    "volume": "2000",
    "remarks": "DEL.DEC. 3  AT PSP NUMOZ NUEVA ECIJA / NAP GAS STATION"
  },
  {
    "orderNo": "5126368",
    "message": "Duplicate",
    "deliveryNo": "80210555",
    "shippingPoint": "30F1",
    "customerId": "604684c36904eb03912f5a17",
    "customerCode": "100003",
    "customer": "DIESEL DEPOT, INC",
    "sapLineItem": "1",
    "date": "20200312",
    "productId": "6046a1ce6904eb03912f5a60",
    "productCode": "TGV-DIESELE4",
    "product": "E4",
    "volume": "2000",
    "remarks": "KM.31 NATIONAL HI-WAY, LANDAYAN"
  }];

  return (
    <div>
      <Dropzone
        onChangeStatus={handleChangeStatus}
        accept="text/plain"
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File or Click to Browse"
        styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
      />
      { isLoading
        ? <div className="spinner-border spinner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        : <ImportDatatable
            fields={fields}
            //data={xxxx}
            data={orderData}
            objectKey={false}
            customerfields={customerfields}
            productfields={productfields}
            striped={true}
            highlightOnHover={true}
            responsive={false}
          />
      }
   </div>
  );
}

export default Import;
