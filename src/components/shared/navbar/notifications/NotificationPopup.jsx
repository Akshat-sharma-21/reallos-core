import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Grid, Box, List, CircularProgress } from '@material-ui/core';
import NotificationListItem from "./NotificationListItem";
import './NotificationPopup.css';
import { BellIcon } from '@primer/octicons-react';

/**
 * Component for showing notifications in a popup.
 * @augments {React.Component<Props>}
 */
class NotificationPopup extends React.Component {
    static propTypes = {
        /**
         * Anchor object used for placing the notification
         * popup on the viewport.
         * 
         * Popup will be hidden if `null`
         */
        notificationAnchor: PropTypes.object,

        /**
         * Callback function to dismiss the notification
         * popup.
         */
        dismissCallback: PropTypes.func,

        /**
         * List of notification object.
         */
        notifications: PropTypes.arrayOf(
            PropTypes.object
        )
    }

    /**
     * Computes number of unread notifications from
     * notification data.
     */
    get getUnreadNotificationsCount() {
        if (this.props.notifications != null)
            return this.props.notifications.filter((data) => !data.isRead).length;

        else
            return 0;
    }

    render() {
        const { notificationAnchor, dismissCallback } = this.props;

        return (
            <Menu
                className="navbar-notification-popup"
                anchorEl={notificationAnchor}
                keepMounted
                open={Boolean(notificationAnchor)}
                onClose={dismissCallback}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                PaperProps={{
                    style: {
                        borderRadius: 10,
                    },
                }}
            >
                <Grid
                    direction="column"
                    alignContent="center"
                    className="notification-menu"
                >
                    <Grid
                        item
                        className="notification-popup-header"
                        justify="center"
                    >
                        <Box component="p" style={{ justifyContent: "center" }}>
                            You have
                        </Box>
                        <Box
                            component="h3"
                            mt={-1.5}
                            style={{ justifyContent: "center" }}
                        >
                            {this.getUnreadNotificationsCount
                                ? `${this.getUnreadNotificationsCount} Unread Notifications`
                                : "No Unread Notifications"
                            }
                        </Box>
                    </Grid>
                    
                    {(this.props.notifications !== null)
                        ? (this.props.notifications.length !== 0)
                            ? <List className="notification-list">
                                {this.props.notifications.map((data) => (
                                    <NotificationListItem notificationData={data} />
                                ))}
                            </List>

                            : <div className="notifications-no-list-container">
                                <BellIcon size={80} className="bell-icon" />

                                <div style={{
                                    fontFamily: 'Gilroy',
                                    fontWeight: 'bold',
                                    fontSize: 24,
                                    marginTop: 40,
                                    marginBottom: 15
                                }}>
                                    All Caught Up!
                                </div>

                                <div style={{
                                    fontSize: 18
                                }}>
                                    Your notifications will appear here as soon as they arrive
                                </div>
                            </div>

                        : <div className="notifications-no-list-container">
                            <CircularProgress />

                            <div style={{
                                marginTop: 25
                            }}>
                                Loading Notifications
                            </div>
                        </div>
                    }
                </Grid>
            </Menu>
        )
    }
}

export default NotificationPopup;
