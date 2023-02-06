import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
// import classes from './OrderDetails.module.css';

const OrderDetails = ({
  date,
  vehicleData,
  vehicleCompartments,
}) => {
  const [loadedVolume, setLoadedVolume] = useState(0);
  const [loadUtilized, setLoadUtilized] = useState(0);

  useEffect(() => {
    console.log('vehicleCompartments', vehicleCompartments);
    if (vehicleCompartments) {
      const compartmentVolumes = vehicleCompartments.map((cv) => cv.currentVolume);
      const totalVolumes = compartmentVolumes.length ? compartmentVolumes.reduce((a, b) => a + b) : 0;
      const utilizedPercent = ((totalVolumes / (vehicleData.deadFreightVol || 0)) * 100).toFixed(2);

      setLoadedVolume(totalVolumes);
      setLoadUtilized(utilizedPercent);
    }
  }, [vehicleCompartments]);

  return (
    <React.Fragment>
      <Box component="span" width={1} p={3}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <b>Date:</b>
          </Grid>
          <Grid item xs={8}>
            {date || ''}
          </Grid>

          <Grid item xs={4}>
            <b>Tractor:</b>
          </Grid>
          <Grid item xs={8}>
            {vehicleData.tractorPlate || ''}
          </Grid>

          <Grid item xs={4}>
            <b>Trailer:</b>
          </Grid>
          <Grid item xs={8}>
            {vehicleData.trailerPlate || ''}
          </Grid>

          <Grid item xs={4}>
            <b>Total Capacity:</b>
          </Grid>
          <Grid item xs={8}>
            {(+vehicleData.deadFreightVol).toLocaleString() || 0}
          </Grid>

          <Grid item xs={4}>
            <b>Loaded Volume:</b>
          </Grid>
          <Grid item xs={8}>
            {loadedVolume.toLocaleString()}
          </Grid>

          <Grid item xs={4}>
            <b>Target Util:</b>
          </Grid>
          <Grid item xs={8}>
            100%
          </Grid>

          <Grid item xs={4}>
            <b>Actual Util:</b>
          </Grid>
          <Grid item xs={8}>
            {loadUtilized}%
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default OrderDetails;