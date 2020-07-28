import React, { Component } from "react";
import { Typography, CircularProgress } from "@material-ui/core";
import { AlertIcon } from "@primer/octicons-react";
import { myFirebase } from "../../Config/MyFirebase.js";
import "./EmailHandlerComponent.css";

class VerifyEmail extends Component {
  state = {
    error: "",
    validCode: null,
    verifiedCode: false,
  };

  componentDidMount() {
    // Try to apply the email verification code.
    myFirebase
      .auth()
      .applyActionCode(this.props.actionCode)
      .then(
        () => {
          // Email address has been verified.
          this.setState({ validCode: true, verifiedCode: true });
        },
        (error) => {
          // Code is invalid or expired. Ask the user to verify their email address
          // again.
          this.setState({
            error: error.message,
            validCode: false,
            verifiedCode: true,
          });
        }
      );
  }

  render() {
    const { validCode, verifiedCode } = this.state;

    let component;
    if (!verifiedCode) {
      component = (
        <Typography variant="h6" align="center" style={{ color: "#150578" }}>
          <CircularProgress size={60} style={{ color: "#150578" }} />
        </Typography>
      );
    } else if (verifiedCode && validCode) {
      component = (
        <Typography variant="h6" align="center" style={{ color: "#150578" }}>
          Thank You, Your Email has been verified
        </Typography>
      );
    } else if (verifiedCode && !validCode) {
      component = (
        <Typography variant="h6" align="center" style={{ color: "red" }}>
          <AlertIcon size={40} />
          <br />
          <br />
          There is a problem, Please try Again
        </Typography>
      );
    }

    return component;
  }
}

export default VerifyEmail;
