import React, {Component} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Grid,
    Menu,
    Box,
    Divider,
    LinearProgress
} from '@material-ui/core';
import {
    ChecklistIcon,
    BellIcon,
    InboxIcon,
    PencilIcon,
    BriefcaseIcon,
    SignOutIcon
} from '@primer/octicons-react';
import UserAvatar from '../../../assets/user.png';
import './navbar.css';

class RenderNav extends Component {
    constructor(props){
        super(props);
        this.state = {
            userProfileAnchor: null
        };
        this.openUserProfile = this.openUserProfile.bind(this);
        this.closeUserProfile = this.closeUserProfile.bind(this);
    }

    /* To open the profile modal */
    openUserProfile = (event)=>{
        this.setState({
            userProfileAnchor: event.currentTarget
        });
    }
    /* To close the profile modal */
    closeUserProfile = (event)=>{
        this.setState({
            userProfileAnchor: null
        });
    }

    render(){
        return (
            <div className="main">
                <Grid container direction="row" justify="center" alignitems="center">
                    <AppBar className="nav" position="static">
                        <Toolbar>
                            <Typography className="logo" variant="h6">
                                Reallos
                            </Typography>
                            <div className="navbar-btn-group">
                                <IconButton><BellIcon size={20}/></IconButton>
                                <IconButton><InboxIcon size={20}/></IconButton>
                                <IconButton><ChecklistIcon size={20}/></IconButton>
                                <IconButton onClick={this.openUserProfile}><Avatar src={UserAvatar} /></IconButton>
                            </div>
                    <Menu
                        anchorEl ={this.state.userProfileAnchor}
                        keepMounted
                        open={Boolean(this.state.userProfileAnchor)}
                        onClose={this.closeUserProfile}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                        <Grid container direction="column" justify="center" alignItems="center" className="menu-design">
                            <Grid item>
                                <Grid container direction="row" alignItems="center" justify="space-around" spacing={2}>
                                    <Grid item>
                                        <Box component="div" ml={2}>
                                            <Avatar src={UserAvatar} className="avatar-large"/>
                                        </Box>
                                    </Grid>
                                    <Grid item className="profile-padding">
                                        <Box component="h2" className="profile-heading">Joy Joseph</Box>
                                        <Box component="p" mt={-2.5} mr={2} className="profile-subheading">joy_joseph@example.com</Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <LinearProgress variant="determinate" value={50} className="progress-bar"/>
                                <Box component="p" className="profile-subheading-small" mt={0.5}>50% profile completed</Box>
                            </Grid>
                            <Grid item>
                                <Divider className="divider-profile"/>
                            </Grid>
                            <Grid container direction="row" alignItems="flex-end" justify="space-evenly" className="padding-top">
                                <Grid item>
                                    <Grid container direction="column" justify="center" alignItems="center">
                                        <Grid item><PencilIcon /></Grid>
                                        <Grid item><Box component="p" className="profile-subheading-small">Edit Profile</Box></Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" justify="center" alignItems="center">
                                        <Grid item><BriefcaseIcon /></Grid>
                                        <Grid item><Box component="p" className="profile-subheading-small">Add Resources</Box></Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction="column" justify="center" alignItems="center">
                                        <Grid item><SignOutIcon /></Grid>
                                        <Grid item><Box component="p" className="profile-subheading-small">Log Out</Box></Grid>
                                    </Grid>    
                                </Grid>
                            </Grid>
                        </Grid>
                    </Menu>
                            
                        </Toolbar>
                    </AppBar>
                </Grid>
            </div>
        );
    }
}

export default RenderNav;
