export const getCompartments = (vehicleData) => {
  const compartmentCount = vehicleData.hasOwnProperty('compartmentCapacity') ? vehicleData.compartmentCapacity.length : 10;

  let compartments = [];
  for (let index = 1; index <= compartmentCount; index++) {
    if (vehicleData[`compartmentCapacity${index}`]) {
      compartments = [...compartments, {
        id: index,
        capacity: vehicleData[`compartmentCapacity${index}`],
        partFill: 'n',
        mustUse: 'y',
        product: '',
        currentVolume: 0,
        remainingCapacity: vehicleData[`compartmentCapacity${index}`],
        utilized: 0,
        currentProduct: undefined,
      }];
    }
  }

  return compartments;
};

export const getOrders = (orderList) => {
  let customerOrders = [];
  for (const orders of orderList) {
    customerOrders = [...orders];
  };

  const newOrders = customerOrders.map((cusOrd) => {
    const cusOrdProd = cusOrd.order.productDetails.map((prod) => {
      return {
        ...prod,
        remainingVolume: prod.volume
      }
    });

    cusOrd.order.productDetails = cusOrdProd;
    return cusOrd;
  });

  return newOrders;
};