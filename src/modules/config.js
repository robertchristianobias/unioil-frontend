import React from 'react';

const Contractors = React.lazy(() => import('modules/Contractors'));
const Customers = React.lazy(() => import('modules/Customers'));
const Dashboard = React.lazy(() => import('modules/Dashboard'));
const Dispatch = React.lazy(() => import('modules/Dispatch'));
const Drivers = React.lazy(() => import('modules/Drivers'));
const Eta = React.lazy(() => import('modules/Eta'));
const Import = React.lazy(() => import('modules/Import'));
const Orders = React.lazy(() => import('modules/Orders'));
const Products = React.lazy(() => import('modules/Products'));
const Rates = React.lazy(() => import('modules/Rates'));
const Schedules = React.lazy(() => import('modules/Schedules'));
const Splitscreen = React.lazy(() => import('modules/Splitscreen'));
const Vehicles = React.lazy(() => import('modules/Vehicles'));
const Customer = React.lazy(() => import('modules/Customer'));
//const DriverWorkingHours = React.lazy(() => import('modules/DriverWorkingHours'));
const VechicleAvailability = React.lazy(() => import('modules/VechicleAvailability'));
const DriverAvailability = React.lazy(() => import('modules/DriverAvailability'));
const Contractor = React.lazy(() => import('modules/Contractor'));
/**
 * @typedef Module
 * @property {Module[]} [permission]
 * @property {string} route
 * @property {string} name
 * @property {string} icon
 * @property {string} [path]
 * @property {import('react').Component} [component]
 * @property {Module[]} [subModules]
 */

/* List all module definitions */
/** @type {Module[]} */
const modules =
[
  {
    route: '/',
    name: 'Report Dashboard',
    icon: 'signal',
    component: <Dashboard path="/" key="Dashboard"/>,
  },
  {
    route: '',
    name: 'Orders',
    icon: 'th-large',
    subModules: [
      {
        route: '/import',
        name: 'Batch Import',
        icon: 'upload',
        component: <Import path="/import" key="ImportData"/>
      },
      {
        route: '/orders',
        name: 'Sales Orders',
        icon: 'shopping-cart',
        component: <Orders path="/orders" key="orders"/>
      },
      {
        route: '/splitscreen',
        name: 'Split Screen',
        icon: 'bars',
        component: <Splitscreen path="/splitscreen" key="splitscreen"/>
      },
    ],
  },
  
  {
    route: '/schedules',
    name: 'Summary Schedules',
    icon: 'tasks',
    component: <Schedules path="/schedules" key="Schedules" />,
  },
  {
    route: '/dispatch',
    name: 'Dispatch',
    icon: 'handshake',
    component: <Dispatch path="/dispatch" key="Dispatch"/>
  },
  {
    route: '/customer',
    name: 'Customer Information',
    icon: 'signal',
    component: <Customer path="/customer" key="customer"/>,
  },
  {
    route: '/contractor',
    name: 'Contractor Information',
    icon: 'briefcase',
    component: <Contractor path="/contractor" key="Contractor" />,
  },
  {
    route: '/vehicles-availability',
    name: 'Vehicles Availability',
    icon: 'folder',
    component: <VechicleAvailability path="/vehicles-availability" key="vehicles-availability" />,
  },
  {
    route: '/drivers-availability',
    name: 'Drivers Availability',
    icon: 'folder',
    component: <DriverAvailability path="/drivers-availability" key="drivers-availability" />,
  },
  {
    route: '',
    name: 'Masterlist',
    icon: 'window-restore',
    subModules: [
      {
        route: '/products',
        name: 'Products',
        icon: 'cog',
        component: <Products path="/products" key="Products" />,
      },
      {
        route: '/vehicles',
        name: 'Vehicles',
        icon: 'truck',
        component: <Vehicles path="/vehicles" key="Vehicles"/>,
      },
      {
        route: '/drivers',
        name: 'Drivers',
        icon: 'user-secret',
        component: <Drivers path="/drivers" key="Drivers"/>,
      },
      {
        route: '/contractors',
        name: 'Contractors',
        icon: 'briefcase',
        component: <Contractors path="/contractors" key="Contractors" />,
      },
      {
        route: '/customers',
        name: 'Customers',
        icon: 'user',
        path: '/customers',
        component: <Customers path="/customers"/>,
      },
      {
        route: '/rates',
        name: 'Rates',
        icon: 'percent',
        path: '/rates',
        component: <Rates path="/rates"/>,
      },
    ]
  },
];

/* Filter modules by permissions. */
export function getPermittedModules()
{
  const permissions = JSON.parse(localStorage.getItem('permissions')) || [ '/' ];
  const permittedModules = [];
  for(const _module of modules)
  {
    permittedModules.push(_module);
    continue;

    // if(permissions.includes(_module.route))
    // {
    //   if(!_module.subModules)
    //   {
    //     permittedModules.push(_module);
    //     continue;
    //   }
    // }

    if(_module.subModules)
    {
      const permittedSubModules = [];
      for(const subModule of _module.subModules)
      {
        if(permissions.includes(subModule.route))
          permittedSubModules.push(subModule);
      }

      if(permittedSubModules.length !== 0)
      {
        _module.subModules = permittedSubModules;
        permittedModules.push(_module);
      }
    }
  }

  return permittedModules;
}
