import React, { Component } from "react";
import "./Transaction.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Modal from "../shared/modal/Modal";
import NewTransactionButton from "./NewTransactionButtonComponent";
import NavBar from "../shared/navbar/navbar";
import SearchBar from "../shared/searchbar/SearchBarComponent";
import TransactionCardGroup from "./TransactionCardGroup";
import { connect } from "react-redux";
import { editUser } from "../../actions/userActions";
import { validateFormField } from "../../global_func_lib";
import { bindActionCreators } from "redux";
import {
  Button,
  Container,
  Typography,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import { CheckIcon } from "@primer/octicons-react";
const mapStateToProps = (state) => ({
  user: state.user,
  transaction: state.transaction,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      editUser,
    },
    dispatch
  );
};

class TransactionDasboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      socialModal: false,
      firstName: null,
      lastName: null,
      phone: null,
      state: null,
      role: null,
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        role: null,
        state: null,
      },
      validated: false,
    };
    this.RenderTransactionBody = this.RenderTransactionBody.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.RenderStep = this.RenderStep.bind(this);
    this.CheckValidity = this.CheckValidity.bind(this);
    this.SocialDetailModal = this.SocialDetailModal.bind(this);
    this.SocialDetailClose = this.SocialDetailClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Component did mount is used to fetch the transactions of the user form the redux store
    if (
      this.props.user.firstName === null ||
      this.props.user.lastName === null ||
      this.props.user.phone === null ||
      this.props.user.role === null ||
      this.props.user.state === null
    )
      // If any of these fields are empty then open the fill in details modal
      this.setState({
        socialModal: true,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        phone: this.props.user.phone,
        role: this.props.user.role,
        state: this.props.user.state,
      });
  }

  handleChange(event) {
    const { name, value } = event.target;
    let errors = this.state.errors;
    let formFieldError = {
      hasError: false,
      errorText: null,
    };
    formFieldError = validateFormField(value, name);
    switch (name) {
      case "firstName":
        errors.firstName = formFieldError.errorText;
        break;
      case "lastName":
        errors.lastName = formFieldError.errorText;
        break;
      case "phone":
        errors.phone = formFieldError.errorText;
        break;
      case "role":
        errors.role = formFieldError.errorText;
        break;
      case "state":
        errors.state = formFieldError.errorText;
        break;
      default:
    }
    this.setState({ errors, [name]: value });
    if (
      this.state.firstName != null &&
      this.state.lastName != null &&
      this.state.phone != null &&
      this.state.role != null &&
      this.state.state != null
    ) {
      this.setState({ validated: true });
    }
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
    }
  }

  RenderStep() {
    switch (this.state.activeStep) {
      case 0:
        return (
          <Box>
            <Box style={{ width: "100%" }}>
              <Grid container justify="center">
                <img
                  src={require("../../assets/social-details-form.png")}
                  style={{ width: "250px" }}
                />
              </Grid>
            </Box>
            <Box marginTop={2}>
              <Grid container justify="flex-end">
                <Button
                  onClick={this.changeStep}
                  className="next-button"
                  style={{ width: "20%" }}
                >
                  Next
                </Button>
              </Grid>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Grid style={{ width: "100%" }}>
              <Box paddingX={3}>
                <Grid direction="column">
                  <Grid item md={12} className="social-details-form-field">
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="First Name"
                      name="firstName"
                      onBlur={this.handleChange}
                      onChange={this.handleChange}
                      defaultValue={this.state.firstName}
                      helperText={this.state.errors.firstName}
                      error={this.state.errors.firstName !== null}
                    />
                  </Grid>
                  <Grid item md={12} className="social-details-form-field">
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      onBlur={this.handleChange}
                      onChange={this.handleChange}
                      defaultValue={this.state.lastName}
                      helperText={this.state.errors.lastName}
                      error={this.state.errors.lastName !== null}
                    />
                  </Grid>
                  <Grid item md={12} className="social-details-form-field">
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      onBlur={this.handleChange}
                      onChange={this.handleChange}
                      defaultValue={this.state.phone}
                      helperText={this.state.errors.phone}
                      error={this.state.errors.phone !== null}
                    />
                  </Grid>
                  <FormControl
                    variant="outlined"
                    className="social-details-form-field"
                  >
                    <InputLabel id="role">Role</InputLabel>
                    <Select
                      labelId="role"
                      id="role_select"
                      name="role"
                      label="Role"
                      onBlur={this.handleChange}
                      onChange={this.handleChange}
                      defaultValue={this.state.role}
                      helperText={this.state.errors.role}
                      error={this.state.errors.role !== null}
                    >
                      <MenuItem value="buyer">Buyer</MenuItem>
                      <MenuItem value="seller">Seller</MenuItem>
                      <MenuItem value="buyer-agent">Buyer Agent</MenuItem>
                      <MenuItem value="seller-agent">Seller Agent</MenuItem>
                      <MenuItem value="title-agent">Title Agent</MenuItem>
                      <MenuItem value="Escrow-agent">Escrow Agent</MenuItem>
                      <MenuItem value="Home Inspector">Home Inspector</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className="social-details-form-field"
                  >
                    <InputLabel id="role">State</InputLabel>
                    <Select
                      labelId="role"
                      id="role_select"
                      name="state"
                      label="State"
                      onBlur={this.handleChange}
                      onChange={this.handleChange}
                      defaultValue={this.state.state}
                      helperText={this.state.errors.state}
                      error={this.state.errors.state !== null}
                    >
                      <MenuItem value="TX">Texas</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
            <Box marginTop={2}>
              <Grid container justify="flex-end">
                <Grid item md={6} justify="flex-end">
                  <Typography align="right">
                    <Button
                      onClick={this.CheckValidity}
                      className="next-button"
                      style={{ width: "50%" }}
                      disabled={!this.state.validated}
                    >
                      <CheckIcon /> &nbsp; Confirm
                    </Button>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      default:
    }
  }

  CheckValidity() {
    let errors = {
      firstName: this.state.errors.firstName,
      lastName: this.state.errors.lastName,
      phone: this.state.errors.phone,
      role: this.state.errors.role,
      state: this.state.errors.state,
    };
    if (this.validForm(errors) && this.state.validated) {
      this.SocialDetailClose();
    }
  }

  validForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val !== null && (valid = false));
    return valid;
  };

  SocialDetailClose() {
    this.props.editUser(
      this.state.firstName,
      this.state.lastName,
      this.props.user.email,
      this.state.role,
      this.state.phone,
      this.state.state
    ); // Call editUser here
    this.setState({
      socialModal: false,
      firstName: "",
      lastName: "",
      phone: "",
      role: "",
      state: "",
    });
  }

  SocialDetailModal() {
    return (
      <Modal
        title="Fill in Details"
        visible={this.state.socialModal}
        modalWidth={500}
      >
        <this.RenderStep />
      </Modal>
    );
  }

  render() {
    return (
      <Box component="div">
        <Container>
          <NavBar />
          <this.SocialDetailModal />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionDasboard);
