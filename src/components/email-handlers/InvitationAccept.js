import React, { Component } from "react";
import SignIn from "../account/SignInModal";
import SignUpModal from "../account/SignUpModal";
import { Button } from "@material-ui/core";
import "./EmailHandlerComponent.css";

class InvitationAccept extends Component {
  state = {
    signIn: false,
    signUp: false,
    tid: this.props.tid,
    email: this.props.actionCode,
  };

  render() {
    return (
      <>
        <Button
          className="input-item"
          color="primary"
          variant="contained"
          style={{ textTransform: "none", fontSize: "16px" }}
          onClick={() => this.setState({ signIn: true })}
        >
          Sign In
        </Button>
        <Button
          className="input-item"
          color="primary"
          variant="contained"
          style={{ textTransform: "none", fontSize: "16px" }}
          onClick={() => this.setState({ signUp: true })}
        >
          Sign Up
        </Button>
        <SignIn
          visible={this.state.signIn}
          dismissCallback={() => this.setState({ signIn: false })}
          invitation={true} // Setting inviation props to true
          transactionId={this.state.tid} // Setting the transaction id
        />

        <SignUpModal
          visible={this.state.signUp}
          dismissCallback={() => this.setState({ signUp: false })}
          invitation={true} // setting the invitation props to true
          transactionId={this.state.tid} // Setting the transaction id
        />
      </>
    );
  }
}

export default InvitationAccept;
