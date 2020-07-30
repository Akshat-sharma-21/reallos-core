import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import UserAvatar from "../../../../assets/user.png"; // This is for dummy purpose
import { accessRights } from '../../../../global_func_lib';
import { myFirestore } from "../../../../Config/MyFirebase";
import "./NotificationListItem.css";

import {
  XIcon,
  AlertIcon,
  CheckIcon,
  ClockIcon,
  UploadIcon,
  BellIcon,
  PlusIcon,
  PencilIcon,
  PaperAirplaneIcon,
  NoEntryIcon,
  EyeIcon,
  ShieldCheckIcon,
} from "@primer/octicons-react";

import {
  Grid,
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Typography,
} from "@material-ui/core";

const styles = (theme) => ({
  notificationPrimaryRead: {
    color: "#000000",
  },
  notificationSecondaryRead: {
    color: "#0000008a",
  },
  notificationPrimaryUnread: {
    color: "#0366d6",
    fontWeight: "bold",
  },
  notificationSecondaryUnread: {
    color: "#0366d6",
  },
});

class NotificationItem extends React.Component {
  /**
   * Returns Icon Component for a given notification data.
   *
   * @returns {React.Component}
   * Icon Component
   */
  getIcon() {
    switch (this.props.notificationData.type) {
      case "TASK_CREATE":
        return (
          <Avatar style={this.getNotificationColors()}>
            <PlusIcon />
          </Avatar>
        );

      case "TASK_UPDATE":
        return (
          <Avatar style={this.getNotificationColors()}>
            <PencilIcon />
          </Avatar>
        );

      case "TASK_DELETE":
        return (
          <Avatar style={this.getNotificationColors()}>
            <XIcon />
          </Avatar>
        );

      case "TASK_DUE_SOON":
        return (
          <Avatar style={this.getNotificationColors()}>
            <AlertIcon />
          </Avatar>
        );

      case "TASK_OVERDUE":
        return (
          <Avatar style={this.getNotificationColors()}>
            <ClockIcon />
          </Avatar>
        );

      case "TASK_COMPLETED":
        return (
          <Avatar style={this.getNotificationColors()}>
            <CheckIcon />
          </Avatar>
        );

      case "DOC_UPLOADED":
        return (
          <Avatar style={this.getNotificationColors()}>
            <UploadIcon />
          </Avatar>
        );

      case "DOC_DELETED":
        return (
          <Avatar style={this.getNotificationColors()}>
            <XIcon />
          </Avatar>
        );

      case "DOC_UPDATE":
        return (
          <Avatar style={this.getNotificationColors()}>
            <PencilIcon />
          </Avatar>
        );

      case "DOC_PERM_CHANGED":
        if (this.props.notificationData.access === accessRights.NO_ACCESS)
          return (
            <Avatar style={this.getNotificationColors()}>
              <NoEntryIcon />
            </Avatar>
          );

        else if (this.props.notificationData.access === accessRights.READ_ACCESS)
          return (
            <Avatar style={this.getNotificationColors()}>
              <EyeIcon />
            </Avatar>
          );

        else if (this.props.notificationData.access === accessRights.READ_EDIT_ACCESS)
          return (
            <Avatar style={this.getNotificationColors()}>
              <ShieldCheckIcon />
            </Avatar>
          );

      case "INVITATION_SENT":
        return (
          <Avatar style={this.getNotificationColors()}>
            <PaperAirplaneIcon />
          </Avatar>
        );

      case "INVITATION_ACCEPTED":
        return (
          <Avatar style={this.getNotificationColors()}>
            <CheckIcon />
          </Avatar>
        );

      case "INVITATION_RETRACTED":
        return (
          <Avatar style={this.getNotificationColors()}>
            <XIcon />
          </Avatar>
        );

      case "CHAT_MESSAGE":
        // The avatar image will be fetched using User ID in the data.
        // `UserAvatar` is dummy for now
        return <Avatar src={UserAvatar} />;

      default:
        return (
          <Avatar style={this.getNotificationColors()}>
            <BellIcon />
          </Avatar>
        );
    }
  }

