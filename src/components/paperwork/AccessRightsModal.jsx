import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal, { ModalActionFooter } from '../shared/modal/Modal';
import { getPeopleInvolved, accessRights } from '../../global_func_lib';
import { myFirestore } from '../../Config/MyFirebase';
import { NoEntryIcon, PencilIcon, EyeIcon } from '@primer/octicons-react';
import TransactionNoPeople from '../../assets/transaction-no-people.png';

import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Grid
} from '@material-ui/core';

import './AccessRightsModal.css';

const mapStateToProps = (state) => ({
    user: state.user
});

/**
 * Display Configure Access Rights Modal.
 * @augments {React.Component<Props>}
 */
class AccessRightsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleList: null,
            accessData: {}
        }
        this.currentFileName = "";
    }

    static propTypes = {
        /**
         * Specify the visibility of the modal
         */
        visible: PropTypes.bool.isRequired,

        /**
         * Callback function to dismiss the Modal
         * when it makes a request to close.
         */
        dismissCallback: PropTypes.func,

        /**
         * Filename of the paperwork which is used
         * to refer the document in firebase.
         */
        filename: PropTypes.string.isRequired,

        /**
         * Transaction ID to populate the list of people
         * for the given transaction.
         */
        transactionID: PropTypes.string.isRequired,

        /**
         * Callback function to show snackbar.
         */
        showSnackbarCallback: PropTypes.func
    }

    componentDidUpdate() {
        // This is to prevent continuous fetching of paperwork data
        // when the components update but the filename doesn't.
        if (this.currentFileName !== this.props.filename) {
            this.fetchPaperworkAccessData();
        }
    }

    /**
     * Fetches and sets the people list and their corresponding
     * access rights.
     * 
     * @returns {Promise<void>}
     */
    async fetchPaperworkAccessData() {
        if (!this.props.filename) return;
        this.currentFileName = this.props.filename;

        // Reset the modal contents
        this.setState({
            peopleList: null,
            accessData: {}
        });

        let peopleList = await getPeopleInvolved(this.props.transactionID);
        let paperworkData =
            myFirestore
                .collection('transactions')
                .doc(this.props.transactionID)
                .collection('paperwork')
                .doc(this.props.filename);

        let accessData = {};
        let paperworkAccessData = (await paperworkData.get()).data().accessData;

        for (let i = 0; i < peopleList.length; i++) {
            accessData[peopleList[i].email] = 0;
        }

        accessData = Object.assign(accessData, paperworkAccessData);
        console.log(accessData);

        this.setState({
            peopleList,
            accessData
        });
    }

    /**
     * Updates state for access rights within the component
     * for a given email ID with provided access right value. 
     * 
     * @param {string} email
     * Email ID for which the access has to be set.
     * 
     * @param {number} value
     * Access right value to be set for a given email ID.
     */
    setAccess(email, value) {
        let accessData = this.state.accessData;
        accessData[email] = value;

        this.setState({ accessData });
    }

    /**
     * Saves current access rights in the cloud.
     * @returns {Promise<void>}
     */
    saveAccessRights() {
        return myFirestore
            .collection('transactions')
            .doc(this.props.transactionID)
            .collection('paperwork')
            .doc(this.props.filename)
            .update({
                accessData: this.state.accessData
            });
    }

    render() {
        let {
            visible,
            dismissCallback,
            showSnackbarCallback=() => {}
        } = this.props;

        return (
            <Modal
                title="Configure Access Rights"
                visible={visible}
                dismissCallback={dismissCallback}
                modalWidth={700}
            >
                <div className="access-rights-subheading">
                    Give people in your transaction granular permissions to this document.
                </div>
                <List className="access-rights-list">
                    {(this.state.peopleList !== null)
                        ? (this.state.peopleList.length > 0)
                            ? this.state.peopleList.map(people => {
                                return (
                                    <ListItem key={people.email}>
                                        <ListItemIcon>
                                            <Avatar />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={people.name}
                                            secondary={people.email}
                                        />

                                        <ListItemSecondaryAction>
                                            <Select
                                                value={this.state.accessData[people.email]}
                                                variant="outlined"
                                                style={{width: 250}}
                                                onChange={(e) => this.setAccess(
                                                    people.email,
                                                    e.target.value
                                                )}
                                            >
                                                <MenuItem value={accessRights.NO_ACCESS}>
                                                    <NoEntryIcon size={20} />
                                                    <span style={{marginRight: 20}} />
                                                    No Access
                                                </MenuItem>
                                                <MenuItem value={accessRights.READ_ACCESS}>
                                                    <EyeIcon size={20} />
                                                    <span style={{marginRight: 20}} />
                                                    Read Access only
                                                </MenuItem>
                                                <MenuItem value={accessRights.READ_EDIT_ACCESS}>
                                                    <PencilIcon size={20} />
                                                    <span style={{marginRight: 20}} />
                                                    Read &amp; Edit Access
                                                </MenuItem>
                                            </Select>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )})
                            : <Grid
                                container
                                direction="column"
                                justify="center"
                                alignContent="center"
                                style={{height: '100%', textAlign: 'center'}}
                            >
                                <div>
                                    <img
                                        src={TransactionNoPeople}
                                        alt=""
                                        style={{width: '60%', marginBottom: 20}}
                                    />
                                </div>
                                <h2>
                                    No People Here...
                                </h2>
                                <div>
                                    There are no people available in your transaction
                                </div>
                            </Grid>
                        : <Grid
                            container
                            direction="column"
                            justify="center"
                            alignContent="center"
                            style={{height: '100%'}}
                        >
                            <div style={{textAlign: "center"}}>
                                <CircularProgress />

                                <div style={{marginTop: 20}}>
                                    Fetching access rights...
                                </div>
                            </div>
                        </Grid>
                    }
                </List>

                <ModalActionFooter>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>{
                            dismissCallback();
                            this.currentFileName = null
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            await this.saveAccessRights();
                            dismissCallback();
                            showSnackbarCallback(
                                `Access Rights have been set for "${this.props.filename}"`
                            );
                        }}
                    >
                        Save Changes
                    </Button>
                </ModalActionFooter>
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(AccessRightsModal);
