import React, { Component } from "react";
import { Box, Grid, Typography, Card } from "@material-ui/core";
import "./EmailHandlerComponent.css";
import { useLocation } from "react-router-dom";
import VerifyEmail from "./VerifyEmail.js";
import ResetPassword from "./ResetPassword.js";
import InvitationAccept from "./InvitationAccept.js";

class EmailHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: "",
      error: "",
      success: false,
      validCode: null,
      verifiedCode: false,
      actionCode: "",
      mode: "",
    };
    this.RenderRightColumn = this.RenderRightColumn.bind(this);
  }

  render() {
    return (
      <div className="maingrid">
        <img
          src={require("../../assets/reallos-logo-light.svg")}
          className="emailhandler-logo"
          alt="Reallos Logo"
        />
        <Grid style={{ height: "100vh" }}>
          <Grid container direction="row" style={{ height: "100%" }}>
            <Grid
              container
              alignItems="center"
              md={6}
              style={{ height: "100%" }}
              justify="center"
            >
              <Box ml={1} mt={-10}>
                <img
                  src={require("../../assets/emailhandler.png")}
                  className="right-image"
                  alt="Email Handler"
                />
              </Box>
            </Grid>
            <Grid
              container
              md={6}
              alignItems="center"
              justify="center"
              style={{ backgroundColor: "#150578" }}
            >
              <Card
                elevation={3}
                style={{ padding: "30px" }}
                className="right-card"
              >
                <this.RenderRightColumn />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  RenderRightColumn() {
    let query = new URLSearchParams(useLocation().search);
    const mode = query.get("mode");
    const actionCode = query.get("oobCode");
    console.log(actionCode);
    if (mode === "verifyEmail") {
      return <VerifyEmail actionCode={actionCode} />;
    }
    if (mode === "resetPassword") {
      return <ResetPassword actionCode={actionCode} />;
    }
    if (mode.indexOf("invitation") !== -1) {
      return <InvitationAccept actionCode={actionCode} tid={mode.slice(10)} />;
    } else {
      return (
        <Typography
          variant="h6"
          style={{ width: "150%", marginBottom: "8px", color: "red" }}
        >
          Invalid Request
        </Typography>
      );
    }
  }
}
export default EmailHandler;
