import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearErrors } from "../../actions/utilsActions";
import {
  Button,
  Snackbar,
  Card,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import {
  FileIcon,
  PackageIcon,
  ChecklistIcon,
  PersonIcon,
  CommentDiscussionIcon,
} from "@primer/octicons-react";
import MuiAlert from "@material-ui/lab/Alert";
import SignIn from "../account/SignInModal";
import SignUpModal from "../account/SignUpModal";
import "./HomePage.css";

const mapStateToProps = (state) => ({
  utils: state.utils,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      clearErrors,
    },
    dispatch
  );
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function HomePage(props) {
  let [signInModalVisible, setSignInModalVisibility] = useState(false);
  let [signUpModalVisible, setSignUpModalVisibility] = useState(false);

  const handleClose = () => {
    props.clearErrors(); // dispatching an action to clear the errors
  };
  return (
    <>
      {props.utils.Errors === null ? (
        <></>
      ) : (
        <Snackbar open={true} autoHideDuration={60000} onClose={handleClose}>
          <Alert severity="warning" onClose={handleClose}>
            {props.utils.Errors}
          </Alert>
        </Snackbar>
      )}
      <div className="home-page-container">
        <img
          src={require("../../assets/reallos-logo-dark.svg")}
          className="home-page-logo"
          alt="Reallos Logo"
        />
        <Grid style={{ height: "100vh" }}>
          <Grid container direction="row" style={{ height: "100%" }}>
            <Grid
              direction="column"
              container
              alignItems="center"
              md={6}
              style={{ height: "100%" }}
              justify="center"
            >
              <Box>
                <Grid item>
                  <Typography
                    variant="h4"
                    align="center"
                    style={{
                      color: "#150578",
                      fontWeight: 900,
                      marginBottom: "35px",
                      fontFamily: 'Gilroy'
                    }}
                  >
                    Welcome to Reallos!
                  </Typography>
                  <Typography
                    align="center"
                    variant="h6"
                    style={{
                      color: "#150578",
                      marginBottom: "35px",
                      marginRight: 'auto',
                      marginLeft: 'auto',
                      width: 400,
                      fontFamily: 'Roboto Slab'
                    }}
                  >
                    Let us handle your hassle for managing your 
                    Real Estate. Get Started now.
                  </Typography>
                </Grid>
              </Box>
              <Box>
                <Grid item>
                  <Button
                    className="input-item"
                    color="primary"
                    variant="contained"
                    style={{ textTransform: "none", fontSize: "16px" }}
                    onClick={() => setSignInModalVisibility(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="input-item"
                    color="primary"
                    variant="contained"
                    style={{ textTransform: "none", fontSize: "16px" }}
                    onClick={() => setSignUpModalVisibility(true)}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Box>
            </Grid>

            <Grid
              container
              md={6}
              alignItems="center"
              justify="center"
              className="home-page-right-back"
            >
              <Card
                elevation={3}
                style={{
                  width: "65%",
                  boxShadow: "20px -20px rgba(255,255,255,0.4)",
                }}
                className="home-page-right-card"
              >
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  direction="row"
                  style={{ height: "100%" }}
                >
                  <Grid
                    item
                    xs={4}
                    justify="center"
                    style={{ backgroundColor: "#12EAD8" }}
                  >
                    <Box
                      marginY={8}
                      marginX={4}
                      justify="center"
                      style={{ width: "100%" }}
                    >
                      <img
                        src={require("../../assets/small-r-dark-logo.png")}
                        height="75px"
                        alt="Reallos Logo"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs={3}></Grid>
                      <Grid item xs={2}>
                        <FileIcon size={30} />
                      </Grid>
                      <Grid item xs={2}>
                        <PackageIcon size={30} />
                      </Grid>
                      <Grid item xs={2}>
                        <ChecklistIcon size={30} />
                      </Grid>
                      <Grid item xs={3}></Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs={4}></Grid>
                      <Grid item xs={2}>
                        <PersonIcon size={30} className="icon-row-2" />
                      </Grid>
                      <Grid item xs={2}>
                        <CommentDiscussionIcon
                          size={30}
                          className="icon-row-2"
                        />
                      </Grid>
                      <Grid item xs={4}></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <SignIn
        visible={signInModalVisible}
        dismissCallback={() => setSignInModalVisibility(false)}
      />

      <SignUpModal
        visible={signUpModalVisible}
        dismissCallback={() => setSignUpModalVisibility(false)}
      />
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
