import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addUser } from "./userActions";
import { myFirestore, myFirebase } from "../Config/MyFirebase";
import axios from "axios";

export const ADD_TRANSACTION = "ADD_TRANSACTION"; // Adding the transaction to the reducer
export const CLEAR_TRANSACTION_STORE = "CLEAR_TRANSACTION_STORE"; // clearing the transaction store

export function getTransaction(userId) {
  // getting all the transactions
  return (dispatch) => {
    dispatch(clearTransaction()); // Clearing the transactions from redux store
    dispatch(setLoadingTrue());
    if (userId === null) {
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
          if (doc.data().transactions.length !== 0) {
            // if there are transactions
            doc.data().transactions.map((transId) => {
              myFirestore
                .doc(`transactions/${transId}`)
                .get()
                .then((doc) => {
                  myFirestore
                    .collection(`transactions/${transId}/tasks`)
                    .get()
                    .then((snapshot) => {
                      let task = {
                        all: 0,
                        completed: 0,
                      };
                      snapshot.forEach((doc) => {
                        if (doc.data().completed) {
                          task.all++;
                          task.completed++;
                        } else {
                          task.all++;
                        }
                      });

                      dispatch(
                        addTransaction(
                          transId,
                          doc.data().name,
                          doc.data().address,
                          doc.data().desc,
                          task.all,
                          task.completed
                        )
                      );
                    })
                    .then(() => {
                      dispatch(setLoadingFalse()); // dispatching an action to set loading to false once the data has been loaded
                    })
                    .catch((err) => {
                      dispatch(setErrors(err));
                    });
                })
                .catch((err) => {
                  dispatch(setErrors(err));
                });
            });
          } else {
            dispatch(setLoadingFalse());
          }
        })
        .catch((err) => {
          dispatch(setErrors(err));
        });
    } else {
      // if the user Id is present
      myFirestore
        .doc(`users/${localStorage.getItem("userID")}`)
        .get()
        .then((doc) => {
          if (doc.data().transactions.length !== 0) {
            // if there are any transactions
            doc.data().transactions.map((transId) => {
              myFirestore
                .doc(`transactions/${transId}`)
                .get()
                .then((doc) => {
                  myFirestore
                    .collection(`transactions/${transId}/tasks`)
                    .get()
                    .then((snapshot) => {
                      let task = {
                        all: 0,
                        completed: 0,
                      };
                      snapshot.forEach((doc) => {
                        if (doc.data().completed) {
                          task.all++;
                          task.completed++;
                        } else {
                          task.all++;
                        }
                      });

                      dispatch(
                        addTransaction(
                          transId,
                          doc.data().name,
                          doc.data().address,
                          doc.data().desc,
                          task.all,
                          task.completed
                        )
                      );
                    })
                    .then(() => {
                      dispatch(setLoadingFalse()); // dispatching an action to set loading to false once the data has been loaded
                    })
                    .catch((err) => {
                      dispatch(setErrors(err));
                    });
                })
                .catch((err) => {
                  dispatch(setErrors(err));
                });
            });
          } else {
            dispatch(setLoadingFalse());
          }
        })
        .catch((err) => {
          dispatch(setErrors(err));
        });
    }
  };
}

export function createTransaction(Transaction, people, user) {
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    const newTransaction = {
      name: Transaction.name,
      address: Transaction.address,
      desc: Transaction.desc,
      admin: localStorage.getItem("userID"),
      createdAt: myFirebase.firestore.FieldValue.serverTimestamp(),
      assistView: [],
      // Adding all the field values of transaction assist
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

    myFirestore
      .collection("transactions")
      .add(newTransaction)
      .then((doc) => {
        myFirestore
          .doc(`transactions/${doc.id}`)
          .collection("people")
          .doc(user.email)
          .set({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            uid: localStorage.getItem("userID"),
            accepted: true,
          })
          .then(() => {
            people.forEach((person) => {
              if (user.email !== person.email) {
                myFirestore
                  .doc(`transactions/${doc.id}/people/${person.email}`)
                  .set(person)
                  .then(() => {
                    axios
                      .post("/send-email", {
                        userName: person.name,
                        email: person.email,
                        tid: doc.id,
                        name: newTransaction.name,
                        address: newTransaction.address,
                        role: person.role,
                      })
                      .catch((err) => {
                        dispatch(setErrors(err));
                      });
                  })
                  .catch((err) => {
                    dispatch(setErrors(err));
                  });
              } else {
                dispatch(setErrors("Cannot invite yourself"));
              }
            });
          })
          .then(() => {
            myFirestore.doc(`users/${localStorage.getItem("userID")}`).update({
              transactions: myFirebase.firestore.FieldValue.arrayUnion(doc.id),
            });

            dispatch(
              addTransaction(
                doc.id,
                newTransaction.name,
                newTransaction.address,
                newTransaction.desc,
                0,
                0
              )
            );
            dispatch(setLoadingFalse());
          })
          .catch((err) => {
            dispatch(setErrors(err));
          });
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

// Pure Reducer functions
export function addTransaction(
  id,
  Name,
  Address,
  Description,
  allTask,
  completedTask
) {
  return {
    type: ADD_TRANSACTION,
    id: id,
    Name: Name,
    Address: Address,
    Description: Description,
    allTask,
    completedTask,
  };
}

export function clearTransaction() {
  return {
    type: CLEAR_TRANSACTION_STORE,
  };
}
