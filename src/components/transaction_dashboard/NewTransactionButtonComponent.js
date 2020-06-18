import React, { Component } from 'react';
import Modal from '../shared/modal/Modal';
import './Transaction.css';
import TransactionNoPeople from '../../assets/transaction-no-people.png';
import InvitationCard from './InvitationCard';
import PeopleChip from './PersonChip';

import {
    PlusIcon,
    TagIcon,
    LocationIcon,
    PencilIcon,
    PersonIcon,
    MailIcon,
    QuestionIcon,
    CheckIcon,
} from '@primer/octicons-react';

import {
    Stepper,
    Step,
    StepLabel,
    Grid,
    FormGroup,
    TextField,
    FormControl,
    Box,
    Fab,
    Button,
    Select,
    MenuItem,
    Dialog,
} from '@material-ui/core';

class NewTransactionButton extends Component {
    constructor(props){
        super(props);

        this.state = {
            isModalOpen: false, // To store the state of the modal
            activeStep: 0,
            isInsideModalOpen: false,
            invites: 0
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.nextSteps = this.nextSteps.bind(this);
        this.prevSteps = this.prevSteps.bind(this);
        this.renderForm = this.renderForm.bind(this);
        this.toggleInsideModal = this.toggleInsideModal.bind(this);
        this.sendInvite = this.sendInvite.bind(this);
    }

    /**
     * Toggle the state of modal
     */
    toggleModal() {
        this.setState({
            activeStep: 0,
            isModalOpen: !this.state.isModalOpen
        });
    }

    /**
     * Advance to next step
     */
    nextSteps() {
        let step = this.state.activeStep + 1;

        if (step > 3) {
            step = 3;
        }

        this.setState({
            activeStep: step
        });
    }

    /**
     * Get back one step
     */
    prevSteps() {
        let step = this.state.activeStep - 1;

        if (step < 0) {
            step = 0;
        }

        this.setState({
            activeStep: step
        });
    }

    /**
     * Toggle Inside Modal
     */

     toggleInsideModal(){
         if(this.state.isInsideModalOpen === true){
             this.setState({
                 isInsideModalOpen: false
             });
         }
         else{
             this.setState({
                 isInsideModalOpen: true
             });
         }
     }

     sendInvite(){  //To add to the people array so that invitations are ready to be sent
         this.toggleInsideModal();
         var invite = this.state.invites+1;
         this.setState({
             invites: invite
         });
     }

    /**
     * Renders the form and the components of the modal with the buttons.
     */
    renderForm() {
        if (this.state.activeStep === 0) {
            return (
                <>
                <FormControl>
                    <FormGroup row className="form-group">
                        <TagIcon size={25} className="tag-icon"/>
                        <TextField variant="outlined" label="Name" className="input-new-transaction-form"/>
                    </FormGroup>
                    <FormGroup row className="form-group">
                        <LocationIcon size={25} className="location-icon" />
                        <TextField variant="outlined" label="Address" className="input-new-transaction-form"/>
                    </FormGroup>
                    <FormGroup row className="form-group">
                        <PencilIcon size={25} className="pencil-icon" />
                        <TextField
                            variant="outlined"
                            label="Description"
                            className="input-new-transaction-form"
                            multiline
                            rows={4}
                        />
                    </FormGroup>
                </FormControl>
                <div className="button-group">
                    <Grid container direction="row" justify="space-between">
                        <Grid item>
                            <Button variant="outlined" onClick={this.toggleModal} className="cancel-back-button">cancel</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={this.nextSteps} className="next-button">next</Button>
                        </Grid>
                    </Grid>
                </div>
                </>
            );
        }

        else if (this.state.activeStep === 1 && this.state.invites === 0) { // for the second step of the modal and no one has been invited yet
            return (
                <>
                <Grid container direction="column" >
                    <Grid item>
                       <Grid container direction="row" justify="space-evenly" alignItems="center">
                           <Grid item>
                                <h2 className="invite-people-text">Invite people</h2>
                                <Box component="p" marginTop={-2} className="invite-people-text-subheading">Invite people to your transaction using their E-mail ID</Box>
                           </Grid>
                           <Grid item>
                                <Button variant="contained" className="invite-modal-button reallos-button" onClick={this.toggleInsideModal}>
                                    <PersonIcon /> &nbsp;
                                    Invite a person
                                </Button>
                           </Grid>
                       </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" justify="space-evenly" alignItems="center">
                            <Grid item>
                            <img src={TransactionNoPeople} alt="" className="transaction-step-img-default"/>
                            </Grid>
                            <Grid item>
                                <h2 className="invite-people-text">It's lonely up here...</h2>
                                <Box component="p" marginTop={-2} className="invite-people-text-subheading">Invite some people to your transaction. <br />You can skip this step for now <br/> and add more people later on.</Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <div className="button-group">
                    <Grid container direction="row" justify="space-between">
                        <Grid item>
                            <Button variant="outlined" onClick={this.toggleModal} className="cancel-back-button">cancel</Button>
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" spacing={2}>
                                <Grid item>
                                <Button variant="outlined" onClick={this.prevSteps} className="cancel-back-button">back</Button>
                                </Grid>
                                <Grid item>
                                <Button variant="contained" onClick={this.nextSteps} className="next-button">next</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                </>
            );
        }

        else if(this.state.activeStep === 1 && this.state.invites !== 0){
            return(
                <>
                <Grid container direction="column" >
                    <Grid item>
                        <Grid container direction="row" justify="space-evenly" alignItems="center">
                            <Grid item>
                                <h2 className="invite-people-text">Invite people</h2>
                                <Box component="p" marginTop={-2} className="invite-people-text-subheading">Invite people to your transaction using their E-mail ID</Box>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" className="invite-modal-button reallos-button" onClick={this.toggleInsideModal}>
                                    <PersonIcon /> &nbsp;
                                    Invite a person
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className="invited-person-card">
                            <InvitationCard />
                        {/*Add a card component that shows you how many invites you'll be sending*/}
                    </Grid>
                </Grid>
                <div className="button-group">
                        <Grid container direction="row" justify="space-between">
                            <Grid item>
                                <Button variant="outlined" onClick={this.toggleModal} className="cancel-back-button">cancel</Button>
                            </Grid>
                            <Grid item>
                                <Grid container direction="row" spacing={2}>
                                    <Grid item>
                                    <Button variant="outlined" onClick={this.prevSteps} className="cancel-back-button">back</Button>
                                    </Grid>
                                    <Grid item>
                                    <Button variant="contained" onClick={this.nextSteps} className="next-button">next</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </>
            );
        }

        else{
            return(
                <>
                <Grid container direction="column" justify="center">
                    <Grid item>
                        <Box component="h2" className="invite-people-text">Are you sure to create the following transaction?</Box>
                    </Grid>
                    <Grid item>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <TagIcon size={25} className="tag-icon"/>
                                    </Grid>
                                    <Grid item>
                                        <div className="invite-people-text-subheading">
                                            Transaction 1
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <div style={{marginBottom: 10}}></div>
                            <Grid item>
                                <Grid container direction="row" alignItems="center">
                                    <Grid item>
                                        <LocationIcon size={25} className="location-icon"/>
                                    </Grid>
                                    <Grid item>
                                        <div className="invite-people-text-subheading">
                                            Mountain View, California, United States
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <h2>People involved</h2>
                        <Grid item className="people-involved-grid">
                            <PeopleChip />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="space-between">
                    <Grid item>
                        <Button variant="outlined" onClick={this.toggleModal} className="cancel-back-button">cancel</Button>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" spacing={2}>
                            <Grid item>
                            <Button variant="outlined" onClick={this.prevSteps} className="cancel-back-button">back</Button>
                            </Grid>
                            <Grid item>
                            <Button variant="contained" onClick={this.toggleModal /*Will change to a fucntion that submits the document to the store*/ } diabled className="next-button">confirm</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </>
            );
        }
    }

    render() {
        return (
            <>
            <Fab
                variant="extended"
                className="reallos-fab"
                size="large"
                onClick={this.toggleModal}
            >
                <PlusIcon className="fab-icon" size={20} /> &nbsp;
                New Transaction
            </Fab>

            <Modal title="New Transaction" visible={this.state.isModalOpen} modalWidth={750} dismissCallback={this.toggleModal}>
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
                <this.renderForm />
            </Modal>

            <Modal title="Invite People" visible={this.state.isInsideModalOpen} modalWidth={750} dismissCallback={this.toggleInsideModal}>
            <FormControl>
                    <FormGroup row className="form-group">
                        <PersonIcon size={25} className="tag-icon"/>
                        <TextField variant="outlined" label="Name" className="input-new-transaction-form"/>
                    </FormGroup>
                    <FormGroup row className="form-group">
                        <MailIcon size={25} className="tag-icon"/>
                        <TextField variant="outlined" label="E-mail" className="input-new-transaction-form"/>
                    </FormGroup>
                    <FormGroup row className="form-group">
                        <QuestionIcon size={25} className="tag-icon" />
                        <Select variant="outlined" id="select" className="input-new-transaction-form" >
                            <MenuItem >Buyer</MenuItem>
                            <MenuItem >Seller</MenuItem>
                            <MenuItem >Buyer Agent</MenuItem>
                            <MenuItem >Seller Agent</MenuItem>
                            <MenuItem >Title Agent</MenuItem>
                            <MenuItem >Escrow Agent</MenuItem>
                            <MenuItem >Home Inspector</MenuItem>
                        </Select>
                    </FormGroup>
            </FormControl>
                    <div className="button-group">
                        <Grid container direction="row" spacing={2} justify="flex-end">
                            <Grid item>
                            <Button variant="outlined" onClick={this.toggleInsideModal} className="cancel-back-button">cancel</Button>
                            </Grid>
                            <Grid item>
                            <Button variant="contained" onClick={this.sendInvite} className="next-button"><CheckIcon /> &nbsp;
                            invite</Button>
                            </Grid>
                        </Grid>
                    </div>
            </Modal>
            </>
        );
    }
}

export default NewTransactionButton;
