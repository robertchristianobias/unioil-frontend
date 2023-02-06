import { ControlCameraOutlined } from "@material-ui/icons";

export const getDriversAvailability = (token, date) => {
    return fetch(`https://api.unioil.thenerds.solutions/driverFindSchedule?date=${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
            }
    })
        .then(response => {
            console.log("Driver Availability: ", response)
            return response.json();
        })
        .catch(err => console.log(err));
};
export const getTransports = (token, date) => {
    return fetch(`https://api.unioil.thenerds.solutions/findSchedule/?date=${date}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
            }
    })
        .then(response => {
            console.log("Transport Availability: ", response)
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateTransport = (vehicleId, vehicle, token) => {
    console.log("API Vehicle Availability: ", JSON.stringify({
        vehicle :vehicle
    }))
    return fetch(`https://api.unioil.thenerds.solutions/transports/${vehicleId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            vehicle :vehicle
        })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const updateDriverSched = (driverSchedId, driver, token) => {
    console.log("API Driver Availability: ", JSON.stringify({
        scheduleDetails :driver
    }))
    return fetch(`https://api.unioil.thenerds.solutions/driver-availabilities/${driverSchedId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            scheduleDetails :driver
        })
      
    })

        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};