import React, { Component } from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { openAssistModal, modalClose, escrowStep } from '../../actions/transactionAssistActions';
import NavBar from "../shared/navbar/navbar";
import Modal from "../shared/modal/Modal";
import NavRail from "../shared/navigation_rail/TransactionNavRail";
import {
  Container,
  Box,
  Grid,
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
  Typography,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import {
  PackageIcon,
  ChecklistIcon,
  TriangleDownIcon,
  CheckIcon,
  SearchIcon,
  DotFillIcon,
  EyeIcon,
  ShieldIcon,
  HomeIcon,
  IssueClosedIcon,
  SmileyIcon,
} from "@primer/octicons-react";
import {ReallosLoaderWithOverlay} from '../shared/preloader/ReallosLoader';
import "./transactionassist.css";
import { green } from "@material-ui/core/colors";


const mapStateToProps = (state) => ({
  user: state.user,
  assist: state.assist,
  utils: state.utils
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      openAssistModal,
      modalClose,
      escrowStep
    },dispatch);
}

class TransactionAssist extends Component {
  constructor(props) {
    super(props);


    this.firstTimeModal = this.firstTimeModal.bind(this);
    this.closeFirstTime = this.closeFirstTime.bind(this);
    this.RenderExpansionPanel = this.RenderExpansionPanel.bind(this);
  }

  componentDidMount(){
    this.props.openAssistModal(this.props.user,this.props.match.params.tid); // passing the user object to the function
  }

  closeFirstTime() {
    // Make sure that the database is updated with this information
    this.props.modalClose();
  }

  firstTimeModal() {
    // To display the first time modal to people
    if(this.props.utils.Loading){
      return(<></>);
    }
    else{
      return (
        <Modal
          visible={this.props.assist.modal ? true : false}
          modalWidth={750}
          modalHeight={500}
          dismissCallback={this.closeFirstTime}
        >
          <Grid container direction="column" alignItems="center" justify="center">
            <Grid item>
              <img
                src={require("../../assets/transaction-assist-first-time.png")}
                alt={"First Time"}
                className="first-time-image"
              />
            </Grid>
            <Grid item>
              <Box component="h1">Transaction assist</Box>
            </Grid>
            <Grid item>
              <Box component="p" m={-2}>
                Exactly know the progress of your transaction
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className="continue-button"
                onClick={this.closeFirstTime}
              >
                continue
              </Button>
            </Grid>
          </Grid>
        </Modal>
      );
    }
  }

