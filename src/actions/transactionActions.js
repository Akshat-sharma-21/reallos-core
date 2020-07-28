import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addUser } from "./userActions";
import { myFirestore, myFirebase } from "../Config/MyFirebase";

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
              myFirestore
                .doc(`transactions/${doc.id}/people/${person.email}`)
                .set(person);
              /*invitationMail( // uncomment when sendgrid is implemented
                        person.name,
                        person.email,
                        tid,
                        doc.data().name,
                        doc.data().address,
                        person.role
                    );*/
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
                people
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
