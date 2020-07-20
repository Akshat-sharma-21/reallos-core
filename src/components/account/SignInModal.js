import React, { Component } from "react";
import {
  FormGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  Button,
  Fab,
  CircularProgress,
} from "@material-ui/core";
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import { connect } from "react-redux";
import { login, googleAuth, facebookAuth, acceptInvitation } from "../../actions/userActions";
import { bindActionCreators } from "redux";
import GoogleLogo from "../../assets/google-logo.svg";
import FacebookLogo from "../../assets/fb-logo.svg";
import Modal from "../shared/modal/Modal";
import ResetPasswordModal from "./resetPassword.js";
import "./SignInModal.css";

const mapStateToProps = (state) => ({
  utils: state.utils,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login,
      googleAuth,
      facebookAuth,
      acceptInvitation
    },
    dispatch
  );
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      resetPasswordVisiblity: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.handleResetPasswordModal = this.handleResetPasswordModal.bind(this);
    this.closeResetPasswordModal = this.closeResetPasswordModal.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);
  }

  handleResetPasswordModal(e) {
    e.preventDefault();
    this.setState({
      resetPasswordVisiblity: !this.state.resetPasswordVisiblity,
    });
  }

  closeResetPasswordModal() {
    this.setState({
      resetPasswordVisiblity: false,
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  loginUser() {
    let user = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.login(user);
  }

  acceptInvitation(){
    let user = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.acceptInvitation(this.props.transactionId,user);
  }

  render() {
    return (
      <div>
        <Modal
          title="Sign In"
          visible={this.props.visible}
          dismissCallback={this.props.dismissCallback}
        >
          <ReallosLoaderWithOverlay visible={false} shouldUseFullLogo={false} />
          <FormGroup>
            <div id="signin-modal-content">
              <TextField
                className="input-item"
                name="email"
                label="Email"
                variant="outlined"
                onChange={this.handleChange}
                value={this.state.email}
              />

              <TextField
                className="input-item"
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                onChange={this.handleChange}
                value={this.state.password}
              />

              <div className="input-item flex-items">
                <FormControlLabel
                  color="primary"
                  label="Remember me"
                  control={
                    <Checkbox
                      color="primary"
                      aria-label="Remember me"
                      title="Remember me"
                    />
                  }
                />
                <a onClick={this.handleResetPasswordModal}>Forgot Password?</a>
              </div>

              <Button
                className="input-item"
                color="primary"
                variant="contained"
                style={{ textTransform: "none", fontSize: "18px" }}
                onClick={(this.props.invitation) ? this.acceptInvitation : this.loginUser} // Set another action for the login
                disabled={this.props.utils.Loading}
              >
                {this.props.utils.Loading ? (
                  <CircularProgress size={31} style={{ color: "#150578" }} />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </FormGroup>

          <div className="or-separator">OR</div>

          <div id="social-login-container">
            <div className="social-login-btn">
              <Fab onClick = {this.props.googleAuth}>
                <img src={GoogleLogo} alt="Sign In with Google" />
              </Fab>
            </div>
            <div className="social-login-btn">
              <Fab onClick = {this.props.facebookAuth}>
                <img src={FacebookLogo} alt="Sign In with Facebook" />
              </Fab>
            </div>
          </div>

          <div id="signup-link-footer">
            Don't have an account? &nbsp;
            <a href="#">Sign Up</a>
          </div>
        </Modal>
        <ResetPasswordModal
          visible={this.state.resetPasswordVisiblity}
          dismissCallback={this.closeResetPasswordModal}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