  RenderExpansionPanel() {
    console.log(this.props.assist.escrow)
    return (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  {(this.props.assist.escrow.completed) ? (<CheckIcon size={25} className="checkmark-green" />) : (<DotFillIcon size={25} />) }
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <HomeIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                        Escrow Account
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Escrow Account</h2>
                </Grid>
                <Grid item>
                  <Typography>This is where the buyer deposits the good faith money to show intrest in the property</Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box component="p" mt={3} className ={(this.props.assist.escrow.completed) ? "checklist-assist-class-completed" : "checklist-assist-class"}>
                    <ChecklistIcon size ={25} /> &nbsp; {this.props.assist.escrow.numberOfCompleted} of 2 Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel className={(this.props.assist.escrow.setup) ? "action-text-completed" : "action-text"}
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.escrow.setup}
                        onClick = {()=>this.props.escrowStep('setup')}
                      />
                    }
                    label="Let everyone know if the Escrow account has been setup! Should be marked by the Buyer agent"
                  />
                  <FormControlLabel className={(this.props.assist.escrow.goodFaith) ? "action-text-completed" : "action-text"}
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.escrow.goodFaith}
                        onClick = {()=>this.props.escrowStep('goodFaith')}
                      />
                    }
                    label="Has the Good Faith money been transafered by the Buyer? Buyer can let everyone if it has"
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  <DotFillIcon size={25} />
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <SearchIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                        Title Search and Insurance
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Title goes here</h2>
                </Grid>
                <Grid item>
                  <Typography className="expansion-panel-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    varius auctor tincidunt. Vivamus vulputate ex libero, non
                    pretium tortor eleifend non. Donec sagittis, neque eu
                    malesuada euismod, elit nulla aliquet nibh, in laoreet eros
                    diam quis lacus.
                  </Typography>
                  <Typography className="expansion-panel-text">
                    Vivamus vulputate ex libero, non pretium tortor eleifend
                    non. Donec sagittis, neque eu malesuada euismod, elit nulla
                    aliquet nibh, in laoreet eros diam quis lacus.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="action-button">
                    Action
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  <DotFillIcon size={25} />
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <EyeIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                       Home Appraisal
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Title goes here</h2>
                </Grid>
                <Grid item>
                  <Typography className="expansion-panel-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    varius auctor tincidunt. Vivamus vulputate ex libero, non
                    pretium tortor eleifend non. Donec sagittis, neque eu
                    malesuada euismod, elit nulla aliquet nibh, in laoreet eros
                    diam quis lacus.
                  </Typography>
                  <Typography className="expansion-panel-text">
                    Vivamus vulputate ex libero, non pretium tortor eleifend
                    non. Donec sagittis, neque eu malesuada euismod, elit nulla
                    aliquet nibh, in laoreet eros diam quis lacus.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="action-button">
                    Action
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  <DotFillIcon size={25} />
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <ShieldIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                        Home Inspection
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Title goes here</h2>
                </Grid>
                <Grid item>
                  <Typography className="expansion-panel-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    varius auctor tincidunt. Vivamus vulputate ex libero, non
                    pretium tortor eleifend non. Donec sagittis, neque eu
                    malesuada euismod, elit nulla aliquet nibh, in laoreet eros
                    diam quis lacus.
                  </Typography>
                  <Typography className="expansion-panel-text">
                    Vivamus vulputate ex libero, non pretium tortor eleifend
                    non. Donec sagittis, neque eu malesuada euismod, elit nulla
                    aliquet nibh, in laoreet eros diam quis lacus.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="action-button">
                    Action
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  <DotFillIcon size={25} />
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <IssueClosedIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                        Loan Approval
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Title goes here</h2>
                </Grid>
                <Grid item>
                  <Typography className="expansion-panel-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    varius auctor tincidunt. Vivamus vulputate ex libero, non
                    pretium tortor eleifend non. Donec sagittis, neque eu
                    malesuada euismod, elit nulla aliquet nibh, in laoreet eros
                    diam quis lacus.
                  </Typography>
                  <Typography className="expansion-panel-text">
                    Vivamus vulputate ex libero, non pretium tortor eleifend
                    non. Donec sagittis, neque eu malesuada euismod, elit nulla
                    aliquet nibh, in laoreet eros diam quis lacus.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="action-button">
                    Action
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  <DotFillIcon size={25} />
                </Grid>
                <Divider orientation="vertical" className="expansion-divider" />
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    spacing={3}
                  >
                    <Grid item>
                      <SmileyIcon size={25} />
                    </Grid>
                    <Grid item>
                      <Typography className="expansion-panel-heading">
                        Closing
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="column" justify="center">
                <Grid item>
                  <h2>Title goes here</h2>
                </Grid>
                <Grid item>
                  <Typography className="expansion-panel-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    varius auctor tincidunt. Vivamus vulputate ex libero, non
                    pretium tortor eleifend non. Donec sagittis, neque eu
                    malesuada euismod, elit nulla aliquet nibh, in laoreet eros
                    diam quis lacus.
                  </Typography>
                  <Typography className="expansion-panel-text">
                    Vivamus vulputate ex libero, non pretium tortor eleifend
                    non. Donec sagittis, neque eu malesuada euismod, elit nulla
                    aliquet nibh, in laoreet eros diam quis lacus.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="action-button">
                    Action
                  </Button>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    );
  }

  render() {
    console.log(this.props.assist)
    return (
      <Box component="div">
        <ReallosLoaderWithOverlay visible={this.props.utils.Loading} />
        <Container>
          <NavBar />
          <NavRail />
          { this.firstTimeModal() }
          <Box component="div" paddingTop={5} paddingBottom={1}>
            <Grid container direction="row" alignItems="center" spacing={2} justify="flex-start">
                <Grid item>
                  <PackageIcon size={35} />
                </Grid>
                <Grid item>
                  <h2>Transaction 1</h2>
                </Grid>
            </Grid>
          </Box>
          { this.RenderExpansionPanel()}
        </Container>
      </Box>
    );
  }
}

export default connect (mapStateToProps, mapDispatchToProps)(TransactionAssist);
