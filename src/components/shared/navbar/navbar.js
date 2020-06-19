import React, {Component} from 'react';
import {
    AppBar,
    Button,
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
    SignOutIcon,
    ChevronRightIcon,
    XIcon,
    AlertIcon
} from '@primer/octicons-react';
import UserAvatar from '../../../assets/user.png';
import './navbar.css';

class RenderNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfileAnchor: null,
            notificationAnchor: null,
        };
        this.openUserProfile = this.openUserProfile.bind(this);
        this.closeUserProfile = this.closeUserProfile.bind(this);
        this.openNotification = this.openNotification.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
    }

    /* To open the profile popup */
    openUserProfile = (event) => {
        this.setState({
            userProfileAnchor: event.currentTarget
        });
    }

    /* To close the profile popup */
    closeUserProfile = (event) => {
        this.setState({
            userProfileAnchor: null
        });
    }

    openNotification = (event) => {
        this.setState({
            notificationAnchor: event.currentTarget
        });
    }

    closeNotification = (event) => {
        this.setState({
            notificationAnchor: null
        });
    }

    render() {
        return (
            <div className="navbar-main">
                <Grid container direction="row" justify="center" alignitems="center">
                    <AppBar className="nav" position="static">
                        <Toolbar>
                            <Typography className="logo" variant="h6">
                                Reallos
                            </Typography>
                            <div className="navbar-btn-group">
                                <IconButton onClick={this.openNotification}><BellIcon size={20}/></IconButton>
                                <IconButton><InboxIcon size={20}/></IconButton>
                                <IconButton><ChecklistIcon size={20}/></IconButton>
                                <IconButton onClick={this.openUserProfile}><Avatar src={UserAvatar} /></IconButton>
                            </div>
                    <Menu
                        className="navbar-profile-menu-popup"
                        anchorEl={this.state.userProfileAnchor}
                        keepMounted
                        open={Boolean(this.state.userProfileAnchor)}
                        onClose={this.closeUserProfile}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        PaperProps={{
                            style: {
                                borderRadius: 10
                            }
                        }}
                    >
                        <Grid container direction="column" justify="center" alignItems="center" className="menu-design">
                            <Grid item style={{width: '100%', paddingLeft: 20, marginTop: 10}}>
                                <Grid container className="profile-popup-info" direction="row" alignItems="center" spacing={2}>
                                    <Grid item>
                                        <Box component="div" ml={2}>
                                            <Avatar src={UserAvatar} className="avatar-large"/>
                                        </Box>
                                    </Grid>
                                    <Grid item justify="center" className="profile-padding">
                                        <Box component="h2" className="profile-heading">
                                            Joy Joseph
                                        </Box>
                                        <Box component="p" mt={-2.5} mr={2} className="profile-subheading">
                                            joy_joseph@example.com
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item style={{width: '90%', paddingLeft: 20}}>
                                <LinearProgress
                                    variant="determinate"
                                    value={50}
                                    className="profile-progress-bar"
                                />

                                <a
                                    className="profile-subheading-small profile-progress-link"
                                    href=""
                                >
                                    <Box component="p" mt={1}>
                                        50% profile completed
                                        <ChevronRightIcon />
                                    </Box>
                                </a>
                            </Grid>
                            <Grid item>
                                <Divider className="divider-profile"/>
                            </Grid>
                           <Grid container className="profile-popup-action-group" direction="row" alignItems="flex-end" justify="space-evenly">
                                <Grid item>
                                    <Button>
                                        <Grid  container direction="column" justify="center" alignItems="center">
                                            <Grid item><PencilIcon /></Grid>
                                            <Grid item><Box component="p" className="profile-subheading-small">Edit Profile</Box></Grid>
                                         </Grid>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button>
                                        <Grid container direction="column" justify="center" alignItems="center">
                                            <Grid item><BriefcaseIcon /></Grid>
                                            <Grid item><Box component="p" className="profile-subheading-small">Add Resources</Box></Grid>
                                        </Grid>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button>
                                        <Grid container direction="column" justify="center" alignItems="center">
                                            <Grid item><SignOutIcon /></Grid>
                                            <Grid item><Box component="p" className="profile-subheading-small">Log Out</Box></Grid>
                                        </Grid>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Menu>
                    <Menu
                        className="navbar-notification-popup"
                        anchorEl={this.state.notificationAnchor}
                        keepMounted
                        open={Boolean(this.state.notificationAnchor)}
                        onClose={this.closeNotification}
                        getContentAnchorEl={null}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        PaperProps={{
                            style: {
                                borderRadius: 20
                            }
                        }}
                    >
                        <Grid container direction="column" justify="center" alignItems="center" className="notification-menu">
                            <Grid item justify="center">
                                <Box component="p" ml={5} style={{alignContent:"center"}}>
                                    You have
                                </Box>
                                <Box component="p" mt={-2.5} mr={2} style={{fontWeight:800 , paddingTop: 1}}>
                                    3 New Notifications
                                </Box>
                            </Grid>
                            <Grid item style={{width: '100%', paddingLeft: 20, marginTop: 10}}>
                                <Grid container direction="row" alignItems="center" spacing={1}>
                                    <Grid item xs={2}>
                                        <Avatar style={{width: 30 , height: 30}}>R</Avatar>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Grid item justify="flex-start">
                                            <Box component="p" style={{fontWeight:800 , paddingTop: 1}}>
                                                You have
                                            </Box>
                                            <Box component="p" mt={-2.5} mr={2} style={{fontSize:12}}>
                                                3 New Notifications
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton>
                                            <XIcon></XIcon>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                <   Divider variant='middle'/>
                                </Grid>
                            </Grid>
                            <Grid item style={{width: '100%', paddingLeft: 20, marginTop: 10}}>
                                <Grid container direction="row" alignItems="center" spacing={1}>
                                    <Grid item xs={2}>
                                        <Avatar style={{width: 30 , height: 30}}>R</Avatar>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Grid item justify="flex-start">
                                            <Box component="p" style={{fontWeight:800 , paddingTop: 1}}>
                                                You have
                                            </Box>
                                            <Box component="p" mt={-2.5} mr={2} style={{fontSize:12}}>
                                                3 New Notifications
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton>
                                            <XIcon></XIcon>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                <   Divider variant='middle'/>
                                </Grid>
                            </Grid>
                            <Grid item style={{width: '100%', paddingLeft: 20, marginTop: 10}}>
                                <Grid container direction="row" alignItems="center" spacing={1}>
                                    <Grid item xs={2}>
                                        <Avatar style={{width: 30 , height: 30}}><AlertIcon style={{backgroundColor:'yellow'}}/></Avatar>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Grid item justify="flex-start">
                                            <Box component="p" style={{fontWeight:800 , paddingTop: 1}}>
                                                You have
                                            </Box>
                                            <Box component="p" mt={-2.5} mr={2} style={{fontSize:12}}>
                                                3 New Notifications
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton>
                                            <XIcon></XIcon>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                <   Divider variant='middle'/>
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