  /**
   * Returns a map of `color` and `backgroundColor` to be applied
   * to the `ListItemAvatar`.
   *
   * @returns {Map<string, string>}
   * Map of `color` and `backgroundColor`
   */
  getNotificationColors() {
    switch (this.props.notificationData.type.split('_')[0]) {
      case "TASK":
        return { color: "#0366D6", background: "#0366D64C" };

      // case "TASK_DUE_SOON":
      //   return { color: "#F6AC00", background: "#F6AC004C" };

      // case "TASK_OVERDUE":
      //   return { color: "#EB0000", background: "#EB00004C" };

      // case "TASK_COMPLETED":
      //   return { color: "#01AE4B", background: "#01AE4B4C" };

      case "DOC":
        return { color: "#FDAC00", background: "#FDAC004C" };

      case "INVITATION":
        return { color: "#01AE4B", background: "#01AE4B4C" };

      default:
        return { color: "#0000005c" };
    }
  }

  /**
   * Primary text to be displayed in the list item.
   *
   * @returns {string}
   * Primary Text
   */
  getPrimaryText() {
    switch (this.props.notificationData.type) {
      case "TASK_CREATE":
        return `New task created`;

      case "TASK_UPDATE":
        return `Task updated`;

      case "TASK_DELETE":
        return `Task Deleted`;

      case "TASK_DUE_SOON":
        return `${this.props.notificationData.task} due soon`;

      case "TASK_OVERDUE":
        return `${this.props.notificationData.task} is overdue`;

      case "TASK_COMPLETED":
        return `Task completed`;

      case "DOC_UPLOADED":
        return `Document Uploaded`;

      case "DOC_DELETED":
        return `Document Deleted`;

      case "DOC_UPDATE":
        return `Document Edited`;

      case "DOC_PERM_CHANGED":
        return `Access rights changed`;

      case "INVITATION_SENT":
        return `Invitation Sent`;

      case "INVITATION_ACCEPTED":
        return `Invitation Accepted`;

      case "INVITATION_RETRACTED":
        return `Invitation Retracted`;

      case "CHAT_MESSAGE":
        return `Message from ${this.props.notificationData.from}`;

      default:
        return 'Notification';
    }
  }

  /**
   * Secondary text to be displayed in the list item.
   *
   * @returns {string}
   * Secondary Text
   */
  getSecondaryText() {
    switch (this.props.notificationData.type) {
      case "TASK_CREATE":
        return `${this.props.notificationData.taskName}`;

      case "TASK_UPDATE":
        return `${this.props.notificationData.taskName}`;

      case "TASK_DELETE":
        return `${this.props.notificationData.taskName}`;

      case "TASK_DUE_SOON":
        return `Due in ${this.props.notificationData.days_passed} days`;

      case "TASK_OVERDUE":
        let due_date = new Date(this.props.notificationData.due_date);
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        return `Was due on ${due_date.getDay()} ${
          months[due_date.getMonth()]
        } ${due_date.getFullYear()}`;

      case "TASK_COMPLETED":
        return `Completed by ${this.props.notificationData.assignedTo}`;

      case "DOC_UPLOADED":
        return `Uploaded "${this.props.notificationData.name}"`;

      case "DOC_DELETED":
        return `Deleted "${this.props.notificationData.name}"`;

      case "DOC_UPDATE":
        return `Updated "${this.props.notificationData.name}" by "${this.props.notificationData.lastModifiedBy}"`;

      case "DOC_PERM_CHANGED":
        if (this.props.notificationData.access === accessRights.NO_ACCESS)
          return `Permission to "${this.props.notificationData.name}" was retracted for "${this.props.notificationData.email}"`;

        else if (this.props.notificationData.access === accessRights.READ_ACCESS)
          return `"${this.props.notificationData.email}" was granted Read-Only access for "${this.props.notificationData.name}"`;

        else if (this.props.notificationData.access === accessRights.READ_EDIT_ACCESS)
          return `"${this.props.notificationData.email}" was granted Read & Edit access for "${this.props.notificationData.name}"`;

      case "INVITATION_SENT":
        return `"${this.props.notificationData.name}" is invited to ${this.props.notificationData.tid}`;

      case "INVITATION_ACCEPTED":
        return `"${this.props.notificationData.name}" accepted invitation to ${this.props.notificationData.tid}`;

      case "INVITATION_RETRACTED":
        return `${this.props.notificationData.name}'s invitation to ${this.props.notificationData.tid} has been retracted`;

      case "CHAT_MESSAGE":
        return `${this.props.notificationData.message}`;

      default:
        return 'Unknown Notification';
    }
  }

  /**
   * Includes other meta-data like relative time to
   * the secondary text.
   */
  getCompleteSecondaryText() {
    return (
      <>
        {this.getSecondaryText()}
        
        <div style={{opacity: 0.7, marginTop: 5}}>
          {moment(
            this.props.notificationData.timestamp
              ? this.props.notificationData.timestamp.toDate() 
              : ''
            ).fromNow()
          }
        </div>
      </>
    );
  }

