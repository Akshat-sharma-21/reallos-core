import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Auth from "../../account/Authenticate";
import { myFirestore } from "../../../Config/MyFirebase.js";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { myFirebase } from "../../../Config/MyFirebase";

import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Grid,
  Menu,
  Box,
  Divider,
  LinearProgress,
  Tooltip,
  Zoom,
} from "@material-ui/core";

import {
  BellIcon,
  PencilIcon,
  BriefcaseIcon,
  SignOutIcon,
  ChevronRightIcon,
} from "@primer/octicons-react";

import UserAvatar from "../../../assets/user.png";
import ProfileEditDrawer from "../../account/ProfileEditDrawer.js";
import NotificationPopup from "./notifications/NotificationPopup.jsx";
import "./navbar.css";

const styles = (theme) => ({
  notificationBadge: {
    backgroundColor: "#01AE4B",
    color: "white",
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

class RenderNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userProfileAnchor: null,
      notificationAnchor: null,
      documentsAnchor: null,
      tasksAnchor: null,
      isProfileEditDrawerVisible: false,
      authenticated: Auth.getAuth(),
      notifications: null,
      profilePhoto: UserAvatar
    };

    this.getProfilePhoto = this.getProfilePhoto.bind(this);
    this.openUserProfilePopup = this.openUserProfilePopup.bind(this);
    this.closeUserProfilePopup = this.closeUserProfilePopup.bind(this);
    this.openNotification = this.openNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.toggleProfileEditDrawer = this.toggleProfileEditDrawer.bind(this);
    this.signOut = this.signOut.bind(this);
    this.calculateCompleted = this.calculateCompleted.bind(this);
  }

  getProfilePhoto() {
    const userId = localStorage.getItem("userID");
    myFirestore
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        if (doc.data().photoURL !== "") {
          this.setState({
            profilePhoto: doc.data().photoURL
          })
        }
      });
  }

  componentDidMount() {
    const userUid = localStorage.getItem("userID");

    // `onSnapshot` will return a function to unsubscribe
    // the listener.
    this.unsubscribeNotificationListener = myFirestore
      .collection("users")
      .doc(userUid)
      .collection("notifications")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        let notificationsList = [];

        snapshot.docs.forEach((notification) => {
          notificationsList.push(
            Object.assign(notification.data(), { id: notification.id })
          );
        });

        this.setState({
          notifications: notificationsList,
        });
      });

    this.getProfilePhoto();
  }

  componentWillUnmount() {
    // Unsubscribe database change listener when the
    // component is about to unmount.
    this.unsubscribeNotificationListener();
  }

  /**
   * Opens **User Profile Edit** Side Drawer
   *
   * @param {Event} event
   * The Mouse Click Event of "Profile" Button.
   */
  openUserProfilePopup = (event) => {
    this.setState({
      userProfileAnchor: event.currentTarget,
    });
  };

  /**
   * Closes **User Profile Edit** Side Drawer
   */
  closeUserProfilePopup = () => {
    this.setState({
      userProfileAnchor: null,
    });
  };

  /**
   * Toggles visibility of `ProfileEditDrawer`
   */
  toggleProfileEditDrawer() {
    let _isProfileEditDrawerVisible = !this.state.isProfileEditDrawerVisible;

    this.setState({
      userProfileAnchor: null,
      isProfileEditDrawerVisible: _isProfileEditDrawerVisible,
    });
  }

  /**
   * Opens Notification Popup.
   *
   * @param {Event} event
   * The Mouse Click Event of "Notifications" Icon Button.
   */
  openNotification = (event) => {
    this.setState({
      notificationAnchor: event.currentTarget,
    });
  };

  /**
   * Closes Notification Popup.
   */
  closeNotification = () => {
    this.setState({
      notificationAnchor: null,
    });
  };

  /**
   * Computes number of unread notifications from
   * notification data.
   */
  get getUnreadNotificationsCount() {
    if (this.state.notifications != null)
      return this.state.notifications.filter((data) => !data.isRead).length;
    else return 0;
  }

  /**
   * Returns user profile completion percentage.
   */
  calculateCompleted() {
    // calculating the percentage of the profile || Can be edited in the future
    let score = 2; // assuming 20% of the application is already completed
    if (this.props.user.phone != null) {
      score += 2;
    }
    if (this.props.user.role != null) {
      score += 1;
    }
    if (this.props.user.state != null) {
      score += 1;
    }
    if (this.props.user.eSignature != null) {
      score += 2;
    }
    if (this.props.user.initials != null) {
      score += 2;
    }

    let percentage = (score / 10) * 100;
    return percentage;
  }

  /**
   * Signs out the current user.
   */
  signOut() {
    Auth.signout(); // Signing out of the application
    this.setState({
      authenticated: Auth.getAuth(),
    });
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = "/"; // redirecting to the home page with public access
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    let { classes } = this.props;

    if (this.state.authenticated === false) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="navbar-main" style={{ marginTop: 20 }}>
          <Grid container direction="row" justify="center" alignitems="center">
            <AppBar className="navbar-root" position="static">
              <Toolbar>
                <Typography className="navbar-logo" variant="h6">
                  Reallos
                </Typography>

                <div className="navbar-btn-group">
                  <Tooltip
                    title={
                      <Typography style={{ fontSize: "15px" }}>
                        Notifications
                      </Typography>
                    }
                    TransitionComponent={Zoom}
                  >
                    <IconButton onClick={this.openNotification}>
                      <Badge
                        variant="dot"
                        classes={
                          this.getUnreadNotificationsCount !== 0
                            ? {
                                badge: classes.notificationBadge,
                              }
                            : null
                        }
                      >
                        <BellIcon size={20} />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      <Typography style={{ fontSize: "15px" }}>
                        Profile
                      </Typography>
                    }
                    TransitionComponent={Zoom}
                  >
                    <IconButton onClick={this.openUserProfilePopup}>
                      <Avatar src={this.state.profilePhoto} />
                    </IconButton>
                  </Tooltip>
                </div>

                <Menu
                  className="navbar-profile-menu-popup"
                  anchorEl={this.state.userProfileAnchor}
                  keepMounted
                  open={Boolean(this.state.userProfileAnchor)}
                  onClose={this.closeUserProfilePopup}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{
                    style: {
                      borderRadius: 10,
                    },
                  }}
                >
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className="menu-design"
                  >
                    <Grid
                      item
                      style={{
                        width: "100%",
                        paddingLeft: 20,
                        marginTop: 10,
                      }}
                    >
                      <Grid
                        container
                        className="profile-popup-info"
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item>
                          <Box component="div" ml={2}>
                            <Avatar src={this.state.profilePhoto} className="avatar-large" />
                          </Box>
                        </Grid>
                        <Grid item justify="center" className="profile-padding">
                          <Box component="h2" className="profile-heading">
                            {this.props.user.Name}
                          </Box>
                          <Box
                            component="p"
                            mt={-2.5}
                            mr={2}
                            className="profile-subheading"
                          >
                            {this.props.user.email}
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item style={{ width: "90%", paddingLeft: 20 }}>
                      <LinearProgress
                        variant="determinate"
                        value={this.calculateCompleted()}
                        className="profile-progress-bar"
                      />

                      <a
                        className="profile-subheading-small profile-progress-link"
                        href="#"
                      >
                        <Box component="p" mt={1}>
                          {this.calculateCompleted()}% profile completed
                          <ChevronRightIcon />
                        </Box>
                      </a>
                    </Grid>
                    <Grid item>
                      <Divider className="divider-profile" />
                    </Grid>
                    <Grid
                      container
                      className="profile-popup-action-group"
                      direction="row"
                      alignItems="flex-end"
                      justify="space-evenly"
                    >
                      <Grid item>
                        <Button onClick={this.toggleProfileEditDrawer}>
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item>
                              <PencilIcon />
                            </Grid>
                            <Grid item>
                              <Box
                                component="p"
                                className="profile-subheading-small"
                              >
                                Edit Profile
                              </Box>
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button>
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item>
                              <BriefcaseIcon />
                            </Grid>
                            <Grid item>
                              <Box
                                component="p"
                                className="profile-subheading-small"
                              >
                                Add Resources
                              </Box>
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button onClick={this.signOut}>
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                          >
                            <Grid item>
                              <SignOutIcon />
                            </Grid>
                            <Grid item>
                              <Box
                                component="p"
                                className="profile-subheading-small"
                              >
                                Log Out
                              </Box>
                            </Grid>
                          </Grid>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Menu>
                <NotificationPopup
                  notificationAnchor={this.state.notificationAnchor}
                  dismissCallback={this.closeNotification}
                  notifications={this.state.notifications}
                />
              </Toolbar>
            </AppBar>
          </Grid>

          <ProfileEditDrawer
            dismissCallback={this.toggleProfileEditDrawer}
            visible={this.state.isProfileEditDrawerVisible}
          />
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(withStyles(styles)(RenderNav));
