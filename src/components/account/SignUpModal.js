import React, { Component } from "react";
import Modal from "../shared/modal/Modal";
import SignupFormStep1 from "./SignUpFormStep1";
import SignupFormStep2 from "./SignupFormStep2";
import SignupFormStep3 from "./SignupFormStep3";
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import "./SignUpModal.css";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signupUser, acceptInvitationSignUp } from "../../actions/userActions";
import { validateFormField } from "../../global_func_lib";

const mapStateToProps = (state) => ({
  user: state.user,
  utils: state.utils,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      signupUser,
      acceptInvitationSignUp
    },
    dispatch
  );
};

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      role: null,
      state: null,
      password: null,
      confirm: null,
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        role: null,
        state: null,
        password: null,
        confirm: null,
      },
      validatedForm1: false,
      validatedForm2: false,
      authenticated: false,
    };

    this.RenderStepsForm = this.RenderStepsForm.bind(this);
    this.addStep = this.addStep.bind(this);
    this.subStep = this.subStep.bind(this);
    this.closeSignUpModal = this.closeSignUpModal.bind(this);
    this.addStep = this.addStep.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);
  }

  closeSignUpModal() {
    // closing Signup Modal and setting the state to the default value
    this.props.dismissCallback();
    this.setState({
      activeStep: 0,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      password: null,
      state: null,
      role: null,
      confirm: null,
      validatedForm1: false,
      validatedForm2: false,
    });
  }

  submitSignUp() {
    this.addStep(); // Moving to the next step
    let newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      role: this.state.role,
      state: this.state.state,
      password: this.state.password,
    };
    this.props.signupUser(newUser);
  }

  acceptInvitation(){
    this.addStep(); // Moving to the next step
    let newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      role: this.state.role,
      state: this.state.state,
      password: this.state.password,
    };
    this.props.acceptInvitationSignUp(this.props.transactionId,newUser);
  }


  handleChange = (event) => {
    event.preventDefault();
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
      case "email":
        errors.email = formFieldError.errorText;
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
      case "password":
        errors.password = formFieldError.errorText;
        break;
      case "confirm":
        errors.confirm =
          value !== this.state.password ? "Passwords did not match" : null;
        break;
      default:
    }

    this.setState({ errors, [name]: value });
    if (
      this.state.firstName != null &&
      this.state.lastName != null &&
      this.state.email != null &&
      this.state.phone != null
    ) {
      this.setState({ validatedForm1: true });
    }
    if (
      this.state.role != null &&
      this.state.state != null &&
      this.state.password != null &&
      this.state.confirm != null
    ) {
      this.setState({ validatedForm2: true });
    }
  };

  addStep() {
    let errorsStep_1 = {
      // Setting up an object to check if the fields in the first step have an error
      firstName: this.state.errors.firstName,
      lastName: this.state.errors.lastName,
      email: this.state.errors.email,
      phone: this.state.errors.phone,
    };
    let errorsStep_2 = {
      // Setting up an object to check if the fields in the second step have an error
      password: this.state.errors.password,
      confirm: this.state.errors.confirm,
      role: this.state.errors.role,
      state: this.state.errors.state,
    };
    if (
      this.state.activeStep === 0 &&
      this.validForm(errorsStep_1) &&
      this.state.validatedForm1 === true
    ) {
      // if no errors in the first step and the active step is 0
      this.setState({
        activeStep: 1,
      });
    }
    if (
      this.state.activeStep === 1 &&
      this.validForm(errorsStep_2) &&
      this.state.validatedForm2 === true
    ) {
      // if no errors in the second step and the active step is 1
      this.setState({
        activeStep: 2,
      });
    }
  }

  subStep() {
    var steps = this.state.activeStep - 1;
    this.setState({
      activeStep: steps,
    });
  }

  validForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val !== null && (valid = false));
    return valid;
  };

  RenderStepsForm() {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirm,
      validatedForm1,
      validatedForm2,
    } = this.state;
    const values = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirm,
      validatedForm1,
      validatedForm2,
    };

    switch (this.state.activeStep) {
      case 0:
        return (
          <SignupFormStep1
            handleChange={this.handleChange}
            addStep={this.addStep}
            errors={this.state.errors}
            values={values}
          />
        );
      case 1:
        return (
          <SignupFormStep2
            handleChange={this.handleChange}
            addStep={this.addStep}
            subStep={this.subStep}
            errors={this.state.errors}
            values={values}
            submit={(this.props.invitation)? (()=> this.acceptInvitation()) : (() => this.submitSignUp())}
          />
        );
      case 2:
        return <SignupFormStep3 />;
      default:
    }
  }

  render() {
    return (
      <Modal
        title="Sign Up"
        visible={this.props.visible}
        dismissCallback={this.closeSignUpModal}
      >
        <ReallosLoaderWithOverlay
          visible={false /*Change this to this.props.utils.visible*/}
        />
        <Stepper activeStep={this.state.activeStep}>
          <Step>
            <StepLabel />
          </Step>
          <Step>
            <StepLabel />
          </Step>
          <Step>
            <StepLabel />
          </Step>
        </Stepper>
        <this.RenderStepsForm />
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpModal);
