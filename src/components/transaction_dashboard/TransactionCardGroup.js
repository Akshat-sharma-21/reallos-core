import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './TransactionCardGroup.css';
import Chart from "react-apexcharts";

import {
  VersionsIcon,
  OrganizationIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@primer/octicons-react'

import {
  GridList,
  Grid,
  GridListTile,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon
} from '@material-ui/core';  

const useStyles = makeStyles((theme) => ({
    gridList: {
      flexWrap: 'nowrap',
      height: '310px',
    },
    nested: {
      paddingLeft: theme.spacing(9),
    },
}))

const chart={
    series: [60, 40],
    options: {
        colors:['#150578', '#92DCE5'],   
        chart: {
            width: 250,
            type: 'donut',
        },
        legend:{
            show: false,
        },
        dataLabels:{
            enabled: false,
        },
        title: {
            text: '', 
            align: 'center',
            margin: 20,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize:  '22px',
              fontWeight:  '900',
              fontFamily:  'Gilroy',
              color:  '#263238'
            },
        },
    },
};


function getChartOptions(name){  // function to return the chart options with the required json
  return({
    options: {
        colors:['#150578', '#92DCE5'],   
        chart: {
            width: 250,
            type: 'donut',
        },
        legend:{
            show: false,
        },
        dataLabels:{
            enabled: false,
        },
        title: {
            text: name, 
            align: 'center',
            margin: 20,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize:  '22px',
              fontWeight:  '900',
              fontFamily:  'Gilroy',
              color:  '#263238'
            },
        },
    },
})
}

function getChartSeries(){ // function to return the required series with the right data
  return({
    series: [60, 40]
  });
}
    


function RenderCard({transaction}){
  const classes = useStyles();
  // mapping the transactions
  return ( 
    <div className="transaction-card-root">
      <GridList className={classes.gridList} cols={2.25}>
      { transaction.map((transaction)=>
        <GridListTile className="transaction-card-item">
          <Card className="transaction-card" variant="outlined">
            <CardContent>
              <Grid
                container
                spacing={2}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={6}>
                  <Chart options={getChartOptions(transaction.Name).options} series={getChartSeries().series} type="donut" width={250} />
                </Grid>
                <Grid className='transaction-card-rgrid' item xs={6}>
                  <List>
                    <ListItem className="transaction-card-secondli">
                      <ListItemIcon ><VersionsIcon size={20}/></ListItemIcon>
                      Tasks
                    </ListItem>
                    <ListItem className='transaction-card-secondlisub'>
                      <CheckCircleIcon size={16} className="transaction-card-subicongreen"/>
                      6 Tasks
                    </ListItem>
                    <ListItem className='transaction-card-secondlisub'>
                      <XCircleIcon size={16} className="transaction-card-subiconred"/>
                      4 Tasks
                    </ListItem>
                    <ListItem className="transaction-card-secondli">
                      <ListItemIcon><OrganizationIcon size={20}/></ListItemIcon>
                      Address
                    </ListItem>
                    <ListItem className='transaction-card-secondlisub'>
                      {transaction.Address}
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </GridListTile>)}
      </GridList>
    </div>
  );
}

export default RenderCard;
