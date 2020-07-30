import * as actions from "../actions/transactionAssistActions";

const initialState = {
  modal: null,
  escrow: {
    setup: false,
    goodFaith: false,
    loanDocument: false,
    completed: false,
    numberOfCompleted: 0,
  },
  titleSearch: {
    titleReport: false,
    titleInsurance: false,
    completed: false,
    numberOfCompleted: 0,
  },
  homeAppraisal: {
    homeAppraisalAppointed: false,
    homeAppraisalReport: false,
    completed: false,
    numberOfCompleted: 0,
  },
  homeInspection: {
    homeInspectionAppointed: false,
    homeInspectionReport: false,
    completed: false,
    numberOfCompleted: 0,
  },
  loan: {
    application: false,
    recieved: false,
    approved: false,
    completed: false,
    numberOfCompleted: 0,
  },
  closing: {
    walkthrough: false,
    paperwork: false,
    final: false,
    completed: false,
    numberOfCompleted: 0,
  },
};

function assistReducer(state = initialState, action) {
  switch (action.type) {
    case actions.MODAL_OPEN:
      return {
        ...state,
        modal: true,
      };
    case actions.MODAL_CLOSE:
      return {
        ...state,
        modal: false,
      };
    case actions.ASSIST_SETUP:
      return {
        ...state,
        escrow: {
          setup: action.escrow.setup,
          goodFaith: action.escrow.goodFaith,
          loanDocument: action.escrow.loanDocument,
          completed: action.escrow.completed,
          numberOfCompleted: action.escrow.numberOfCompleted,
        },
        titleSearch: {
          titleReport: action.titleSearch.titleReport,
          titleInsurance: action.titleSearch.titleInsurance,
          completed: action.titleSearch.completed,
          numberOfCompleted: action.titleSearch.numberOfCompleted,
        },
        homeAppraisal: {
          homeAppraisalAppointed: action.homeAppraisal.homeAppraisalAppointed,
          homeAppraisalReport: action.homeAppraisal.homeAppraisalReport,
          completed: action.homeAppraisal.completed,
          numberOfCompleted: action.homeAppraisal.numberOfCompleted,
        },
        homeInspection: {
          homeInspectionAppointed:
            action.homeInspection.homeInspectionAppointed,
          homeInspectionReport: action.homeInspection.homeInspectionReport,
          completed: action.homeInspection.completed,
          numberOfCompleted: action.homeInspection.numberOfCompleted,
        },
        loan: {
          application: action.loan.application,
          recieved: action.loan.recieved,
          approved: action.loan.approved,
          completed: action.loan.completed,
          numberOfCompleted: action.loan.numberOfCompleted,
        },
        closing: {
          walkthrough: action.closing.walkthrough,
          paperwork: action.closing.paperwork,
          final: action.closing.final,
          completed: action.closing.completed,
          numberOfCompleted: action.closing.numberOfCompleted,
        },
      };
    case actions.ESCROW_SETUP:
      return {
        ...state,
        escrow: {
          setup: true,
          goodFaith: state.escrow.goodFaith,
          loanDocument: state.escrow.loanDocument,
          completed:
            state.escrow.goodFaith && state.escrow.loanDocument ? true : false,
          numberOfCompleted: state.escrow.numberOfCompleted + 1,
        },
      };
    case actions.ESCROW_GOOD_FAITH:
      return {
        ...state,
        escrow: {
          setup: state.escrow.setup,
          goodFaith: true,
          loanDocument: state.escrow.loanDocument,
          completed:
            state.escrow.setup && state.escrow.loanDocument ? true : false,
          numberOfCompleted: state.escrow.numberOfCompleted + 1,
        },
      };
    case actions.ESCROW_LOAN_DOCUMENT:
      return {
        ...state,
        escrow: {
          setup: state.escrow.setup,
          goodFaith: state.escrow.goodFaith,
          loanDocument: true,
          completed:
            state.escrow.setup && state.escrow.goodFaith ? true : false,
          numberOfCompleted: state.escrow.numberOfCompleted + 1,
        },
      };
    case actions.TITLE_SEARCH_REPORT:
      return {
        ...state,
        titleSearch: {
          titleReport: true,
          titleInsurance: state.titleSearch.titleInsurance,
          completed: state.titleSearch.titleInsurance ? true : false,
          numberOfCompleted: state.titleSearch.numberOfCompleted + 1,
        },
      };
    case actions.TITLE_SEARCH_INSURANCE:
      return {
        ...state,
        titleSearch: {
          titleReport: state.titleSearch.titleReport,
          titleInsurance: true,
          completed: state.titleSearch.titleReport ? true : false,
          numberOfCompleted: state.titleSearch.numberOfCompleted + 1,
        },
      };
    case actions.HOME_APPRAISAL_APPOINTED:
      return {
        ...state,
        homeAppraisal: {
          homeAppraisalAppointed: true,
          homeAppraisalReport: state.homeAppraisal.homeAppraisalReport,
          completed: state.homeAppraisal.homeAppraisalReport ? true : false,
          numberOfCompleted: state.homeAppraisal.numberOfCompleted + 1,
        },
      };
    case actions.HOME_APPRAISAL_REPORT:
      return {
        ...state,
        homeAppraisal: {
          homeAppraisalAppointed: state.homeAppraisal.homeAppraisalAppointed,
          homeAppraisalReport: true,
          completed: state.homeAppraisal.homeAppraisalAppointed ? true : false,
          numberOfCompleted: state.homeAppraisal.numberOfCompleted + 1,
        },
      };
    case actions.HOME_INSPECTION_APPOINTED:
      return {
        ...state,
        homeInspection: {
          homeInspectionAppointed: true,
          homeInspectionReport: state.homeInspection.homeInspectionReport,
          completed: state.homeInspection.homeInspectionReport ? true : false,
          numberOfCompleted: state.homeInspection.numberOfCompleted + 1,
        },
      };
    case actions.HOME_INSPECTION_REPORT:
      return {
        ...state,
        homeInspection: {
          homeInspectionAppointed: state.homeInspection.homeInspectionAppointed,
          homeInspectionReport: true,
          completed: state.homeInspection.homeInspectionAppointed
            ? true
            : false,
          numberOfCompleted: state.homeInspection.numberOfCompleted + 1,
        },
      };
    case actions.LOAN_APPLICATION:
      return {
        ...state,
        loan: {
          application: true,
          recieved: state.loan.recieved,
          approved: state.loan.approved,
          completed: state.loan.recieved && state.loan.approved ? true : false,
          numberOfCompleted: state.loan.numberOfCompleted + 1,
        },
      };
    case actions.LOAN_APPLICATION_RECIEVED:
      return {
        ...state,
        loan: {
          application: state.loan.application,
          recieved: true,
          approved: state.loan.approved,
          completed:
            state.loan.application && state.loan.approved ? true : false,
          numberOfCompleted: state.loan.numberOfCompleted + 1,
        },
      };
    case actions.LOAN_APPROVED:
      return {
        ...state,
        loan: {
          application: state.loan.application,
          recieved: state.loan.recieved,
          approved: true,
          completed:
            state.loan.application && state.loan.recieved ? true : false,
          numberOfCompleted: state.loan.numberOfCompleted + 1,
        },
      };
    case actions.CLOSING_WALKTHROUGH:
      return {
        ...state,
        closing: {
          walkthrough: true,
          paperwork: state.closing.paperwork,
          final: state.closing.final,
          completed:
            state.closing.paperwork && state.closing.final ? true : false,
          numberOfCompleted: state.closing.numberOfCompleted + 1,
        },
      };
    case actions.CLOSING_PAPERWORK:
      return {
        ...state,
        closing: {
          walkthrough: state.closing.walkthrough,
          paperwork: true,
          final: state.closing.final,
          completed:
            state.closing.walkthrough && state.closing.paperwork ? true : false,
          numberOfCompleted: state.closing.numberOfCompleted + 1,
        },
      };
    case actions.CLOSING_FINAL:
      return {
        ...state,
        closing: {
          walkthrough: state.closing.walkthrough,
          paperwork: state.closing.paperwork,
          final: true,
          completed:
            state.closing.walkthrough && state.closing.paperwork ? true : false,
          numberOfCompleted: state.closing.numberOfCompleted + 1,
        },
      };
    default:
      return state;
  }
}

export default assistReducer;
