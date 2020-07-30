import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editingUser } from "../../actions/userActions";
import "./ProfileEditDrawer.css";
import SideDrawer from "../shared/drawer/SideDrawer";
import Modal, { ModalActionFooter } from "../shared/modal/Modal";
import UserAvatar from "../../assets/user.png";
import { PencilIcon } from "@primer/octicons-react";
import PhotoUploadModal from "../photo-uploader/PhotoUploader";
import { myFirestore } from "../../Config/MyFirebase";

import {
  USER_ROLES,
  getRoleLabel,
  validateFormField,
} from "../../global_func_lib";

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Avatar,
  Badge,
  Fab,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormGroup,
  FormHelperText,
  Snackbar,
} from "@material-ui/core";
import { bindActionCreators } from "redux";

/**
 * Display a "Profile Edit" Side Drawer
 * @augments {React.Component<Props>}
 */

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      editingUser,
    },
    dispatch
  );
};

class ProfileEditDrawer extends React.Component {
  constructor() {
    super();
    this.updateModalTextValues = {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      phone: "",
    };

    this.state = {
      firstName: "",
      lastName: "",
      role: "",
      email: "",
      phone: "",
      state: "",
      Loaded: false,
      isUpdateModalVisible: false,
      isUploadModalVisible: false,
      isSnackbarVisible: false,
      updateModalType: "",
      updateModalFieldErrors: {
        firstName: validateFormField("", "dummy"),
        lastName: validateFormField("", "dummy"),
        role: validateFormField("", "dummy"),
        email: validateFormField("", "dummy"),
        phone: validateFormField("", "dummy"),
      },
      profilePhoto: UserAvatar
    };
    this.getProfilePhoto = this.getProfilePhoto.bind(this);
    this.showUploadModalVisibility = this.showUploadModalVisibility.bind(this);
    this.dismissUploadModal = this.dismissUploadModal.bind(this);
    this.showSnackbar = this.showSnackbar.bind(this);
    this.dismissSnackbar = this.dismissSnackbar.bind(this);

    this.userId = localStorage.getItem("userID");
  }

  componentDidMount() {
    this.getProfilePhoto();
  }

  getProfilePhoto() {
    myFirestore
      .collection("users")
      .doc(this.userId)
      .get()
      .then((doc) => {
        try {
          let profilePhotoURL = doc.data().photoURL;
          console.log(profilePhotoURL)
          
          this.setState({
            profilePhoto: profilePhotoURL
          })
        }
        catch (err) {
          // no-op
        }
      });
  }

  static propTypes = {
    /**
     * Set visibility of "Profile Edit" Side Drawer
     */
    visible: PropTypes.bool,

    /**
     * Callback function to dismiss the Side Drawer
     * when clicked outside the drawer
     */
    dismissCallback: PropTypes.func,
  };

