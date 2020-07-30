import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  openAssistModal,
  modalClose,
  escrowStep,
  titleStep,
  homeAppraisalStep,
  homeInspectionStep,
  LoanStep,
  closingStep,
} from "../../actions/transactionAssistActions";
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
  FormControlLabel,
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
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import "./transactionassist.css";
import MediaQuery from "react-responsive";

const mapStateToProps = (state) => ({
  user: state.user,
  assist: state.assist,
  utils: state.utils,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      openAssistModal,
      modalClose,
      escrowStep,
      titleStep,
      homeAppraisalStep,
      homeInspectionStep,
      LoanStep,
      closingStep,
    },
    dispatch
  );
};

class TransactionAssist extends Component {
  constructor(props) {
    super(props);

    this.firstTimeModal = this.firstTimeModal.bind(this);
    this.closeFirstTime = this.closeFirstTime.bind(this);
    this.RenderExpansionPanel = this.RenderExpansionPanel.bind(this);
  }

  componentDidMount() {
    this.props.openAssistModal(this.props.user, this.props.match.params.tid); // passing the user object to the function
  }

  closeFirstTime() {
    // Make sure that the database is updated with this information
    this.props.modalClose();
  }

  firstTimeModal() {
    // To display the first time modal to people
    if (this.props.utils.Loading) {
      return <></>;
    } else {
      return (
        <Modal
          visible={this.props.assist.modal ? true : false}
          modalWidth={750}
          modalHeight={500}
          dismissCallback={this.closeFirstTime}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
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
    return (
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
              <Grid container direction="row" alignItems="center" spacing={4}>
                <Grid item>
                  {this.props.assist.escrow.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <Typography>
                    This is where the buyer deposits the good faith money to
                    show intrest in the property
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.escrow.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.escrow.numberOfCompleted} of 3 Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.escrow.setup
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.escrow.setup}
                        disabled={this.props.assist.escrow.setup ? true : false}
                        onClick={() =>
                          this.props.escrowStep(
                            "setup",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Let everyone know if the Escrow account has been setup! Should be marked by the Listing agent"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.escrow.goodFaith
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.escrow.goodFaith}
                        disabled={
                          this.props.assist.escrow.goodFaith ? true : false
                        }
                        onClick={() =>
                          this.props.escrowStep(
                            "goodFaith",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Has the Good Faith money been transafered by the Buyer? Buyer can let everyone know if it has"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.escrow.loanDocument
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.escrow.loanDocument}
                        disabled={
                          this.props.assist.escrow.loanDocument ? true : false
                        }
                        onClick={() =>
                          this.props.escrowStep(
                            "loanDocument",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Buyer's loan documnets and property taxes documents recieved by the Escrow officer"
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
                  {this.props.assist.titleSearch.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <h2>Title Search and Insurance</h2>
                </Grid>
                <Grid item>
                  <Typography>
                    This is where the Title report is ordered and Title
                    insurance is issued
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.titleSearch.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.titleSearch.numberOfCompleted} of 2
                    Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.titleSearch.titleReport
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.titleSearch.titleReport}
                        disabled={
                          this.props.assist.titleSearch.titleReport
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.titleStep(
                            "report",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Title Report ordered and recieved by the Escrow officer to check for issues"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.titleSearch.titleInsurance
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.titleSearch.titleInsurance}
                        disabled={
                          this.props.assist.titleSearch.titleInsurance
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.titleStep(
                            "insurance",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Title record transfered to the Buyer and Title Insurance is issued, completing the final step of Title Search and Insurance"
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
                  {this.props.assist.homeAppraisal.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <h2>Home Appraisal</h2>
                </Grid>
                <Grid item>
                  <Typography>
                    This is where the value of property is determined for Loan
                    purposes by the Lender
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.homeAppraisal.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.homeAppraisal.numberOfCompleted} of 2
                    Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.homeAppraisal.homeAppraisalAppointed
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={
                          this.props.assist.homeAppraisal.homeAppraisalAppointed
                        }
                        disabled={
                          this.props.assist.homeAppraisal.homeAppraisalAppointed
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.homeAppraisalStep(
                            "appointed",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Home Appraiser has been appointed by the lender "
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.homeAppraisal.homeAppraisalReport
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={
                          this.props.assist.homeAppraisal.homeAppraisalReport
                        }
                        disabled={
                          this.props.assist.homeAppraisal.homeAppraisalReport
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.homeAppraisalStep(
                            "report",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Home Appraisal report has been generated and uploaded to the platform"
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
                  {this.props.assist.homeInspection.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <h2>Home Inspection</h2>
                </Grid>
                <Grid item>
                  <Typography>
                    This is where the property is inspected to see fro potential
                    shortcomings
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.homeInspection.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.homeInspection.numberOfCompleted} of 2
                    Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.homeInspection.homeInspectionAppointed
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={
                          this.props.assist.homeInspection
                            .homeInspectionAppointed
                        }
                        disabled={
                          this.props.assist.homeInspection
                            .homeInspectionAppointed
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.homeInspectionStep(
                            "appointed",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Home inspector has been appointed and has been paid by the buyer"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.homeInspection.homeInspectionReport
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={
                          this.props.assist.homeInspection.homeInspectionReport
                        }
                        disabled={
                          this.props.assist.homeInspection.homeInspectionReport
                            ? true
                            : false
                        }
                        onClick={() =>
                          this.props.homeInspectionStep(
                            "report",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Home Inspection report has been generated and uploaded to the platform"
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
                  {this.props.assist.loan.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <h2>Loan Approval</h2>
                </Grid>
                <Grid item>
                  <Typography>
                    This is where the Loan for the Buyer is approved by the
                    lender
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.loan.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.loan.numberOfCompleted} of 3 Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.loan.application
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.loan.application}
                        disabled={
                          this.props.assist.loan.application ? true : false
                        }
                        onClick={() =>
                          this.props.LoanStep(
                            "application",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Intital Loan Application is submitted and is under review "
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.loan.recieved
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.loan.recieved}
                        disabled={
                          this.props.assist.loan.recieved ? true : false
                        }
                        onClick={() =>
                          this.props.LoanStep(
                            "recieved",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Home Appraisal and Title report recieved by the Lender and is under review"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.loan.approved
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.loan.approved}
                        disabled={
                          this.props.assist.loan.approved ? true : false
                        }
                        onClick={() =>
                          this.props.LoanStep(
                            "approved",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Loan is approved by the lender"
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
                  {this.props.assist.closing.completed ? (
                    <CheckIcon size={25} className="checkmark-green" />
                  ) : (
                    <DotFillIcon size={25} />
                  )}
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
                  <h2>Closing</h2>
                </Grid>
                <Grid item>
                  <Typography>
                    Welcome to the final step of closing the deal!
                  </Typography>
                </Grid>
                <Grid item>
                  <Box mt={3}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    component="p"
                    mt={3}
                    className={
                      this.props.assist.closing.completed
                        ? "checklist-assist-class-completed"
                        : "checklist-assist-class"
                    }
                  >
                    <ChecklistIcon size={25} /> &nbsp;{" "}
                    {this.props.assist.closing.numberOfCompleted} of 3 Completed
                  </Box>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.closing.walkthrough
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.closing.walkthrough}
                        disabled={
                          this.props.assist.closing.walkthrough ? true : false
                        }
                        onClick={() =>
                          this.props.closingStep(
                            "walkthrough",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="The Final Walkthrough has been performed by the Buyer"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.closing.paperwork
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.closing.paperwork}
                        disabled={
                          this.props.assist.closing.paperwork ? true : false
                        }
                        onClick={() =>
                          this.props.closingStep(
                            "paperwork",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="All the necessary paperwork has been Signed"
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    className={
                      this.props.assist.closing.final
                        ? "action-text-completed"
                        : "action-text"
                    }
                    control={
                      <Checkbox
                        color="primary"
                        value={this.props.assist.closing.final}
                        disabled={
                          this.props.assist.closing.final ? true : false
                        }
                        onClick={() =>
                          this.props.closingStep(
                            "final",
                            this.props.match.params.tid
                          )
                        }
                      />
                    }
                    label="Close the deal!"
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <MediaQuery minDeviceWidth={1450}>
        {(matches) => {
          if (matches) {
            return (
              <Box component="div">
                <ReallosLoaderWithOverlay visible={this.props.utils.Loading} />
                <Container>
                  <NavBar />
                  <NavRail />
                  {this.firstTimeModal()}
                  <Box component="div" paddingTop={5} paddingBottom={1}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justify="flex-start"
                    >
                      <Grid item>
                        <PackageIcon size={35} />
                      </Grid>
                      <Grid item>
                        <h2>Transaction 1</h2>
                      </Grid>
                    </Grid>
                  </Box>
                  {this.RenderExpansionPanel()}
                </Container>
              </Box>
            );
          } else {
            return (
              <Box component="div" paddingLeft={8}>
                <ReallosLoaderWithOverlay visible={this.props.utils.Loading} />
                <Container>
                  <NavBar />
                  <NavRail />
                  {this.firstTimeModal()}
                  <Box component="div" paddingTop={5} paddingBottom={1}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      justify="flex-start"
                    >
                      <Grid item>
                        <PackageIcon size={35} />
                      </Grid>
                      <Grid item>
                        <h2>Transaction 1</h2>
                      </Grid>
                    </Grid>
                  </Box>

                  {this.RenderExpansionPanel()}
                </Container>
              </Box>
            );
          }
        }}
      </MediaQuery>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionAssist);
