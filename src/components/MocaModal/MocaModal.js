import React, { useState, useEffect } from 'react';
import { getCompartments, getOrders } from './MocaModalUtils';
import OrderDetails from './OrderDetails/OrderDetails';
import classes from './MocaModal.module.css';

const MocaModal = ({
  record,
  mocaClear,
  setMocaClear,
  mocaAuto,
  setMocaAuto,
  setCompartmentCap,
}) => {
  const [vehicleCompartments, setVehicleCompartments] = useState(getCompartments(record[0].vehicleData));
  const [orders, setOrders] = useState(getOrders(record[0].ordersList, vehicleCompartments));

  useEffect(() => {
    let productOrders = [];
    let productsCount = 0;
    orders.map((order) => {
      productsCount += order.order.productDetails.length;
      order.order.productDetails.map((prodDetail) => {

        const assignedCompartmentVolumes = vehicleCompartments.filter((vCmpt) => vCmpt.currentProduct === prodDetail.product.id)
          .map((avc) => avc.currentVolume);
        const productTotalOrderVolume = assignedCompartmentVolumes.length ? assignedCompartmentVolumes.reduce((a, b) => (+a) + (+b)) : 0;

        if (productTotalOrderVolume === (+prodDetail.volume)) {
          const newProdDetail = {
            drop: record[0].drop,
            order: record[0].orderId,
            productShortDescription: prodDetail.product.shortDescription,
            orderVolume: productTotalOrderVolume,
          };

          productOrders = [...productOrders, newProdDetail];
        }
      });
    });

    if (productOrders.length === productsCount) {
      setCompartmentCap(productOrders);
    }
    else {
      setCompartmentCap(undefined);
    }
  }, [vehicleCompartments, orders]);

  useEffect(() => {
    if (mocaClear) {
      clearMoca();
      setMocaClear(false);
    }
  }, [mocaClear, setMocaClear]);

  useEffect(() => {
    if (mocaAuto) {
      clearMoca();

      setTimeout(() => {
        let sortedVehicleCompartments = [...vehicleCompartments].sort((compA, compB) => compA.capacity - compB.capacity);

        const matchedOrderCompartments = orders.map((ord) => {
          return ord.order.productDetails.map((product) => {
            let matchedCompartment = sortedVehicleCompartments.find((comp) => comp.capacity === parseInt(product.volume));
            if (matchedCompartment) {
              sortedVehicleCompartments = sortedVehicleCompartments.filter((vcomp) => {
                return vcomp.id !== matchedCompartment.id;
              });

              return {
                ...product,
                compartmentId: matchedCompartment.id,
              };
            }

            return false;
          });
        }).filter((row) => row !== false);

        matchedOrderCompartments.map((mca) => {
          mca.map((m) => {
            const element = document.getElementById(`${m.product.id}-${m.compartmentId}`);
            element.value = m.volume;

            const compartments = [...vehicleCompartments];
            const currentCompartment = compartments.find((compartment) => compartment.id === m.compartmentId);
            currentCompartment.currentProduct = m.product.id;
            currentCompartment.currentVolume = +m.volume;
            currentCompartment.remainingCapacity = currentCompartment.capacity - +m.volume;
            currentCompartment.utilized = ((+m.volume / currentCompartment.capacity) * 100).toFixed(0);

            setVehicleCompartments(compartments);
          });
        });

        setMocaAuto(false);
      }, 100);
    }
  }, [mocaAuto, setMocaAuto, vehicleCompartments]);

  const clearMoca = () => {
    const compartments = vehicleCompartments.map((vCmpt) => {
      return {
        ...vCmpt,
        currentProduct: undefined,
        currentVolume: 0,
        remainingCapacity: vCmpt.capacity,
        utilized: 0,
      };
    });

    const allInputVolumes = document.querySelectorAll(".input-volume");
    for (let i = 0; i < allInputVolumes.length; i++) {
      allInputVolumes[i].value = '';
    }

    setVehicleCompartments(compartments);
  };

  const generateCompartmentColumn = (columnType) => {
    return vehicleCompartments.map((cmpt) => {
      switch (columnType) {
        case 'capacity':
          return <td className={classes.alignCenter}>{cmpt.capacity.toLocaleString()}</td>;
        case 'partFill':
          return <td className={classes.alignCenter}>{cmpt.partFill}</td>;
        case 'mustUse':
          return <td className={classes.alignCenter}>{cmpt.mustUse}</td>;
        case 'product':
          return <td className={classes.alignCenter}>{cmpt.product}</td>;
        case 'currentVolume':
          return <td className={classes.alignCenter}>{cmpt.currentVolume.toLocaleString()}</td>;
        case 'remainingCapacity':
          return <td className={classes.alignCenter}>{cmpt.remainingCapacity.toLocaleString()}</td>;
        case 'utilized':
          return <td className={classes.alignCenter}>{cmpt.utilized}%</td>;
        case 'id':
          return <td className={classes.alignCenter}>{cmpt.id}</td>;
        default:
          return <th className={classes.alignCenter}>{record[0].vehicleData.trailerPlate}</th>;
      }
    });
  };

  const handleInputChange = (e, cmpt, product, order) => {
    let inputVolume = e.target.value = +e.target.value.replace(/[^0-9]/g, '') || '';

    if (cmpt.currentProduct && cmpt.currentProduct !== product.product.id) {
      inputVolume = e.target.value = '';
      return;
    }

    if (inputVolume > cmpt.capacity) {
      inputVolume = e.target.value = cmpt.capacity;
    }

    if (inputVolume > product.volume) {
      inputVolume = e.target.value = product.volume;
    }

    const compartments = [...vehicleCompartments];
    const currentCompartment = compartments.find((compartment) => compartment.id === cmpt.id);
    currentCompartment.currentProduct = inputVolume ? product.product.id : undefined;
    currentCompartment.currentVolume = inputVolume || 0;
    currentCompartment.remainingCapacity = currentCompartment.capacity - inputVolume;
    currentCompartment.utilized = ((inputVolume / currentCompartment.capacity) * 100).toFixed(0);

    if (!inputVolume) {
      currentCompartment.currentVolume = 0;
      currentCompartment.remainingCapacity = currentCompartment.capacity;
      currentCompartment.utilized = 0;
    }

    setVehicleCompartments(compartments);

    const assignedCompartment = compartments.filter((cmpt) => cmpt.currentProduct === product.product.id ? cmpt.currentVolume : 0);
    const currentVolumes = assignedCompartment.map((cv) => cv.currentVolume);
    const totalCurrentVolumes = currentVolumes.length ? currentVolumes.reduce((a, b) => (+a) + (+b)) : 0;
    const productVolume = +product.volume

    let totalVolumes = 0;
    if (totalCurrentVolumes > productVolume) {
      totalVolumes = productVolume;
      inputVolume = e.target.value = '';
      currentCompartment.currentVolume = 0;
      currentCompartment.remainingCapacity = currentCompartment.capacity;
      currentCompartment.utilized = 0;
    }
  };

  const generateProductCompartmentColumn = (product, order) => {
    return vehicleCompartments.map((cmpt) => {
      return (
        <td className={classes.inputCol}>
          <input
            id={`${product.product.id}-${cmpt.id}`}
            class="input-volume"
            type="text"
            maxLength={6}
            onChange={(e) => handleInputChange(e, cmpt, product, order)}
          />
        </td>
      );
    });
  };

  const generateOrderRows = () => {
    return orders.map((ord) => {
      return ord.order.productDetails.map((product) => {
        const assignedCompartment = vehicleCompartments.filter((cmpt) => cmpt.currentProduct === product.product.id ? cmpt.currentVolume : 0);
        const currentVolumes = assignedCompartment.map((cv) => cv.currentVolume);
        const totalCurrentVolumes = currentVolumes.length ? currentVolumes.reduce((a, b) => a + b) : 0;

        return (
          <tr>
            <td></td>
            <td>{ord.order.deliveryNo}</td>
            <td>{ord.customerDetails.customerName1}</td>
            <td></td>
            <td></td>
            <td>{product.volume.toLocaleString()}</td>
            <td>{product.productCode}</td>
            <td>{(+product.volume - totalCurrentVolumes).toLocaleString()}</td>
            {generateProductCompartmentColumn(product, ord)}
          </tr>
        );
      });
    });
  };

  return (
    <div className={classes.mocaWrapper}>
      <table className={classes.mocaTable}>
        <thead>
          <tr>
            <th colSpan="7">Summary</th>
            <th>Trailer</th>
            {generateCompartmentColumn()}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="7" rowSpan="8">
              <OrderDetails
                date={record[0].date}
                vehicleData={record[0].vehicleData}
                vehicleCompartments={vehicleCompartments}
              />
            </td>
            <th>Capacity</th>
            {generateCompartmentColumn('capacity')}
          </tr>
          <tr>
            <th>Part Fill</th>
            {generateCompartmentColumn('partFill')}
          </tr>
          <tr>
            <th>Must Use</th>
            {generateCompartmentColumn('mustUse')}
          </tr>
          <tr>
            <th>Product</th>
            {generateCompartmentColumn('product')}
          </tr>
          <tr>
            <th>Cur. Vol</th>
            {generateCompartmentColumn('currentVolume')}
          </tr>
          <tr>
            <th>Rem Cap</th>
            {generateCompartmentColumn('remainingCapacity')}
          </tr>
          <tr>
            <th>% Util</th>
            {generateCompartmentColumn('utilized')}
          </tr>
          <tr>
            <th>Cmpt</th>
            {generateCompartmentColumn('id')}
          </tr>
          <tr>
            <th>Seq</th>
            <th>Ord No</th>
            <th>Customer</th>
            <th>Line</th>
            <th>LI</th>
            <th>Volume</th>
            <th>Product</th>
            <th>Rem Vol</th>
            <th colSpan={vehicleCompartments.length}></th>
          </tr>
          {generateOrderRows()}
        </tbody>
      </table>
    </div>
  );
};

export default MocaModal;