  submitEdits() {
    // function to submit the edits to the database
    let newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      role: this.state.role,
      email: this.state.email,
      phone: this.state.phone,
      state: this.state.state,
    };
    this.props.editingUser(newUser);
    this.props.dismissCallback();
  }

  cancelEdits() {
    // fucntion to cancel the edits
    this.setState({
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      email: this.props.user.email,
      phone: this.props.user.phone,
      role: this.props.user.role,
      state: this.props.user.state,
      Loaded: true,
    });
    this.props.dismissCallback();
  }

  updateStateOnLoading() {
    if (!this.state.Loaded)
      // To check if the state has been changed or not
      this.setState({
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        phone: this.props.user.phone,
        role: this.props.user.role,
        state: this.props.user.state,
        Loaded: true,
      });
  }

  updateUserData(mode) {
    this.setState({
      isUpdateModalVisible: true,
      updateModalType: mode,
    });
  }

  dismissUpdateModal(stateData) {
    setTimeout(() => {
      this.updateModalTextValues = {
        firstName: "",
        lastName: "",
        role: "",
        email: "",
        phone: "",
      };

      this.setState({
        updateModalType: "NONE_TYPE",
      });
    }, 300);

    this.setState({
      isUpdateModalVisible: false,
      ...stateData,
    });
  }

  showUploadModalVisibility() {
    this.setState({
      isUploadModalVisible: true,
    });
  }

  dismissUploadModal() {
    this.setState({
      isUploadModalVisible: false,
    });
    this.getProfilePhoto();
  }

  showSnackbar(message) {
    this.setState({
      isSnackbarVisible: true,
      snackbarMessage: message,
    });
  }

  dismissSnackbar() {
    this.setState({
      isSnackbarVisible: false,
    });
  }

  renderUpdateUserDataModal(mode) {
    let modalTitle;
    let modalContent;
    let _saveChanges;
    let _handleChange;

    switch (mode) {
      case "USER_NAME":
        let _errors = {
          firstName: validateFormField("", "dummy"),
          lastName: validateFormField("", "dummy"),
        };

        _saveChanges = () => {
          let validationFirstName = validateFormField(
            this.updateModalTextValues.firstName,
            "name"
          );

          let validationLastName = validateFormField(
            this.updateModalTextValues.lastName,
            "name"
          );

          _errors = {
            firstName: validationFirstName,
            lastName: validationLastName,
          };

          if (!validationFirstName.hasError && !validationLastName.hasError) {
            this.dismissUpdateModal({
              firstName: this.updateModalTextValues.firstName.trim(),
              lastName: this.updateModalTextValues.lastName.trim(),
            });
          }

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              ..._errors,
            },
          });
        };

        _handleChange = (e, fieldName) => {
          let fieldValidation = validateFormField(e.target.value, "name");

          if (fieldName === "firstName") {
            this.updateModalTextValues.firstName = e.target.value;

            _errors = {
              firstName: fieldValidation,
              lastName: _errors.lastName,
            };
          } else {
            this.updateModalTextValues.lastName = e.target.value;

            _errors = {
              firstName: _errors.firstName,
              lastName: fieldValidation,
            };
          }

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              ..._errors,
            },
          });
        };

        modalTitle = "Update Name";
        modalContent = (
          <div>
            <p style={{ marginBottom: 30 }}>
              Your current name is "
              <strong>
                {`${this.props.user.firstName} ${this.props.user.lastName}`}
              </strong>
              ". Enter a new name to change your current name.
            </p>

            <FormGroup>
              <TextField
                variant="outlined"
                label="New First Name"
                style={{ width: "100%" }}
                error={this.state.updateModalFieldErrors.firstName.hasError}
                helperText={
                  this.state.updateModalFieldErrors.firstName.errorText
                }
                onChange={(e) => _handleChange(e, "firstName")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") _saveChanges();
                }}
              />

              <TextField
                variant="outlined"
                label="New Last Name"
                style={{ width: "100%", marginTop: 10 }}
                error={this.state.updateModalFieldErrors.lastName.hasError}
                helperText={
                  this.state.updateModalFieldErrors.lastName.errorText
                }
                onChange={(e) => _handleChange(e, "lastName")}
                onKeyPress={(e) => {
                  if (e.key === "Enter") _saveChanges();
                }}
              />
            </FormGroup>

            <ModalActionFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.dismissUpdateModal()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => _saveChanges()}
              >
                Done
              </Button>
            </ModalActionFooter>
          </div>
        );

        break;

      case "USER_ROLE":
        _saveChanges = () => {
          let fieldValidation = validateFormField(
            this.updateModalTextValues.role,
            "role"
          );

          if (!fieldValidation.hasError) {
            this.dismissUpdateModal({
              role: this.updateModalTextValues.role,
            });
          }

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              role: fieldValidation,
            },
          });
        };

        _handleChange = (e) => {
          let fieldValidation = validateFormField(e.target.value, "role");

          this.updateModalTextValues.role = e.target.value;

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              role: fieldValidation,
            },
          });
        };

        modalTitle = "Update Role";
        modalContent = (
          <div>
            <p style={{ marginBottom: 30 }}>
              Your current role is "
              <strong>{getRoleLabel(this.state.role)}</strong>". Select a new
              role to change your current role.
            </p>

            <FormControl variant="outlined" style={{ width: "100%" }}>
              <InputLabel id="new-role">New Role</InputLabel>

              <Select
                labelId="new-role"
                label="New Role"
                variant="outlined"
                error={this.state.updateModalFieldErrors.role.hasError}
                onChange={(e) => _handleChange(e)}
              >
                {USER_ROLES.map((role) => {
                  return <MenuItem value={role.value}>{role.label}</MenuItem>;
                })}
              </Select>

              <FormHelperText error>
                {this.state.updateModalFieldErrors.role.errorText}
              </FormHelperText>
            </FormControl>

            <ModalActionFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.dismissUpdateModal()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => _saveChanges()}
              >
                Done
              </Button>
            </ModalActionFooter>
          </div>
        );

        break;

      case "USER_EMAIL":
        _saveChanges = () => {
          let fieldValidation = validateFormField(
            this.updateModalTextValues.email,
            "email"
          );

          if (!fieldValidation.hasError) {
            this.dismissUpdateModal({
              email: this.updateModalTextValues.email,
            });
          }

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              email: fieldValidation,
            },
          });
        };

        _handleChange = (e) => {
          let fieldValidation = validateFormField(e.target.value, "email");

          this.updateModalTextValues.email = e.target.value;

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              email: fieldValidation,
            },
          });
        };

        modalTitle = "Update Email";
        modalContent = (
          <div>
            <p style={{ marginBottom: 30 }}>
              Your current email is "<strong>{this.state.email}</strong>". Enter
              a new email to change your current email.
            </p>

            <TextField
              variant="outlined"
              label="New Email"
              style={{ width: "100%" }}
              error={this.state.updateModalFieldErrors.email.hasError}
              helperText={this.state.updateModalFieldErrors.email.errorText}
              onChange={(e) => _handleChange(e)}
              onKeyPress={(e) => {
                if (e.key === "Enter") _saveChanges();
              }}
            />

            <ModalActionFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.dismissUpdateModal()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => _saveChanges()}
              >
                Done
              </Button>
            </ModalActionFooter>
          </div>
        );

        break;

      case "USER_PHONE":
        _saveChanges = () => {
          let fieldValidation = validateFormField(
            this.updateModalTextValues.phone,
            "phone"
          );

          if (!fieldValidation.hasError) {
            this.dismissUpdateModal({
              phone: this.updateModalTextValues.phone,
            });
          }

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              phone: fieldValidation,
            },
          });
        };

        _handleChange = (e) => {
          let fieldValidation = validateFormField(e.target.value, "phone");

          this.updateModalTextValues.phone = e.target.value;

          this.setState({
            updateModalFieldErrors: {
              ...this.state.updateModalFieldErrors,
              phone: fieldValidation,
            },
          });
        };

        modalTitle = "Update Phone Number";
        modalContent = (
          <div>
            <p style={{ marginBottom: 30 }}>
              Your current phone number is "<strong>{this.state.phone}</strong>
              ". Enter a new phone number to change the current one.
            </p>

            <TextField
              variant="outlined"
              label="New Phone Number"
              style={{ width: "100%" }}
              error={this.state.updateModalFieldErrors.phone.hasError}
              helperText={this.state.updateModalFieldErrors.phone.errorText}
              onChange={(e) => _handleChange(e)}
              onKeyPress={(e) => {
                if (e.key === "Enter") _saveChanges();
              }}
            />

            <ModalActionFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.dismissUpdateModal()}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => _saveChanges()}
              >
                Done
              </Button>
            </ModalActionFooter>
          </div>
        );

        break;

      default:
        modalTitle = "No Title";
        modalContent = <></>;
        break;
    }

    return (
      <Modal
        visible={this.state.isUpdateModalVisible}
        title={modalTitle}
        disableBackdropBlur={true}
        dismissCallback={() => this.dismissUpdateModal()}
        modalWidth={520}
      >
        {modalContent}
      </Modal>
    );
  }

  render() {
    let { visible, dismissCallback } = this.props;

    if (this.props.user.id !== null) {
      this.updateStateOnLoading();
    }

    return (
      <div className="profile-edit-drawer">
        <SideDrawer
          title="Edit Profile"
          visible={visible}
          dismissCallback={dismissCallback}
          side="right"
        >
          <Grid className="profile-edit-avatar" container justify="center">
            <Badge
              overlap="circle"
              badgeContent={
                <Fab
                  size="small"
                  style={{
                    background: "#ffffff",
                  }}
                  onClick={this.showUploadModalVisibility}
                >
                  <PencilIcon />
                </Fab>
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                src={this.state.profilePhoto}
                alt={`${this.state.firstName} ${this.state.lastName}`}
                style={{ width: 150, height: 150 }}
              />
            </Badge>
          </Grid>
          <ListItem>
            <ListItemText
              primary="Name"
              secondary={`${this.state.firstName} ${this.state.lastName}`}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={() => this.updateUserData("USER_NAME")}>
                <PencilIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Role"
              secondary={getRoleLabel(this.state.role)}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={() => this.updateUserData("USER_ROLE")}>
                <PencilIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={this.state.email} />

            <ListItemSecondaryAction />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Phone Number"
              secondary={`+1 ${this.state.phone}`}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={() => this.updateUserData("USER_PHONE")}>
                <PencilIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <div className="profile-edit-footer-action-group">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => this.cancelEdits()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.submitEdits()}
            >
              Save
            </Button>
          </div>
        </SideDrawer>
        <PhotoUploadModal
          dismissCallback={this.dismissUploadModal}
          visible={this.state.isUploadModalVisible}
          showSnackbarCallback={this.showSnackbar}
        />

        <Snackbar
          open={this.state.isSnackbarVisible}
          onClose={this.dismissSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          message={this.state.snackbarMessage}
        />

        {this.renderUpdateUserDataModal(this.state.updateModalType)}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditDrawer);