  /**
   * Returns link for navigating to a particular route
   * when clicked.
   */
  getNavLink() {
    switch (this.props.notificationData.type) {
      case "TASK_CREATE":
        return `/transaction/${this.props.notificationData.tid}/todo#${this.props.notificationData.taskId}`;

      case "TASK_UPDATE":
        return `/transaction/${this.props.notificationData.tid}/todo#${this.props.notificationData.taskId}`;

      case "TASK_DELETE":
        return `/transaction/${this.props.notificationData.tid}/todo`;

      case "TASK_DUE_SOON":
        return `/transaction/${this.props.notificationData.tid}/todo#${this.props.notificationData.taskId}`;

      case "TASK_OVERDUE":
        return `/transaction/${this.props.notificationData.tid}/todo#${this.props.notificationData.taskId}`;

      case "TASK_COMPLETED":
        return `/transaction/${this.props.notificationData.tid}/todo#${this.props.notificationData.taskId}`;

      case "DOC_UPLOADED":
        return `/transaction/${this.props.notificationData.tid}/paperwork#${this.props.notificationData.name}`;

      case "DOC_DELETED":
        return `/transaction/${this.props.notificationData.tid}/paperwork`;

      case "DOC_UPDATE":
        return `/transaction/${this.props.notificationData.tid}/paperwork#${this.props.notificationData.name}`;

      case "DOC_PERM_CHANGED":
        return `/transaction/${this.props.notificationData.tid}/paperwork#${this.props.notificationData.name}`;

      case "INVITATION_SENT":
        return `/transaction/${this.props.notificationData.tid}/people/#${this.props.notificationData.email}`;

      case "INVITATION_ACCEPTED":
        return `/transaction/${this.props.notificationData.tid}/people/#${this.props.notificationData.email}`;

      case "INVITATION_RETRACTED":
        return `/transaction/${this.props.notificationData.tid}/people`;

      case "CHAT_MESSAGE":
        return `.`;

      default:
        return 'Unknown Notification';
    }
  }

  /**
   * Marks a notification as read by setting
   * `isRead` field to `true`.
   * 
   * @param {string} notificationId
   * Notification ID: `notificationData.id`
   */
  setAsRead(notificationId) {
    if (!this.props.notificationData.isRead)
      myFirestore
        .collection('users')
        .doc(localStorage.getItem("userID"))
        .collection('notifications')
        .doc(notificationId)
        .update({
          isRead: true
        });
  }

  /**
   * Deletes a notification from notification list.
   * 
   * @param {string} notificationId
   * Notification ID: `notificationData.id`
   */
  removeNotification(notificationId) {
    myFirestore
      .collection('users')
      .doc(localStorage.getItem("userID"))
      .collection('notifications')
      .doc(notificationId)
      .delete();
  }

  render() {
    let { classes, notificationData } = this.props;

    return (
      <Grid item style={{ width: "100%" }}>
        <ListItem
          button
          component={Link}
          to={this.getNavLink()}
          className="anchor-btn"
          onClick={() => this.setAsRead(notificationData.id)}
          style={{
            backgroundColor: !notificationData.isRead ? "#eaf5ff" : "#ffffff",
            paddingRight: 55
          }}
        >
          <ListItemAvatar>{this.getIcon()}</ListItemAvatar>
          <ListItemText
            primary={this.getPrimaryText()}
            secondary={this.getCompleteSecondaryText()}
            classes={{
              primary: notificationData.isRead
                ? classes.notificationPrimaryRead
                : classes.notificationPrimaryUnread,

              secondary: notificationData.isRead
                ? classes.notificationSecondaryRead
                : classes.notificationSecondaryUnread,
            }}
          />
          <ListItemSecondaryAction>
            {notificationData.isRead
              ? (
                <Tooltip title={
                  <Typography style={{fontSize: 14}}>
                    Dismiss
                  </Typography>
                }>
                  <IconButton onClick={() => this.removeNotification(notificationData.id)}>
                    <XIcon />
                  </IconButton>
                </Tooltip>
              )

              : (
                <Tooltip title={
                  <Typography style={{fontSize: 14}}>
                    Mark As Read
                  </Typography>
                }>
                  <IconButton onClick={() => this.setAsRead(notificationData.id)}>
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
              )
            }
          </ListItemSecondaryAction>
        </ListItem>

        <Grid item>
          <Divider variant="middle" />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(NotificationItem);
