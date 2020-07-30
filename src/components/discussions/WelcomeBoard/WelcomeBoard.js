import React, { Component } from "react";
import "./WelcomeBoard.css";
import { Grid, Typography, Box } from "@material-ui/core";

export default class WelcomeBoard extends Component {
  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Box paddingTop={13}>
            <img
              src={require("../../../assets/chat-empty.png")}
              className="discussions-empty-image"
              alt="Empty Chat"
            />
          </Box>
        </Grid>
        <Grid item>
          <Box paddingTop={2}>
            <div className="discussions-heading">
              <span style={{ fontFamily: "Gilroy", fontWeight: 900 }}>
                Reallos
              </span>
              &nbsp;<span>Discussions</span>
            </div>
          </Box>
        </Grid>
        <Grid item>
          <Box mt={3}>
            <Typography className="discussions-subheading">
              Start a conversation with anyone involved in your transaction
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
