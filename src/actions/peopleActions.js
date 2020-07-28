import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addUser } from "./userActions";
import { myFirestore, myFirebase } from "../Config/MyFirebase";

export const ADD_PEOPLE = "ADD_PEOPLE";
export const DELETE_PEOPLE = "DELETE_PEOPLE";
export const CLEAR_PEOPLE = "CLEAR_PEOPLE";

export function getAllPeople(id, user) {
  return (dispatch) => {
    dispatch(clearPeople()); // dispatching an action to clear the people
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    if (user === null) {
      // if the user isn't available
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
      .collection(`transactions/${id}/people`)
      .get()
      .then((querySnapshot) => {
        dispatch(clearPeople()); // dispatching an action to clear the people
        querySnapshot.forEach((doc) => {
          dispatch(
            // adding the people to the redux store
            addPeople(
              doc.data().accepted,
              doc.data().email,
              doc.data().name,
              doc.data().role,
              doc.data().uid
            )
          );
        });
      })
      .then(() => {
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function addPerson(id, newPerson) {
  // adding a new person to the redux store
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    const newPeople = {
      email: newPerson.email,
      accepted: false,
      uid: "",
      role: newPerson.role,
      name: newPerson.name,
    };

    myFirestore
      .doc(`transactions/${id}/people/${newPeople.email}`)
      .set(newPeople)
      .then(() => {
        /*return invitationMail( // comment out when the invitation system is added
          newPeople.name,
          newPeople.email,
          tid,
          transactionData.name,
          transactionData.address,
          newPeople.role
        ); */
      })
      .then(() => {
        dispatch(
          addPeople(
            newPeople.accepted,
            newPeople.email,
            newPeople.name,
            newPeople.role,
            newPeople.uid
          )
        );
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function deletePeople(id, email) {
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    myFirestore
      .doc(`transactions/${id}/people/${email}`)
      .delete()
      .then(() => {
        dispatch(deleteFromStore(email));
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

// pure reducer functions
export function addPeople(accepted, email, name, role, uid) {
  return {
    type: ADD_PEOPLE,
    accepted: accepted,
    email: email,
    name: name,
    role: role,
    uid: uid,
  };
}

export function deleteFromStore(email) {
  return {
    type: DELETE_PEOPLE,
    email: email,
  };
}

export function clearPeople() {
  return {
    type: CLEAR_PEOPLE,
  };
}
