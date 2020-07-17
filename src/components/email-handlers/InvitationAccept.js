import React, { Component } from 'react';
import SignIn from "../account/SignInModal";
import SignUpModal from "../account/SignUpModal";
import { Typography, CircularProgress, Button } from "@material-ui/core";
import { AlertIcon } from '@primer/octicons-react';
import "./EmailHandlerComponent.css";

class InvitationAccept extends Component{
    state={
        signIn: false,
        signUp: false,
        tid: this.props.tid,
        email: this.props.actionCode,
    };

    componentDidMount() {
        console.log(this.state.tid);
        console.log(this.state.email);
    }

    render(){
    return (
    <>
        <Button
            className="input-item"
            color="primary"
            variant="contained"
            style={{ textTransform: "none", fontSize: "16px" }}
            onClick={()=> this.setState({signIn: true})}
        >
            Sign In
        </Button>
        <Button
            className="input-item"
            color="primary"
            variant="contained"
            style={{ textTransform: "none", fontSize: "16px" }}
            onClick={()=> this.setState({signUp: true})}
        >
            Sign Up
        </Button>
        <SignIn
            visible={this.state.signIn}
            dismissCallback={()=> this.setState({signIn: false})}
        />

        <SignUpModal
            visible={this.state.signUp}
            dismissCallback={()=> this.setState({signUp: false})}
        />
    </>
    );
}
}

export default InvitationAccept;