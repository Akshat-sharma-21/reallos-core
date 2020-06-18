import React from 'react';
import {Card,CardContent, Grid, Avatar, Button} from '@material-ui/core';
import {PencilIcon, XIcon} from '@primer/octicons-react'

function InviteCard(){

    return(
        <Card variant="outlined">
            <CardContent>
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justify="center"
                  alignItems="center"
                  style={{color: '#150578'}}
                >
                <Grid item xs={2} style={{fontWeight: 500, paddingTop: 0, paddingBottom: 0}}>
                    John Doe
                </Grid>
                <Grid item xs={2}>
                    Buyer
                </Grid>
                <Grid item xs={6} alignContent='right'>
                    john.doe@example.com
                </Grid>
                <Grid item xs={1}>
                    <Button><PencilIcon size={16}/></Button>                
                </Grid>
                <Grid item xs={1}>
                    <Button><XIcon size={16}/></Button>
                </Grid>
                </Grid>
            </CardContent>
            </Card>
    );
}

export default InviteCard;