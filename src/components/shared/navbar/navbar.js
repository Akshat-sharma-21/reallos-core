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
  List,
  Tooltip,
  Zoom,
} from "@material-ui/core";

import {
  ChecklistIcon,
  BellIcon,
  InboxIcon,
  PencilIcon,
  BriefcaseIcon,
  SignOutIcon,
  ChevronRightIcon,
} from "@primer/octicons-react";

import UserAvatar from "../../../assets/user.png";
import ProfileEditDrawer from "../../account/ProfileEditDrawer.js";
import NotificationListItem from "./NotificationListItem.js";
import DocumentListItem from "./DocumentListItem.js";
import TaskListItem from "./TasksListItem.js";
import "./navbar.css";

const styles = (theme) => ({
  notificationBadge: {
    backgroundColor: "#01AE4B",
    color: "white",
  },
});

// DUMMY DATA
// @TODO: Change names to User ID

let dummyData = [
  {
    type: "TASK_DUE_SOON",
    task: "Task 2",
    days_passed: 2,
    isRead: false,
  },
  {
    type: "TASK_COMPLETED",
    task: "Task 3",
    completed_by: "John Doe",
    completed_on: 1592658849.414344,
    isRead: true,
  },
  {
    type: "CHAT_MESSAGE",
    from: "John Doe",
    message: "Will get it done by Friday",
    isRead: false,
  },
  {
    type: "TASK_OVERDUE",
    task: "Task 1",
    due_date: 1592658849.414344,
    isRead: false,
  },
  {
    type: "DOC_UPLOADED",
    transaction: "Transaction 1",
    doc_name: "Document 8",
    isRead: true,
  },
];

let docData = [
  {
    id: 0,
    transaction: "Transaction 1",
    DocName: "SampleForm.pdf",
  },
  {
    id: 1,
    transaction: "Transaction 2",
    DocName: "SampleAAAAAAAAAAAAAAAAAAForm.pdf",
  },
];

