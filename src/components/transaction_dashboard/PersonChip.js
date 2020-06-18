import React from 'react';
import {Grid, Chip} from '@material-ui/core';
import {XIcon} from '@primer/octicons-react'
import './Transaction.css';

function RenderChip(){
    return(
        <Grid container>
            <Grid
                  container
                  spacing={1}
                  direction="row"
                >
                    <Grid item>
                        <Chip onDelete className="third-step-person-chip" color='primary'  variant='outlined' label="John Doe"/>
                    </Grid>
                </Grid>
        </Grid>
    );
}
export default RenderChip;