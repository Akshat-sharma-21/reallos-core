import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import {ChecklistIcon, BellIcon, InboxIcon} from '@primer/octicons-react';
import './navbar.css';
function RenderNav() {

    return (
        <div className="main">
            <Grid container direction="row" justify="center" alignitems="center">
                <AppBar className="nav" position="static">
                    <Toolbar>
                    <Typography className="logo" variant="h6" >
                        Reallos
                    </Typography>
                    <div className="btn">
                    <Button><BellIcon size={24}/></Button>
                    <Button><InboxIcon size={24}/></Button>
                    <Button><ChecklistIcon size={24}/></Button>
                    <Button><Avatar src={require("../../../assets/img.png")} /></Button>
                    </div>
                    </Toolbar>
                </AppBar>
            </Grid>
        </div>
        
    );
}

export default RenderNav;
