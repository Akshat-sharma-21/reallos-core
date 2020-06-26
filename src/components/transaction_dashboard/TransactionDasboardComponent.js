import React, {Component} from "react";
import "./Transaction.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {Stepper,Step,StepLabel, Button, Typography, TextField, Select, InputLabel,MenuItem, FormControl} from '@material-ui/core';
import Modal from '../shared/modal/Modal'
import NewTransactionButton from "./NewTransactionButtonComponent";
import NavBar from "../shared/navbar/navbar";
import SearchBar from "../shared/searchbar/SearchBarComponent";
import TransactionCardGroup from "./TransactionCardGroup";
import {connect} from 'react-redux';
import {fetchTransaction} from '../../actions/transactionActions';
import {bindActionCreators} from 'redux';

const mapStateToProps = (state)=>({
  user: state.user,
  transaction: state.transaction
});

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators({
    fetchTransaction
  },dispatch);
}

class TransactionDasboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      socialModal: false,
    };
    this.RenderTransactionBody = this.RenderTransactionBody.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.RenderStep = this.RenderStep.bind(this);
    this.SocialDetailModal = this.SocialDetailModal.bind(this);
    this.SocialDetailClose = this.SocialDetailClose.bind(this);
  }

  componentDidMount() {
    // Component did mount is used to fetch the transactions of the user form the redux store
    if (this.props.user.id != null)
      // if the user id is not null
      this.props.fetchTransaction(this.props.user.id); // dispatching the action to fetch the transactions that belong to the user from the store
  }

  RenderTransactionBody({ transaction }) {
    // Function to render the various transactions that belong to the user
    if (transaction && transaction.length) {
      //If transactions exist
      return (
        <>
          <Grid container direction="row" justify="center" alignItems="center">
            <SearchBar />
          </Grid>
          <TransactionCardGroup transaction={transaction} />
        </>
      );
    } else {
      //If no transactions exist
      return (
        <>
          <Grid container direction="row" justify="center" alignItems="center">
            <img
              src={require("../../assets/transaction-empty.png")}
              alt=""
              className="no-transasction-default-img"
            />
          </Grid>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
          >
            <Grid item>
              <Box
                component="h2"
                className="header-transaction"
                style={{ marginBottom: "50px" }}
              >
                Feels empty here...
              </Box>
            </Grid>
            <Grid item>
              <Box component="p" m={-2} className="body-text">
                Seems like you have not made any transactions.
              </Box>
            </Grid>
            <Grid item>
              <Box component="p" className="body-text">
                Click <strong>"New Transaction"</strong> to add a new
                transaction.
              </Box>
            </Grid>
          </Grid>
        </>
      );
    }
  }

  changeStep() {
    if (this.state.activeStep == 0) {
      this.setState({
        activeStep: 1,
      });
    } else if (this.state.activeStep == 1) {
      this.setState({
        activeStep: 0,
      });
    }
  }

  RenderStep() {
    switch (this.state.activeStep) {
      case 0:
        return (
          <Box>
            <Box style={{width:'100%'}}>
              <Grid container justify="center">
                <img src={require("../../assets/social-details-form.png")} style={{width: '250px'}}/>
              </Grid>
            </Box>
            <Box marginTop={2}>
              <Grid container justify="flex-end">
                <Button onClick={this.changeStep} className="next-button" style={{width:"20%"}}>Next</Button>
              </Grid>
            </Box>
          </Box>
        );
      case 1:
        return(
          <Box>
            <Grid style={{width:'100%'}}>
              <Box paddingX={3}>
                <Grid direction="column">
                  <Grid item md={12} className="social-details-form-field">
                    <TextField variant="outlined" fullWidth label="First Name"/>
                  </Grid>
                  <Grid item md={12} className="social-details-form-field">
                    <TextField variant="outlined" fullWidth label="Last Name"/>
                  </Grid>
                  <Grid item md={12} className="social-details-form-field">
                    <TextField variant="outlined" fullWidth label="Phone Number"/>
                  </Grid>
                  <FormControl variant="outlined" className="social-details-form-field">
                    <InputLabel id="role">Role</InputLabel>
                    <Select labelId="role" id="role_select" name="role" label="Role">
                      <MenuItem value="Buyer">Buyer</MenuItem>
                      <MenuItem value="Seller">Seller</MenuItem>
                      <MenuItem value="Buyer Agent">Buyer Agent</MenuItem>
                      <MenuItem value="Seller Agent">Seller Agent</MenuItem>
                      <MenuItem value="Title Agent">Title Agent</MenuItem>
                      <MenuItem value="Escrow Agent">Escrow Agent</MenuItem>
                      <MenuItem value="Home Inspector">Home Inspector</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
            <Box marginTop={2}>
            <Grid container justify="flex-start">
              <Grid item md={6}>
                <Button onClick={this.changeStep} className="cancel-back-button" style={{width:"20%"}}>Back</Button>
              </Grid>
              <Grid item md={6} justify="flex-end">
                <Typography align="right">
                  <Button onClick={this.SocialDetailClose} className="next-button" style={{width:"50%"}}>Confirm</Button>
                </Typography>
              </Grid>
            </Grid>
            </Box>
          </Box>
        );
      default:
    }
  }

  SocialDetailClose(){
    this.setState({
      socialModal: false,
    })
  }

  SocialDetailModal(){
    return (
      <Modal title="Fill in Details" visible={this.state.socialModal} modalWidth={500}>
          <Stepper activeStep={this.state.activeStep}>
              <Step>
                  <StepLabel />
              </Step>
              <Step>
                  <StepLabel />
              </Step>
          </Stepper>
          <this.RenderStep/>
      </Modal>
  );
  }

  render() {
    //console.log(this.props.user); // To log the fact the user data that is stored during signup is available here
    //console.log(this.props.transaction); // To log the transaction state after fetching it from the user
    return (
      <Box component="div">
        <Container>
          <NavBar />
          <this.SocialDetailModal/>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            className="row-header"
          >
            <h2 className="header-transaction">My Transactions</h2>
          </Grid>
          <this.RenderTransactionBody transaction={this.props.transaction} />
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignitems="center"
          >
            <Box component="div" m={-2}>
              <NewTransactionButton />
            </Box>
          </Grid>
        </Container>
      </Box>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TransactionDasboard);
