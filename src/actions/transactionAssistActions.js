import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addUser } from "./userActions";
import { myFirestore } from "../Config/MyFirebase"; // Importing the firestore

export const MODAL_OPEN = "MODAL_OPEN";
export const MODAL_CLOSE = "MODAL_CLOSE";
export const ESCROW_SETUP = "ESCROW_SETUP";
export const ESCROW_GOOD_FAITH = "ESCROW_GOOD_FAITH";
export const ESCROW_LOAN_DOCUMENT = "ESCROW_LOAN_DOCUMENT";
export const TITLE_SEARCH_REPORT = "TITLE_SEARCH_REPORT";
export const TITLE_SEARCH_INSURANCE = "TITLE_SEARCH_INSURANCE";
export const HOME_APPRAISAL_APPOINTED = "HOME_APPRAISAL_APPOINTED";
export const HOME_APPRAISAL_REPORT = "HOME_APPRAISAL_REPORT";
export const HOME_INSPECTION_APPOINTED = "HOME_INSPECTION_APPOINTED";
export const HOME_INSPECTION_REPORT = "HOME_INSPECTION_REPORT";
export const LOAN_APPLICATION = "LOAN_APPLICATION";
export const LOAN_APPLICATION_RECIEVED = "LOAN_APPLICATION_RECIEVED";
export const LOAN_APPROVED = "LOAN_APPROVED";
export const CLOSING_WALKTHROUGH = "CLOSING_WALKTHROUGH";
export const CLOSING_PAPERWORK = "CLOSING_PAPERWORK";
export const CLOSING_FINAL = "CLOSING_FINAL";

export function openAssistModal(user, transId) {
  return (dispatch) => {
    dispatch(setLoadingTrue());
    if (user.id === null) {
      // if the user is not stored in the redux store
      myFirestore
        .doc(`users/${localStorage.getItem("userID")}`)
        .get()
        .then((doc) => {
          dispatch(
            addUser(
              localStorage.getItem("userID"),
              doc.data().firstName,
              doc.data().lastName,
              doc.data().email,
              doc.data().phone,
              doc.data().role,
              doc.data().state,
              doc.data().transactions
            )
          );
        })
        .catch((err) => {
          dispatch(setErrors(err));
        });
    }

    myFirestore
      .collection("transactions")
      .doc(transId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().assistView.includes(localStorage.getItem("userID"))) {
            // if the transaction assist has already been seen by the user
            dispatch(modalClose()); // dispatching an action to set the modal to closed
          } else {
            // else let the modal be open
            dispatch(modalOpen()); // dipatching an action to set the modal to open

            let assistViewArray = doc.data().assistView;
            assistViewArray.push(localStorage.getItem("userID")); // pushing the user id in the array

            myFirestore.collection("transactions").doc(transId).update({
              assistView: assistViewArray,
            });
          }
          dispatch(setLoadingFalse()); // dispatching an action to set loading to false
        } else {
          console.error("Transaction not found"); // If the document doesn't exist in the database
          dispatch(setErrors("Transaction not found"));
        }
      })
      .catch((err) => {
        console.error(err);
        dispatch(setErrors(err));
      });
  };
}

export function escrowStep(escrowAction) {
  return (dispatch) => {
    switch (escrowAction) {
      case "setup":
        dispatch(escrowSetup());
        break;
      case "goodFaith":
        dispatch(escrowGoodFaith());
        break;
      case "loanDocument":
        dispatch(escrowLoanDocument());
      default:
        dispatch(setErrors("Error occured in assist Escrow"));
        break;
    }
  };
}

export function titleStep(titleAction) {
  return (dispatch) => {
    switch (titleAction) {
      case "report":
        dispatch(titleReport());
        break;
      case "insurance":
        dispatch(titleInsurance());
        break;
      default:
        dispatch(setErrors("Error occured in assist Title Search"));
        break;
    }
  };
}

export function homeAppraisalStep(homeAppraisalAction) {
  return (dispatch) => {
    switch (homeAppraisalAction) {
      case "appointed":
        dispatch(homeAppraisalAppointed());
        break;
      case "report":
        dispatch(homeAppraisalReport());
        break;
      default:
        dispatch(setErrors("Error occured in assist Home Appraisal"));
        break;
    }
  };
}

export function homeInspectionStep(homeInspectionAction) {
  return (dispatch) => {
    switch (homeInspectionAction) {
      case "appointed":
        dispatch(homeInspectionAppointed());
        break;
      case "report":
        dispatch(homeInspectionReport());
        break;
      default:
        dispatch(setErrors("Error occured in assist Home Inspection"));
        break;
    }
  };
}

export function LoanStep(LoanAction) {
  return (dispatch) => {
    switch (LoanAction) {
      case "application":
        dispatch(loanApplication());
        break;
      case "recieved":
        dispatch(loanRecived());
        break;
      case "approved":
        dispatch(loanApproved());
        break;
      default:
        dispatch(setErrors("Error occured in assist Loan"));
        break;
    }
  };
}

export function closingStep(closingStep) {
  return (dispatch) => {
    switch (closingStep) {
      case "walkthrough":
        dispatch(closingWalkthrough());
        break;
      case "paperwork":
        dispatch(closingPaperwork());
        break;
      case "final":
        dispatch(closingFinal());
        break;
      default:
        dispatch(setErrors("Error occured in assist Closing"));
        break;
    }
  };
}
// pure Reducer functions

export function modalOpen() {
  return {
    type: MODAL_OPEN,
  };
}

export function modalClose() {
  return {
    type: MODAL_CLOSE,
  };
}

export function escrowSetup() {
  return {
    type: ESCROW_SETUP,
  };
}

export function escrowGoodFaith() {
  return {
    type: ESCROW_GOOD_FAITH,
  };
}

export function escrowLoanDocument() {
  return {
    type: ESCROW_LOAN_DOCUMENT,
  };
}

export function titleReport() {
  return {
    type: TITLE_SEARCH_REPORT,
  };
}

export function titleInsurance() {
  return {
    type: TITLE_SEARCH_INSURANCE,
  };
}

export function homeAppraisalAppointed() {
  return {
    type: HOME_APPRAISAL_APPOINTED,
  };
}

export function homeAppraisalReport() {
  return {
    type: HOME_APPRAISAL_REPORT,
  };
}

export function homeInspectionAppointed() {
  return {
    type: HOME_INSPECTION_APPOINTED,
  };
}

export function homeInspectionReport() {
  return {
    type: HOME_INSPECTION_REPORT,
  };
}

export function loanApplication() {
  return {
    type: LOAN_APPLICATION,
  };
}

export function loanRecived() {
  return {
    type: LOAN_APPLICATION_RECIEVED,
  };
}

export function loanApproved() {
  return {
    type: LOAN_APPROVED,
  };
}

export function closingWalkthrough() {
  return {
    type: CLOSING_WALKTHROUGH,
  };
}

export function closingPaperwork() {
  return {
    type: CLOSING_PAPERWORK,
  };
}

export function closingFinal() {
  return {
    type: CLOSING_FINAL,
  };
}
