import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MediaQuery from "react-responsive";
import {
  addTask,
  deleteTask,
  editTask,
  getTask,
  completeTask,
} from "../../actions/todoActions";
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import {
  Container,
  Grid,
  Fab,
  FormGroup,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Card,
  Box,
  IconButton,
  Avatar,
} from "@material-ui/core";

import {
  PlusIcon,
  TagIcon,
  PencilIcon,
  CalendarIcon,
  PersonIcon,
  CheckIcon,
  XIcon,
  AlertIcon,
  ArrowRightIcon,
  IssueOpenedIcon,
  CheckCircleFillIcon,
} from "@primer/octicons-react";
import SideDrawer from "../shared/drawer/SideDrawer";
import NavBar from "../shared/navbar/navbar";
import NavRail from "../shared/navigation_rail/TransactionNavRail";
import SearchBar from "../shared/searchbar/SearchBarComponent";
import Modal from "../shared/modal/Modal";
import { validateFormField, getDecodedHash } from "../../global_func_lib";
import "./Todo.css";

const mapStateToProps = (state) => {
  // mapping the state of the store to the props of the component
  return {
    todo: state.todo,
    transaction: state.transaction,
    user: state.user,
    people: state.people,
    utils: state.utils,
  };
};

const mapDispatchToProps = (dispatch) => {
  // This is to map the actions to the props of the component
  return bindActionCreators(
    {
      addTask,
      deleteTask,
      editTask,
      getTask,
      completeTask,
    },
    dispatch
  );
};

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewTaskFormOpen: false,
      isModalOpen: false, // To make sure the task modal is open or not
      editId: null,
      title: "",
      description: "",
      date: "",
      to: "",
      todo: null,
      errors: {
        title: null,
        description: null,
        date: null,
        to: null,
      },
      expandedTask: {
        id: "",
        title: "",
        description: "",
        date: "",
        to: {},
        from: {},
        completed: false,
      },
      validated: false,
      filteredTodoList: []
    };

    this.RenderToDo = this.RenderToDo.bind(this);
    this.toggleNewTaskForm = this.toggleNewTaskForm.bind(this); // binding it to the particular instance of the class
    this.handleChange = this.handleChange.bind(this);
    this.cancelAddTask = this.cancelAddTask.bind(this);
    this.validForm = this.validForm.bind(this);
    this.validTask = this.validTask.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.RenderToDoModal = this.RenderToDoModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.expandTask = this.expandTask.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.getDeadlineText = this.getDeadlineText.bind(this);
    this.markCompleted = this.markCompleted.bind(this);
  }

  componentDidMount() {
    // when the component is mounted
    this.props.getTask(
      this.props.match.params.tid,
      this.props.people.length,
      this.props.user.id
    ); // sending the Transaction id and the lenght of people stored in redux
  }

  getIcon(deadline_date) {
    var d = new Date();
    var currentDate = d.getTime();
    var deadlineDate = Date.parse(deadline_date);
    var diff = (deadlineDate - currentDate) / (1000 * 60 * 60 * 24);
    if (diff <= 3 && diff >= 1) {
      return <AlertIcon className="alert-color" size={20} />;
    } else if (diff < 1) {
      return <IssueOpenedIcon className="danger-color" size={20} />;
    } else if (diff > 3) {
      return <CheckIcon className="success-color" size={20} />;
    }
  }

  markCompleted(id, taskId) {
    // Marking the task completed
    this.props.completeTask(id, taskId);
    this.toggleModal();
  }

  getDeadlineText(deadline_date) {
    var d = new Date();
    var currentDate = d.getTime();
    var deadlineDate = Date.parse(deadline_date);
    var diff = (deadlineDate - currentDate) / (1000 * 60 * 60 * 24);
    if (diff <= 3 && diff >= 1) {
      return (
        <Typography className="alert-color">
          This Task is going to hit the deadline soon!
        </Typography>
      );
    } else if (diff < 1) {
      return (
        <Typography className="danger-color">
          This Task is going to hit the deadline soon!
        </Typography>
      );
    } else if (diff > 3) {
      return (
        <Typography className="success-color">
          This Task is going to hit the deadline soon!
        </Typography>
      );
    }
  }

  RenderTodoItem(todo) {
    return (
      <Box component="div" marginTop={2}>
        <Card
          className={
            getDecodedHash(this.props.location) === `#${todo.id}`
              ? "paper-highlight"
              : ""
          }
          elevation={3}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-around"
            spacing={1}
          >
            <div
              onClick={() => this.expandTask(todo)}
              style={{
                width: "91.6%",
                cursor: "pointer",
                marginTop: "5px",
                marginBottom: "5px",
              }}
            >
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="space-around"
                spacing={1}
              >
                <Grid item>
                  <Box paddingLeft={2}>{this.getIcon(todo.Date)}</Box>
                </Grid>
                <Grid item>
                  <Box marginY={2}>
                    {false ? ( // fetch the image of the person here
                      <Avatar
                        src={process.env.PUBLIC_URL + todo.From.img}
                      ></Avatar>
                    ) : (
                      <Avatar style={{ backgroundColor: "#150578" }}>
                        {todo.From.name[0]}
                      </Avatar>
                    )}
                  </Box>
                </Grid>
                <Grid item>
                  <ArrowRightIcon size={24} />
                </Grid>
                <Grid item>
                  <Box marginY={2}>
                    {false ? ( // fetch the image of the person here
                      <Avatar
                        src={process.env.PUBLIC_URL + todo.to.img}
                      ></Avatar>
                    ) : (
                      <Avatar style={{ backgroundColor: "#150578" }}>
                        {todo.To.name[0]}
                      </Avatar>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    noWrap
                    align="center"
                    style={{
                      color: "#150578",
                      fontWeight: 800,
                      fontSize: "20px",
                    }}
                  >
                    {todo.Title}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Box textOverflow="ellipsis">
                    <Typography
                      noWrap
                      align="center"
                      style={{
                        color: "#150578",
                        fontWeight: 500,
                        fontSize: "17px",
                      }}
                    >
                      {todo.Description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Typography
                    align="left"
                    style={{ color: "#150578", fontSize: "16px" }}
                  >
                    {todo.Date}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <Grid item xs={1}>
              {todo.From.email === this.props.user.email ? ( // ternary operator used to make sure only the person assiging the task has the right to edit it
                <>
                  <IconButton onClick={() => this.editTask(todo)}>
                    <PencilIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      this.props.deleteTask(
                        this.props.match.params.tid,
                        todo.id
                      )
                    }
                  >
                    <XIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() =>
                      this.props.deleteTask(
                        this.props.match.params.tid,
                        todo.id
                      )
                    }
                  >
                    <XIcon />
                  </IconButton>
                </>
              )}
            </Grid>
          </Grid>
        </Card>
      </Box>
    )
  }

  RenderToDo() {
    if (this.props.todo.length === 0) {
      // If no todo exists in the server || have to replace this with an image
      return (
        <Box style={{ width: "100%" }}>
          <Box paddingLeft={5}>
            <h1>Tasks</h1>
          </Box>
          <Grid container justify="center">
            <Box marginTop={5}>
              <img
                src={require("../../assets/no-todo.png")}
                alt={"No Todo"}
                style={{ width: "500px" }}
              />
            </Box>
          </Grid>
        </Box>
      );
    } else {
      return (
        <div style={{ paddingBottom: 30 }}>
          <Box paddingLeft={5}>
            <h1>Tasks</h1>
            <SearchBar
              list={this.props.todo}
              filterByFields={[
                "Title",
                "Description",
                "To.name",
                "To.email",
                "From.name",
                "From.email"
              ]}
              onUpdate={(filteredTodoList) => this.setState({ filteredTodoList })}
              placeholder="Search tasks by title, description, name or email"
            />
            {(this.state.filteredTodoList.length > 0)
              ? this.state.filteredTodoList.map((todo) => (
                  this.RenderTodoItem(todo)
                ))

              : <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30
                }}>
                  <div style={{ fontSize: 150, opacity: 0.5 }}>{"( >_< )"}</div>
                  <div style={{
                    fontFamily: 'Gilroy',
                    fontWeight: 'bold',
                    fontSize: 30,
                    marginTop: 50,
                    marginBottom: 10,
                  }}>
                    No Tasks Found
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    None of the tasks match the given search term.
                    <br />
                    Please check the search term.
                  </div>
                </div>
            }
          </Box>
        </div>
      );
    }
  }

  RenderToDoModal() {
    // function to render the modal
    return (
      <Modal
        title={this.state.expandedTask.title}
        modalWidth={750}
        visible={this.state.isModalOpen}
        dismissCallback={this.toggleModal}
      >
        <Grid direction="column" container spacing={1} justify="flex-start">
          <Grid item>
            <Box>
              <table>
                <tr>
                  <td>{this.getIcon(this.state.expandedTask.date)}</td>
                  <td style={{ paddingLeft: "10px", paddingTop: "4px" }}>
                    {this.state.expandedTask.completed ? ( // If the task is completed, display completed
                      <Typography>Completed</Typography>
                    ) : (
                      this.getDeadlineText(this.state.expandedTask.date)
                    )}
                  </td>
                </tr>
              </table>
            </Box>
          </Grid>
          <Grid item>
            <Box marginTop={2}>
              <Typography align="justify">
                {this.state.expandedTask.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box marginTop={1}>
              <Typography style={{ fontWeight: 800 }}>
                <table>
                  <tr>
                    <td>
                      <CalendarIcon />
                    </td>
                    <td style={{ paddingLeft: "10px", paddingTop: "4px" }}>
                      {this.state.expandedTask.date}
                    </td>
                  </tr>
                </table>
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box marginTop={2}>
              <table>
                <tr>
                  <td>
                    {false ? ( // set this image to false
                      <Avatar
                        src={
                          process.env.PUBLIC_URL +
                          this.state.expandedTask.to.img
                        }
                      ></Avatar>
                    ) : (
                      <Avatar style={{ backgroundColor: "#150578" }}>
                        {this.state.expandedTask.to.name ? (
                          this.state.expandedTask.to.name[0]
                        ) : (
                          <></>
                        )}
                      </Avatar>
                    )}
                  </td>
                  <td style={{ paddingLeft: "15px" }}>
                    Assigned to{" "}
                    <strong>{this.state.expandedTask.to.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingTop: "10px" }}>
                    {false ? ( // get the image of the user
                      <Avatar
                        src={
                          process.env.PUBLIC_URL +
                          this.state.expandedTask.from.img
                        }
                      ></Avatar>
                    ) : (
                      <Avatar style={{ backgroundColor: "#150578" }}>
                        {this.state.expandedTask.from.name ? (
                          this.state.expandedTask.from.name[0]
                        ) : (
                          <></>
                        )}
                      </Avatar>
                    )}
                  </td>
                  <td style={{ paddingLeft: "15px", paddingTop: "10px" }}>
                    Assigned by{" "}
                    <strong>{this.state.expandedTask.from.name}</strong>
                  </td>{" "}
                  {/* This field should be edited with the user's name */}
                </tr>
              </table>
            </Box>
            <Typography align="right">
              {this.state.expandedTask.completed ? (
                <></>
              ) : (
                <Button
                  onClick={() =>
                    this.markCompleted(
                      this.props.match.params.tid,
                      this.state.expandedTask.id
                    )
                  }
                  startIcon={<CheckCircleFillIcon />}
                  style={{ backgroundColor: "#150578", color: "#fff" }}
                >
                  Completed
                </Button>
              )}
            </Typography>
          </Grid>
        </Grid>
      </Modal>
    );
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  toggleNewTaskForm() {
    // to toggle the new task form
    if (this.state.isNewTaskFormOpen === true) {
      this.setState({
        isNewTaskFormOpen: false,
      });
    } else {
      this.setState({
        isNewTaskFormOpen: true,
      });
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
      case "title":
        errors.title = formFieldError.errorText;
        break;
      case "description":
        errors.description = formFieldError.errorText;
        break;
      case "date":
        errors.date = formFieldError.errorText;
        break;
      case "to":
        errors.to = formFieldError.errorText;
        break;
      default:
    }

    this.setState({ errors, [name]: value });
    if (
      this.state.title !== "" &&
      this.state.description !== "" &&
      this.state.date !== "" &&
      this.state.to !== ""
    ) {
      this.setState({ validated: true });
    }
  }

  validForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val !== null && (valid = false));
    return valid;
  };

  validTask() {
    let errors = {
      title: this.state.errors.title,
      description: this.state.errors.description,
      date: this.state.errors.date,
    };
    if (this.validForm(errors) && this.state.validated === true) {
      this.addNewTask();
    }
  }

  cancelAddTask() {
    // To cancel the task and set the values of the fields to null
    this.setState({
      title: "",
      description: "",
      date: "",
      to: "",
      isNewTaskFormOpen: false,
      todo: null,
      validated: false,
    });
  }

  addNewTask() {
    // Adding new task to the redux store
    if (this.state.todo !== null) {
      // When the task is being edited
      let Task = {
        id: this.state.editId,
        title: this.state.title,
        description: this.state.description,
        date: this.state.date,
        to: this.state.to,
        from: this.props.user,
      };

      this.props.editTask(this.props.match.params.tid, Task);

      this.setState({
        title: "",
        description: "",
        date: "",
        to: "",
        todo: null,
        isNewTaskFormOpen: false,
        validated: false,
      });
    } else {
      let newTask = {
        Title: this.state.title,
        Description: this.state.description,
        Date: this.state.date,
        To: this.state.to,
        From: this.props.user,
      };

      this.props.addTask(this.props.match.params.tid, newTask);

      this.setState({
        title: "",
        description: "",
        date: "",
        to: "",
        isNewTaskFormOpen: false,
        validated: false,
      });
    }
  }

  editTask(todo) {
    // Editing task that already exist
    this.setState({
      editId: todo.id,
      title: todo.Title,
      description: todo.Description,
      date: todo.Date,
      to: todo.To,
      isNewTaskFormOpen: true,
      todo: todo,
      validated: false,
    });
  }

  expandTask(todo) {
    // opens the modal for that particular task
    this.setState({
      expandedTask: {
        id: todo.id,
        title: todo.Title,
        description: todo.Description,
        date: todo.Date,
        to: todo.To,
        from: todo.From,
        completed: todo.Completed,
      },
    });
    this.toggleModal();
  }

  render() {
    return (
      <MediaQuery minDeviceWidth={1450}>
        {(matches) => {
          if (matches) {
            return (
              <Box component="div">
                <Container>
                  <ReallosLoaderWithOverlay
                    visible={this.props.utils.Loading}
                  />
                  <NavBar />
                  <NavRail />
                  <this.RenderToDoModal />
                  <SideDrawer
                    visible={this.state.isNewTaskFormOpen}
                    side="right"
                    dismissCallback={this.toggleNewTaskForm}
                    title="Add a Task"
                  >
                    <Typography className="sub-heading-task-form">
                      What is the task about?
                    </Typography>
                    <FormGroup row className="form-group">
                      <TagIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        label="Title"
                        className="form-fields"
                        value={this.state.title}
                        name="title"
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        helperText={this.state.errors.title}
                        error={this.state.errors.title !== null}
                      />
                    </FormGroup>
                    <FormGroup row className="form-group">
                      <PencilIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        label="Description"
                        className="form-fields"
                        value={this.state.description}
                        multiline
                        name="description"
                        rows={8}
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        helperText={this.state.errors.description}
                        error={this.state.errors.description !== null}
                      />
                    </FormGroup>
                    <FormGroup row className="form-group">
                      <CalendarIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        type="date"
                        className="form-fields"
                        value={this.state.date}
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        name="date"
                        helperText={this.state.errors.date}
                        error={this.state.errors.date !== null}
                      />
                    </FormGroup>
                    <Typography className="sub-heading-task-form-2">
                      Assign to Someone
                    </Typography>
                    <FormGroup row className="form-group">
                      <PersonIcon size={30} className="tag-icon" />
                      {
                        // Checking to see if the people dropdown should be disabled or not
                        this.props.people.length !== 0 ? (
                          <Select
                            id="person_select"
                            label="Select a person"
                            className="form-fields"
                            onChange={this.handleChange}
                            onBlur={this.handleChange}
                            value={this.state.to}
                            name="to"
                          >
                            {this.props.people.map((person) => (
                              <MenuItem value={person}>{person.name}</MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <Select className="form-fields" disabled="true" />
                        )
                      }
                    </FormGroup>
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <Grid container direction="row" spacing={2}>
                          <Grid item>
                            <Button
                              variant="outlined"
                              onClick={this.cancelAddTask}
                              className="cancel-back-button"
                            >
                              cancel
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              onClick={this.validTask}
                              disabled={!this.state.validated}
                              className="next-button"
                            >
                              <CheckIcon /> &nbsp; Add Task
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </SideDrawer>
                  <this.RenderToDo />
                  <Grid
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-end"
                  >
                    <Grid item>
                      <Fab
                        variant="extended"
                        className="reallos-fab"
                        size="large"
                        onClick={this.toggleNewTaskForm}
                      >
                        <PlusIcon className="fab-icon" size={20} /> &nbsp; New
                        Task
                      </Fab>
                    </Grid>
                  </Grid>
                </Container>
              </Box>
            );
          } else {
            return (
              <Box component="div" paddingLeft={8}>
                <Container>
                  <ReallosLoaderWithOverlay
                    visible={this.props.utils.Loading}
                  />
                  <NavBar />
                  <NavRail />
                  <this.RenderToDoModal />
                  <SideDrawer
                    visible={this.state.isNewTaskFormOpen}
                    side="right"
                    dismissCallback={this.toggleNewTaskForm}
                    title="Add a Task"
                  >
                    <Typography className="sub-heading-task-form">
                      What is the task about?
                    </Typography>
                    <FormGroup row className="form-group">
                      <TagIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        label="Title"
                        className="form-fields"
                        value={this.state.title}
                        name="title"
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        helperText={this.state.errors.title}
                        error={this.state.errors.title !== null}
                      />
                    </FormGroup>
                    <FormGroup row className="form-group">
                      <PencilIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        label="Description"
                        className="form-fields"
                        value={this.state.description}
                        multiline
                        name="description"
                        rows={8}
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        helperText={this.state.errors.description}
                        error={this.state.errors.description !== null}
                      />
                    </FormGroup>
                    <FormGroup row className="form-group">
                      <CalendarIcon size={30} className="tag-icon" />
                      <TextField
                        variant="outlined"
                        type="date"
                        className="form-fields"
                        value={this.state.date}
                        onChange={this.handleChange}
                        onBlur={this.handleChange}
                        name="date"
                        helperText={this.state.errors.date}
                        error={this.state.errors.date !== null}
                      />
                    </FormGroup>
                    <Typography className="sub-heading-task-form-2">
                      Assign to Someone
                    </Typography>
                    <FormGroup row className="form-group">
                      <PersonIcon size={30} className="tag-icon" />
                      {
                        // Checking to see if the people dropdown should be disabled or not
                        this.props.people.length !== 0 ? (
                          <Select
                            id="person_select"
                            label="Select a person"
                            className="form-fields"
                            onChange={this.handleChange}
                            onBlur={this.handleChange}
                            value={this.state.to}
                            name="to"
                          >
                            {this.props.people.map((person) => (
                              <MenuItem value={person}>{person.name}</MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <Select className="form-fields" disabled="true" />
                        )
                      }
                    </FormGroup>
                    <Grid container direction="row" justify="flex-end">
                      <Grid item>
                        <Grid container direction="row" spacing={2}>
                          <Grid item>
                            <Button
                              variant="outlined"
                              onClick={this.cancelAddTask}
                              className="cancel-back-button"
                            >
                              cancel
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              onClick={this.validTask}
                              disabled={!this.state.validated}
                              className="next-button"
                            >
                              <CheckIcon /> &nbsp; Add Task
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </SideDrawer>
                  <this.RenderToDo />
                  <Grid
                    direction="row"
                    justify="flex-end"
                    alignItems="flex-end"
                  >
                    <Grid item>
                      <Fab
                        variant="extended"
                        className="reallos-fab"
                        size="large"
                        onClick={this.toggleNewTaskForm}
                      >
                        <PlusIcon className="fab-icon" size={20} /> &nbsp; New
                        Task
                      </Fab>
                    </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
