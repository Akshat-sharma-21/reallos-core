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
export const ASSIST_SETUP = "ASSIST_SETUP";

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
          dispatch(
            assistSetup(
              doc.data().escrow,
              doc.data().homeAppraisal,
              doc.data().homeInspection,
              doc.data().titleSearch,
              doc.data().loan,
              doc.data().closing
            )
          );
          dispatch(setLoadingFalse()); // dispatching an action to set loading to false
        } else {
          dispatch(setErrors("Transaction not found"));
        }
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function escrowStep(escrowAction, tid) {
  return (dispatch) => {
    switch (escrowAction) {
      case "setup":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let escrow = doc.data().escrow;
            escrow = {
              ...escrow,
              setup: true,
              completed: escrow.goodFaith && escrow.loanDocument ? true : false,
              numberOfCompleted: escrow.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                escrow,
              })
              .then(() => {
                dispatch(escrowSetup());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "goodFaith":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let escrow = doc.data().escrow;
            escrow = {
              ...escrow,
              goodFaith: true,
              completed: escrow.setup && escrow.loanDocument ? true : false,
              numberOfCompleted: escrow.numberOfCompleted + 1,
            };

            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                escrow,
              })
              .then(() => {
                dispatch(escrowGoodFaith());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "loanDocument":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let escrow = doc.data().escrow;
            escrow = {
              ...escrow,
              loanDocument: true,
              completed: escrow.setup && escrow.goodFaith ? true : false,
              numberOfCompleted: escrow.numberOfCompleted + 1,
            };

            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                escrow,
              })
              .then(() => {
                dispatch(escrowLoanDocument());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      default:
        dispatch(setErrors("Error occured in assist Escrow"));
        break;
    }
  };
}

export function titleStep(titleAction, tid) {
  return (dispatch) => {
    switch (titleAction) {
      case "report":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let titleSearch = doc.data().titleSearch;
            titleSearch = {
              ...titleSearch,
              titleReport: true,
              completed: titleSearch.titleInsurance ? true : false,
              numberOfCompleted: titleSearch.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                titleSearch,
              })
              .then(() => {
                dispatch(titleReport());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "insurance":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let titleSearch = doc.data().titleSearch;
            titleSearch = {
              ...titleSearch,
              titleInsurance: true,
              completed: titleSearch.titleReport ? true : false,
              numberOfCompleted: titleSearch.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                titleSearch,
              })
              .then(() => {
                dispatch(titleInsurance());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      default:
        dispatch(setErrors("Error occured in assist Title Search"));
        break;
    }
  };
}

export function homeAppraisalStep(homeAppraisalAction, tid) {
  return (dispatch) => {
    switch (homeAppraisalAction) {
      case "appointed":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let homeAppraisal = doc.data().homeAppraisal;
            homeAppraisal = {
              ...homeAppraisal,
              homeAppraisalAppointed: true,
              completed: homeAppraisal.homeAppraisalReport ? true : false,
              numberOfCompleted: homeAppraisal.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                homeAppraisal,
              })
              .then(() => {
                dispatch(homeAppraisalAppointed());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "report":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let homeAppraisal = doc.data().homeAppraisal;
            homeAppraisal = {
              ...homeAppraisal,
              homeAppraisalReport: true,
              completed: homeAppraisal.homeAppraisalAppointed ? true : false,
              numberOfCompleted: homeAppraisal.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                homeAppraisal,
              })
              .then(() => {
                dispatch(homeAppraisalReport());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      default:
        dispatch(setErrors("Error occured in assist Home Appraisal"));
        break;
    }
  };
}

export function homeInspectionStep(homeInspectionAction, tid) {
  return (dispatch) => {
    switch (homeInspectionAction) {
      case "appointed":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let homeInspection = doc.data().homeInspection;
            homeInspection = {
              ...homeInspection,
              homeInspectionAppointed: true,
              completed: homeInspection.homeInspectionReport ? true : false,
              numberOfCompleted: homeInspection.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                homeInspection,
              })
              .then(() => {
                dispatch(homeInspectionAppointed());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "report":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let homeInspection = doc.data().homeInspection;
            homeInspection = {
              ...homeInspection,
              homeInspectionReport: true,
              completed: homeInspection.homeInspectionAppointed ? true : false,
              numberOfCompleted: homeInspection.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                homeInspection,
              })
              .then(() => {
                dispatch(homeInspectionReport());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      default:
        dispatch(setErrors("Error occured in assist Home Inspection"));
        break;
    }
  };
}

export function LoanStep(LoanAction, tid) {
  return (dispatch) => {
    switch (LoanAction) {
      case "application":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let loan = doc.data().loan;
            loan = {
              ...loan,
              application: true,
              completed: loan.approved && loan.recieved ? true : false,
              numberOfCompleted: loan.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                loan,
              })
              .then(() => {
                dispatch(loanApplication());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "recieved":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let loan = doc.data().loan;
            loan = {
              ...loan,
              recieved: true,
              completed: loan.approved && loan.application ? true : false,
              numberOfCompleted: loan.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                loan,
              })
              .then(() => {
                dispatch(loanRecived());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "approved":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let loan = doc.data().loan;
            loan = {
              ...loan,
              approved: true,
              completed: loan.recieved && loan.application ? true : false,
              numberOfCompleted: loan.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                loan,
              })
              .then(() => {
                dispatch(loanApproved());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      default:
        dispatch(setErrors("Error occured in assist Loan"));
        break;
    }
  };
}

export function closingStep(closingStep, tid) {
  return (dispatch) => {
    switch (closingStep) {
      case "walkthrough":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let closing = doc.data().closing;
            closing = {
              ...closing,
              walkthrough: true,
              completed: closing.paperwork && closing.final ? true : false,
              numberOfCompleted: closing.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                closing,
              })
              .then(() => {
                dispatch(closingWalkthrough());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "paperwork":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let closing = doc.data().closing;
            closing = {
              ...closing,
              paperwork: true,
              completed: closing.walkthrough && closing.final ? true : false,
              numberOfCompleted: closing.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                closing,
              })
              .then(() => {
                dispatch(closingPaperwork());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
        break;
      case "final":
        dispatch(setLoadingTrue());
        myFirestore
          .doc(`transactions/${tid}`)
          .get()
          .then((doc) => {
            let closing = doc.data().closing;
            closing = {
              ...closing,
              final: true,
              completed:
                closing.walkthrough && closing.paperwork ? true : false,
              numberOfCompleted: closing.numberOfCompleted + 1,
            };
            myFirestore
              .doc(`transactions/${tid}`)
              .update({
                closing,
              })
              .then(() => {
                dispatch(closingFinal());
                dispatch(setLoadingFalse());
              })
              .catch((err) => {
                dispatch(setErrors(err));
              });
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
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

export function assistSetup(
  escrow,
  homeAppraisal,
  homeInspection,
  titleSearch,
  loan,
  closing
) {
  return {
    type: ASSIST_SETUP,
    escrow,
    homeAppraisal,
    homeInspection,
    titleSearch,
    loan,
    closing,
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
