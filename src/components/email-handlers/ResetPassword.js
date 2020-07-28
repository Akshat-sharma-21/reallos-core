import React, { Component } from "react";
import {
  Typography,
  CircularProgress,
  FormControl,
  TextField,
  Button,
} from "@material-ui/core";
import { AlertIcon, CheckCircleIcon } from "@primer/octicons-react";
import { myFirebase } from "../../Config/MyFirebase.js";

class ResetPassword extends Component {
  state = {
    email: null,
    error: "",
    password: "",
    success: false,
    validCode: null,
    verifiedCode: false,
  };

  componentDidMount() {
    // Verify the password reset code is valid.
    myFirebase
      .auth()
      .verifyPasswordResetCode(this.props.actionCode)
      .then(
        (email) => {
          this.setState({ email, validCode: true, verifiedCode: true });
        },
        (error) => {
          // Invalid or expired action code. Ask user to try to reset the password
          // again.
          this.setState({
            error: error.message,
            validCode: false,
            verifiedCode: true,
          });
        }
      );
  }

  handleResetPassword = (event) => {
    event.preventDefault();
    const { actionCode } = this.props;
    const newPassword = this.state.password;

    // Save the new password.
    myFirebase
      .auth()
      .confirmPasswordReset(actionCode, newPassword)
      .then(
        () => {
          // Password reset has been confirmed and new password updated.
          this.setState({ success: true });
        },
        (error) => {
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
          this.setState({ error: error.message });
        }
      );
  };
  setText = (evt) => {
    this.setState({ password: evt.target.value });
  };

  render() {
    const { error, password, success, validCode, verifiedCode } = this.state;

    let component;
    if (!verifiedCode) {
      component = (
        <Typography variant="h6" align="center" style={{ color: "#150578" }}>
          <CircularProgress size={60} style={{ color: "#150578" }} />
        </Typography>
      );
    } else if (success) {
      component = (
        <div>
          <Typography
            align="center"
            variant="h5"
            style={{
              marginBottom: "10px",
              color: "#5cb85c",
              fontWeight: "900",
            }}
          >
            <CheckCircleIcon size={50} />
            <br />
            <br />
            Password changed
          </Typography>
          <Typography
            align="center"
            style={{ fontSize: "14px", color: "black" }}
          >
            You can now login with your new password !
          </Typography>
        </div>
      );
    } else if (verifiedCode && validCode) {
      component = (
        <div className="ResetPassword">
          {error ? <div className="error">{error}</div> : ""}
          <Typography
            variant="h6"
            style={{ width: "150%", marginBottom: "8px" }}
          >
            Reset Password
          </Typography>
          <FormControl onSubmit={this.handleResetPassword}>
            <TextField
              onChange={this.setText}
              value={password}
              className="input-item form"
              label="New Password"
              name="password"
              variant="outlined"
              type="password"
              style={{ marginBottom: "8px" }}
            />
            <TextField
              className="input-item form"
              label="Confirm New Password"
              name="password"
              variant="outlined"
              type="password"
              style={{ marginBottom: "8px" }}
            />
            <Button
              type="submit"
              value="SAVE"
              className="input-item form"
              color="primary"
              variant="contained"
              style={{ textTransform: "none", fontSize: "16px" }}
              onClick={this.handleResetPassword}
            >
              Confirm
            </Button>
          </FormControl>
        </div>
      );
    } else if (verifiedCode && !validCode) {
      component = (
        <div>
          <Typography
            align="center"
            variant="h6"
            style={{
              marginBottom: "10px",
              color: "red",
              fontWeight: "900",
              fontSize: "20px",
            }}
          >
            <AlertIcon size={50} />
            <br />
            <br />
            Try resetting your password again
          </Typography>
          <Typography
            align="justify"
            style={{ fontSize: "14px", color: "black" }}
          >
            {error}
          </Typography>
        </div>
      );
    }
    return component;
  }
}

export default ResetPassword;
