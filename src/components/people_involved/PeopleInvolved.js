import React, { Component } from "react";
import NavBar from "../shared/navbar/navbar";
import NavRail from "../shared/navigation_rail/TransactionNavRail";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import {
  getAllPeople,
  addPerson,
  deletePeople,
} from "../../actions/peopleActions";
import {
  Container,
  Grid,
  Box,
  Typography,
  Fab,
  Card,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import {
  PackageIcon,
  PlusIcon,
  XIcon,
  DotFillIcon,
  PersonIcon,
  MailIcon,
  CheckIcon,
  VerifiedIcon,
} from "@primer/octicons-react";
import Modal from "../shared/modal/Modal";
import { validateFormField, getDecodedHash } from "../../global_func_lib";
import "./PeopleInvolved.css";
import MediaQuery from "react-responsive";

const mapStateToProps = (state) => ({
  people: state.people,
  utils: state.utils,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getAllPeople,
      addPerson,
      deletePeople,
    },
    dispatch
  );
};

class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: 1,
      isModalOpen: false,
      Name: "",
      Email: "",
      Role: "",
      errors: {
        Name: null,
        Email: null,
        Role: null,
      },
      validated: false,
    };
    this.RenderPeopleInvolved = this.RenderPeopleInvolved.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addPeople = this.addPeople.bind(this);
    this.deletePeople = this.deletePeople.bind(this);
  }

  componentDidMount() {
    // when the component is mounted
    this.props.getAllPeople(this.props.match.params.tid, this.props.user.id);
  }

  toggleModal() {
    if (this.state.isModalOpen === true) {
      this.setState({
        isModalOpen: false,
        Name: "",
        Email: "",
        Role: "",
      });
    } else {
      this.setState({ isModalOpen: true });
    }
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    let formFieldError = {
      hasError: false,
      errorText: null,
    };
    formFieldError = validateFormField(value, name);
    switch (name) {
      case "name":
        errors.Name = formFieldError.errorText;
        this.setState({ Name: value });
        break;
      case "email":
        errors.Email = formFieldError.errorText;
        this.setState({ Email: value });
        break;
      case "role":
        errors.Role = formFieldError.errorText;
        this.setState({ Role: value });
        break;
      default:
    }

    this.setState({ [name]: value, errors });
    if (
      this.state.Name !== "" &&
      this.state.Email !== "" &&
      this.state.Role !== ""
    ) {
      this.setState({ validated: true });
    }
  }

  validForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val !== null && (valid = false));
    return valid;
  };

  addPeople() {
    let errors = {
      Name: this.state.errors.Name,
      Email: this.state.errors.Email,
      Description: this.state.errors.Role,
    };

    if (this.state.validated === true && this.validForm(errors)) {
      let newPerson = {
        name: this.state.name,
        email: this.state.email,
        role: this.state.role,
        accepted: false,
      }; // creating a new person

      this.props.addPerson(this.props.match.params.tid, newPerson, this.props.user.email);
      this.toggleModal();
    }
  }

  deletePeople(email) {
    this.props.deletePeople(this.props.match.params.tid, email);
  }

  RenderPeopleInvolved() {
    if (this.props.people && this.props.people.length) {
      // If there are people involved in the transaction
      const card = this.props.people.map((data) => {
        return (
          <Grid
            key={data.id}
            container
            paddingLeft={6}
            direction="column"
            alignItems="center"
            justify="center"
            spacing={1}
          >
            <Grid item paddingLeft={6} style={{ width: "100%" }}>
              <Box paddingLeft={6}>
                <Card
                  className={
                    (getDecodedHash(this.props.location) === `#${data.email}`)
                      ? 'paper-highlight'
                      : ''
                  }
                  elevation={3}
                  style={{ marginBottom: "10px" }}
                >
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    style={{ color: "#150158" }}
                  >
                    <Grid item xs={1}>
                      <Box marginY={2} paddingLeft={2}>
                        {data.img ? (
                          <Avatar
                            src={process.env.PUBLIC_URL + data.img}
                          ></Avatar>
                        ) : (
                          <Avatar style={{ backgroundColor: "#150578" }}>
                            {data.name[0]}
                          </Avatar>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box marginY={2}>
                        <Typography style={{ fontWeight: 800 }}>
                          {data.name}
                          <span style={{ paddingLeft: 12, fontWeight: 200 }}>
                            <DotFillIcon size={12} />
                          </span>
                          <span
                            style={{
                              paddingLeft: 12,
                              fontWeight: 450,
                              fontSize: 15,
                            }}
                          >
                            {data.role}
                          </span>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box marginY={1}>
                        {() =>
                          data.accepted
                            ? "Invitation accepted"
                            : "Invitation pending"
                        }
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box marginY={1} paddingRight={2}>
                        <Typography align="right" style={{ fontSize: 15 }}>
                          {data.email}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={1}>
                      <Box marginY={1}>
                        {() =>
                          data.accepted ? ( // The ternary operator is used to only render the cross for people that have not accepted the invitation
                            <></>
                          ) : (
                            <IconButton
                              onClick={() => this.deletePeople(data.email)}
                              style={{ color: "#565656" }}
                            >
                              <XIcon />
                            </IconButton>
                          )
                        }
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            </Grid>
          </Grid>
        );
      });
      return (
        <Grid container direction="column" spacing={1} paddingTop={-1}>
          <Box paddingLeft={6}>
            <Grid item>
              <h3>People Involved</h3>
            </Grid>
          </Box>
          <Box marginTop={-1}>{card}</Box>
        </Grid>
      );
    } else {
      return (
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={2}
        >
          <Grid item>
            <Box marginTop={-4}>
              <img
                src={require("../../assets/no-people-img.png")}
                alt={"No People"}
                className="no-people-image"
              />
            </Box>
          </Grid>
          <Grid item>
            <Box marginTop={-3} marginLeft={4}>
              <Typography
                style={{ fontWeight: 700 }}
                className="people-heading"
              >
                People
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box marginTop={-2.5} marginLeft={4}>
              <Typography className="people-subheading">
                Invite People to the Transaction
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }
  }

  render() {
    return (
      <MediaQuery minDeviceWidth={1450}>
        {(matches) => {
          if (matches) {
            return (
              <Box>
                <Container>
                  <ReallosLoaderWithOverlay
                    visible={this.props.utils.Loading}
                  />
                  <NavBar />
                  <NavRail />
                  <Modal
                    title="Invite people"
                    modalWidth={600}
                    visible={this.state.isModalOpen}
                    dismissCallback={this.toggleModal}
                  >
                    <Box marginTop={-3}>
                      <Typography style={{ fontSize: 15 }}>
                        Invite Someone to your transaction using thier E-mail ID
                      </Typography>
                    </Box>
                    <Grid container direction="row">
                      <Grid item>
                        <Box marginLeft={7} marginTop={3}>
                          <PersonIcon size={90} />
                        </Box>
                        <Box marginLeft={0} marginTop={2}>
                          <TextField
                            variant="outlined"
                            className="modal-name-field"
                            size="small"
                            label="Name"
                            name="name"
                            onChange={this.handleChange}
                            onBlur={this.handleChange}
                            value={this.state.Name}
                            helperText={this.state.errors.Name}
                            error={this.state.errors.Name !== null}
                          />
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box
                          marginLeft={3}
                          marginTop={3}
                          style={{ width: "100%" }}
                        >
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={1}>
                              <MailIcon size={17} />
                            </Grid>
                            <Grid xs={11}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                className="modal-right-field"
                                label="Email"
                                name="email"
                                onChange={this.handleChange}
                                onBlur={this.handleChange}
                                value={this.state.Email}
                                helperText={this.state.errors.Email}
                                error={this.state.errors.Email !== null}
                              ></TextField>
                            </Grid>
                          </Grid>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={1}>
                              <VerifiedIcon size={17} />
                            </Grid>
                            <Grid xs={11}>
                              {/*<Select value={this.state.Role} fullWidth variant="outlined" label="Role" name="Role" onChange={this.handleChange} className="modal-right-field" style={{height: '40px', marginTop: '10px'}}>
                                                      <MenuItem value='Buyer'>Buyer</MenuItem>
                                                      <MenuItem value='Seller'>Seller</MenuItem>
                                                      <MenuItem value='Buyer Agent'>Buyer Agent</MenuItem>
                                                      <MenuItem value='Seller Agent'>Seller Agent</MenuItem>
                                                      <MenuItem value='Buyer'>Home Inspector</MenuItem>
                                                      <MenuItem value='Home Inspector'>Title Agent</MenuItem>
                                                  </Select>*/}
                              <FormControl
                                variant="outlined"
                                className="modal-right-field"
                                style={{ marginTop: "10px" }}
                              >
                                <InputLabel
                                  id="role"
                                  style={{ height: "40px" }}
                                >
                                  Role
                                </InputLabel>
                                <Select
                                  labelId="role"
                                  label="Role"
                                  variant="outlined"
                                  id="select"
                                  name="role"
                                  value={this.state.Role}
                                  onChange={this.handleChange}
                                  onBlur={this.handleChange}
                                  helperText={this.state.errors.Role}
                                  error={this.state.errors.Role !== null}
                                  style={{ height: "40px" }}
                                >
                                  <MenuItem value="Buyer">Buyer</MenuItem>
                                  <MenuItem value="Seller">Seller</MenuItem>
                                  <MenuItem value="Buyer Agent">
                                    Buyer Agent
                                  </MenuItem>
                                  <MenuItem value="Seller Agent">
                                    Seller Agent
                                  </MenuItem>
                                  <MenuItem value="Title Agent">
                                    Title Agent
                                  </MenuItem>
                                  <MenuItem value="Escrow Agent">
                                    Escrow Agent
                                  </MenuItem>
                                  <MenuItem value="Home Inspector">
                                    Home Inspector
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container justify="flex-end">
                            <Box marginTop={2}>
                              <Button
                                onClick={this.addPeople}
                                variant="contained"
                                style={{
                                  backgroundColor: "#150578",
                                  color: "white",
                                }}
                                startIcon={<CheckIcon size={20} />}
                                disabled={!this.state.validated}
                              >
                                Invite
                              </Button>
                            </Box>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Modal>
                  <Box
                    component="div"
                    paddingTop={3}
                    paddingBottom={-1}
                    paddingLeft={5}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <PackageIcon size={35} />
                      </Grid>
                      <Grid item>
                        <h2>Transaction 1</h2>
                      </Grid>
                    </Grid>
                  </Box>
                  <this.RenderPeopleInvolved />
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-end"
                  >
                    <Fab
                      variant="extended"
                      className="reallos-fab"
                      size="large"
                      onClick={this.toggleModal}
                    >
                      <PlusIcon className="fab-icon" size={20} /> &nbsp; Add
                      People
                    </Fab>
                  </Grid>
                </Container>
              </Box>
            );
          } else {
            return (
              <Box component="div" paddingLeft={8} paddingBottom={30}>
                <Container>
                  <ReallosLoaderWithOverlay
                    visible={this.props.utils.Loading}
                  />
                  <NavBar />
                  <NavRail />
                  <Modal
                    title="Invite people"
                    modalWidth={600}
                    visible={this.state.isModalOpen}
                    dismissCallback={this.toggleModal}
                  >
                    <Box marginTop={-3}>
                      <Typography style={{ fontSize: 15 }}>
                        Invite Someone to your transaction using thier E-mail ID
                      </Typography>
                    </Box>
                    <Grid container direction="row">
                      <Grid item>
                        <Box marginLeft={7} marginTop={3}>
                          <PersonIcon size={90} />
                        </Box>
                        <Box marginLeft={0} marginTop={2}>
                          <TextField
                            variant="outlined"
                            className="modal-name-field"
                            size="small"
                            label="Name"
                            name="name"
                            onChange={this.handleChange}
                            onBlur={this.handleChange}
                            value={this.state.Name}
                            helperText={this.state.errors.Name}
                            error={this.state.errors.Name !== null}
                          />
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box
                          marginLeft={3}
                          marginTop={3}
                          style={{ width: "100%" }}
                        >
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={1}>
                              <MailIcon size={17} />
                            </Grid>
                            <Grid xs={11}>
                              <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                className="modal-right-field"
                                label="Email"
                                name="email"
                                onChange={this.handleChange}
                                onBlur={this.handleChange}
                                value={this.state.Email}
                                helperText={this.state.errors.Email}
                                error={this.state.errors.Email !== null}
                              ></TextField>
                            </Grid>
                          </Grid>
                          <Grid container spacing={0} alignItems="center">
                            <Grid item xs={1}>
                              <VerifiedIcon size={17} />
                            </Grid>
                            <Grid xs={11}>
                              {/*<Select value={this.state.Role} fullWidth variant="outlined" label="Role" name="Role" onChange={this.handleChange} className="modal-right-field" style={{height: '40px', marginTop: '10px'}}>
                                                      <MenuItem value='Buyer'>Buyer</MenuItem>
                                                      <MenuItem value='Seller'>Seller</MenuItem>
                                                      <MenuItem value='Buyer Agent'>Buyer Agent</MenuItem>
                                                      <MenuItem value='Seller Agent'>Seller Agent</MenuItem>
                                                      <MenuItem value='Buyer'>Home Inspector</MenuItem>
                                                      <MenuItem value='Home Inspector'>Title Agent</MenuItem>
                                                  </Select>*/}
                              <FormControl
                                variant="outlined"
                                className="modal-right-field"
                                style={{ marginTop: "10px" }}
                              >
                                <InputLabel
                                  id="role"
                                  style={{ height: "40px" }}
                                >
                                  Role
                                </InputLabel>
                                <Select
                                  labelId="role"
                                  label="Role"
                                  variant="outlined"
                                  id="select"
                                  name="role"
                                  value={this.state.Role}
                                  onChange={this.handleChange}
                                  onBlur={this.handleChange}
                                  helperText={this.state.errors.Role}
                                  error={this.state.errors.Role !== null}
                                  style={{ height: "40px" }}
                                >
                                  <MenuItem value="Buyer">Buyer</MenuItem>
                                  <MenuItem value="Seller">Seller</MenuItem>
                                  <MenuItem value="Buyer Agent">
                                    Buyer Agent
                                  </MenuItem>
                                  <MenuItem value="Seller Agent">
                                    Seller Agent
                                  </MenuItem>
                                  <MenuItem value="Title Agent">
                                    Title Agent
                                  </MenuItem>
                                  <MenuItem value="Escrow Agent">
                                    Escrow Agent
                                  </MenuItem>
                                  <MenuItem value="Home Inspector">
                                    Home Inspector
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container justify="flex-end">
                            <Box marginTop={2}>
                              <Button
                                onClick={this.addPeople}
                                variant="contained"
                                style={{
                                  backgroundColor: "#150578",
                                  color: "white",
                                }}
                                startIcon={<CheckIcon size={20} />}
                                disabled={!this.state.validated}
                              >
                                Invite
                              </Button>
                            </Box>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </Modal>
                  <Box
                    component="div"
                    paddingTop={3}
                    paddingBottom={-1}
                    paddingLeft={5}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item>
                        <PackageIcon size={35} />
                      </Grid>
                      <Grid item>
                        <h2>Transaction 1</h2>
                      </Grid>
                    </Grid>
                  </Box>
                  <this.RenderPeopleInvolved />
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-end"
                  >
                    <Fab
                      variant="extended"
                      className="reallos-fab"
                      size="large"
                      onClick={this.toggleModal}
                    >
                      <PlusIcon className="fab-icon" size={20} /> &nbsp; Add
                      People
                    </Fab>
                  </Grid>
                </Container>
              </Box>
            );
          }
        }}
      </MediaQuery>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(People);