let tasksData = [
  {
    id: 0,
    transaction: "Transaction 1",
    TaskName: "Fill the Document",
    Date: "27-06-2020",
  },
  {
    id: 1,
    transaction: "Transaction 2",
    TaskName: "Fill the Document AAAAAAAAAAAAAAAAAA.pdf",
    Date: "27-06-2020",
  },
];

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
      photoURL: null,
      authenticated: Auth.getAuth(),
    };
    this.getProfilePhoto = this.getProfilePhoto.bind(this);
    this.openUserProfilePopup = this.openUserProfilePopup.bind(this);
    this.closeUserProfilePopup = this.closeUserProfilePopup.bind(this);
    this.openNotification = this.openNotification.bind(this);
    this.closeNotification = this.closeNotification.bind(this);
    this.openDocuments = this.openDocuments.bind(this);
    this.closeDocuments = this.closeDocuments.bind(this);
    this.openTasks = this.openTasks.bind(this);
    this.closeTasks = this.closeTasks.bind(this);
    this.toggleProfileEditDrawer = this.toggleProfileEditDrawer.bind(this);
    this.signOut = this.signOut.bind(this);
    this.calculateCompleted = this.calculateCompleted.bind(this);

    this.userId = localStorage.getItem("userID");
  }

  componentDidMount() {
    this.getProfilePhoto();
  }

  getProfilePhoto() {
    myFirestore
      .collection("users")
      .doc(this.userId)
      .get()
      .then((doc) => {
        this.setState({
          PhotoURL: doc.data().photoURL,
        });
      });
  }

  /* To open the profile popup */
  openUserProfilePopup = (event) => {
    this.setState({
      userProfileAnchor: event.currentTarget,
    });
  };

  /* To close the profile popup */
  closeUserProfilePopup = (event) => {
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

  openNotification = (event) => {
    this.setState({
      notificationAnchor: event.currentTarget,
    });
  };

  closeNotification = (event) => {
    this.setState({
      notificationAnchor: null,
    });
  };

  openDocuments = (event) => {
    this.setState({
      documentsAnchor: event.currentTarget,
    });
  };

  closeDocuments = (event) => {
    this.setState({
      documentsAnchor: null,
    });
  };

  openTasks = (event) => {
    this.setState({
      tasksAnchor: event.currentTarget,
    });
  };

  closeTasks = (event) => {
    this.setState({
      tasksAnchor: null,
    });
  };

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
   * Computes number of unread notifications from
   * notification data.
   */
  get getUnreadNotificationsCount() {
    return dummyData.filter((data) => !data.isRead).length;
  }

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
                          this.getUnreadNotificationsCount
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
                        Documents
                      </Typography>
                    }
                    TransitionComponent={Zoom}
                  >
                    <IconButton onClick={this.openDocuments}>
                      <InboxIcon size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      <Typography style={{ fontSize: "15px" }}>
                        Tasks
                      </Typography>
                    }
                    TransitionComponent={Zoom}
                  >
                    <IconButton onClick={this.openTasks}>
                      <ChecklistIcon size={20} />
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
                      <Avatar src={UserAvatar} />
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
                            <Avatar src={UserAvatar} className="avatar-large" />
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
                <Menu
                  className="navbar-notification-popup"
                  anchorEl={this.state.notificationAnchor}
                  keepMounted
                  open={Boolean(this.state.notificationAnchor)}
                  onClose={this.closeNotification}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
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
                    direction="column"
                    alignContent="center"
                    className="notification-menu"
                  >
                    <Grid
                      item
                      className="notification-popup-header"
                      justify="center"
                    >
                      <Box component="p" style={{ justifyContent: "center" }}>
                        You have
                      </Box>
                      <Box
                        component="h3"
                        mt={-1.5}
                        style={{ justifyContent: "center" }}
                      >
                        {this.getUnreadNotificationsCount
                          ? `${this.getUnreadNotificationsCount} Unread Notifications`
                          : "No Unread Notifications"}
                      </Box>
                    </Grid>
                    <List className="notification-list">
                      {dummyData.map((data) => (
                        <NotificationListItem notificationData={data} />
                      ))}
                    </List>
                  </Grid>
                </Menu>
                <Menu
                  className="navbar-notification-popup"
                  anchorEl={this.state.documentsAnchor}
                  keepMounted
                  open={Boolean(this.state.documentsAnchor)}
                  onClose={this.closeDocuments}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{ style: { borderRadius: 10 } }}
                >
                  <Grid
                    direction="column"
                    alignContent="center"
                    className="notification-menu"
                  >
                    <Grid
                      item
                      className="notification-popup-header"
                      justify="center"
                    >
                      <Box component="p" style={{ justifyContent: "center" }}>
                        You have
                      </Box>
                      <Box
                        component="h3"
                        mt={-1.5}
                        style={{ justifyContent: "center" }}
                      >
                        {docData.length} Document
                      </Box>
                    </Grid>
                    <List className="notification-list">
                      {docData.map((data) => (
                        <DocumentListItem documentData={data} />
                      ))}
                    </List>
                  </Grid>
                </Menu>
                <Menu
                  className="navbar-notification-popup"
                  anchorEl={this.state.tasksAnchor}
                  keepMounted
                  open={Boolean(this.state.tasksAnchor)}
                  onClose={this.closeTasks}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  PaperProps={{ style: { borderRadius: 10 } }}
                >
                  <Grid
                    direction="column"
                    alignContent="center"
                    className="notification-menu"
                  >
                    <Grid
                      item
                      className="notification-popup-header"
                      justify="center"
                    >
                      <Box component="p" style={{ justifyContent: "center" }}>
                        You have
                      </Box>
                      <Box
                        component="h3"
                        mt={-1.5}
                        style={{ justifyContent: "center" }}
                      >
                        {docData.length} Tasks
                      </Box>
                    </Grid>
                    <List className="notification-list">
                      {tasksData.map((data) => (
                        <TaskListItem taskData={data} />
                      ))}
                    </List>
                  </Grid>
                </Menu>
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
