import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { myFirestore } from "../../../Config/MyFirebase";
import WelcomeBoard from "../WelcomeBoard/WelcomeBoard";
import UserAvatar from "../../../assets/user.png";
import "./DiscussionsMain.css";
import DiscussionsBoard from "../DiscussionsBoard/DiscussionsBoard";
import NavRail from "../../shared/navigation_rail/TransactionNavRail";
import { AppString } from "../Const";
import {
  Container,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Button,
  Avatar,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { PersonIcon } from "@primer/octicons-react";
import MediaQuery from "react-responsive";

const styles = (theme) => ({
  avatarNoParticipants: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    background: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPeerUser: null,
    };
    this.currentUserId = AppString.ID;
    this.currentUserName = AppString.NAME;
    this.transId = this.props.match.params.tid;
    this.listUser = [];
    this.peopleRoute = "/transaction/" + this.transId + "/people";
  }

  componentDidMount() {
    this.getListUser();
    this.getProfilePhoto();
  }

  getProfilePhoto() {
    const userId = localStorage.getItem("userID");
    myFirestore
      .collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        // document.querySelector("img").src = doc.data().photoURL;
        var img_tags = document.querySelectorAll("img");
        img_tags[1].src = doc.data().photoURL;
      });
  }

  getListUser = async () => {
    const result = await myFirestore
      .collection("transactions")
      .doc(this.transId)
      .collection("people")
      .get();
    if (result.docs.length > 0) {
      this.listUser = [...result.docs];
      this.setState({ isLoading: false });
    }
  };

  renderListUser = () => {
    const { classes } = this.props;
    let viewListUser = [];

    if (this.listUser.length > 0) {
      this.listUser.forEach((item, index) => {
        if (item.data().uid !== this.currentUserId && item.data().uid !== "") {
          viewListUser.push(
            <ListItem
              button
              key={index}
              className={
                this.state.currentPeerUser &&
                this.state.currentPeerUser.id === item.data().uid
                  ? "viewWrapItemFocused"
                  : "viewWrapItem"
              }
              onClick={() => {
                this.setState({
                  currentPeerUser: item.data(),
                });
              }}
            >
              <ListItemAvatar>
                <img
                  src={item.data().photoURL ? item.data().photoURL : UserAvatar}
                  className={"avatar"}
                  alt="icon avatar"
                ></img>
              </ListItemAvatar>
              <ListItemText primary={`${item.data().name}`} />
            </ListItem>
          );
        }
      });
    }
    if (viewListUser.length > 0) {
      return viewListUser;
    } else {
      return (
        <ListItem>
          <Box paddingTop={15} paddingBottom={19}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <div className="discussions-empty-avatar-group">
                <AvatarGroup>
                  <Avatar
                    src={UserAvatar}
                    className={classes.avatarNoParticipants}
                  />

                  <Avatar className={classes.avatarNoParticipants}>
                    <PersonIcon size={40} />
                  </Avatar>
                </AvatarGroup>
              </div>
              <Grid item>
                <Box mt={5}>
                  <div className="large-text">It's quiet lonely...</div>
                </Box>
              </Grid>
              <Grid item>
                <Box paddingTop={2}>
                  <div className="small-text" style={{ textAlign: "center" }}>
                    Add some people to the transaction to start discussion
                  </div>
                </Box>
              </Grid>
              <Grid item>
                <Box paddingTop={5}>
                  <Button
                    className="anchor-btn"
                    href={this.peopleRoute}
                    variant="contained"
                    color="primary"
                  >
                    Add People
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </ListItem>
      );
    }
  };

  render() {
    return (
      <MediaQuery minDeviceWidth={1450}>
        {(matches) => {
          if (matches) {
            return (
              <Box component="div">
                <Container>
                  <NavRail />
                  <Box
                    component="div"
                    mt={2}
                    mb={2}
                    className="discussions-root"
                  >
                    <Grid container>
                      <Grid item xs={4}>
                        <Box className="list-div">
                          <List className="list-header">
                            <ListItem>
                              <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                              >
                                <Grid item>
                                  <Box ml={2} component="a" href="#">
                                    <img
                                      src={require("../../../assets/reallos-logo.svg")}
                                      alt={"Reallos"}
                                      className="discussions-reallos-logo"
                                    />
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <IconButton size="medium">
                                    <Avatar
                                      src={require("../../../assets/user.png")}
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </ListItem>
                          </List>
                          <List>{this.renderListUser()}</List>
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Box component="div" className="discussions-div">
                          {this.state.currentPeerUser ? (
                            <DiscussionsBoard
                              currentPeerUser={this.state.currentPeerUser}
                              transId={this.transId}
                            />
                          ) : (
                            <WelcomeBoard
                              currentUserName={this.currentUserName}
                              currentUserAvatar={this.currentUserAvatar}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </Box>
            );
          } else {
            return (
              <Box component="div" paddingLeft={8}>
                <Container>
                  <NavRail />
                  <Box
                    component="div"
                    mt={2}
                    mb={2}
                    className="discussions-root"
                  >
                    <Grid container>
                      <Grid item xs={4}>
                        <Box className="list-div">
                          <List className="list-header">
                            <ListItem>
                              <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                              >
                                <Grid item>
                                  <Box ml={2} component="a" href="#">
                                    <img
                                      src={require("../../../assets/reallos-logo.svg")}
                                      alt={"Reallos"}
                                      className="discussions-reallos-logo"
                                    />
                                  </Box>
                                </Grid>
                                <Grid item>
                                  <IconButton size="medium">
                                    <Avatar
                                      src={require("../../../assets/user.png")}
                                    />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </ListItem>
                          </List>
                          <List>{this.renderListUser()}</List>
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        <Box component="div" className="discussions-div">
                          {this.state.currentPeerUser ? (
                            <DiscussionsBoard
                              currentPeerUser={this.state.currentPeerUser}
                              transId={this.transId}
                            />
                          ) : (
                            <WelcomeBoard
                              currentUserName={this.currentUserName}
                              currentUserAvatar={this.currentUserAvatar}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </Box>
            );
          }
        }}
      </MediaQuery>
    );
  }
}

export default withRouter(withStyles(styles)(Chat));
