import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addPeople, clearPeople } from "./peopleActions";
import { addUser } from "./userActions";
import { myFirestore, myFirebase } from "../Config/MyFirebase";

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const EDIT_TODO = "EDIT_TODO";
export const COMPLETE_TODO = "COMPLETE_TODO";
export const CLEAR_TODO = "CLEAR_TODO";

export function getTask(id, peopleLength, user) {
  // getting the tasks from the server
  return (dispatch) => {
    dispatch(clearTodo()); // dispatching an action to clear the todos from the redux store
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

    if (peopleLength === 0) {
      // if the redux store has no people stored
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
        .catch((err) => {
          dispatch(setErrors(err));
        });
    }

    myFirestore
      .collection(`transactions/${id}/tasks`)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          dispatch(
            addTodo(
              doc.id,
              doc.data().title,
              doc.data().description,
              doc.data().date,
              doc.data().assignedTo,
              doc.data().assignedBy,
              doc.data().Completed
            )
          );
        });
      })
      .then(() => {
        dispatch(setLoadingFalse()); // Dispatching ana ction to set loading to false
      })
      .catch((err) => {
        dispatch(setErrors(err)); // dispatching an action to set the errors
      });
  };
}

export function addTask(id, newTask) {
  return (dispatch) => {
    let To = {
      name: newTask.To.name,
      email: newTask.To.email,
    };
    let From = {
      name: newTask.From.Name,
      email: newTask.From.email,
      id: localStorage.getItem("userID"),
    };
    let Task = {
      date: newTask.Date,
      description: newTask.Description,
      assignedBy: From,
      assignedTo: To,
      title: newTask.Title,
      completed: false,
      createdAt: myFirebase.firestore.FieldValue.serverTimestamp(),
    };
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    myFirestore
      .doc(`transactions/${id}`)
      .get()
      .then(() => {
        return myFirestore.collection(`transactions/${id}/tasks`).add(Task);
      })
      .then((doc) => {
        dispatch(
          addTodo(
            doc.id,
            Task.title,
            Task.description,
            Task.date,
            Task.assignedTo,
            Task.assignedBy,
            Task.completed
          )
        );
      })
      .then(() => {
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function deleteTask(id, taskid) {
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true
    myFirestore
      .doc(`transactions/${id}/tasks/${taskid}`)
      .delete()
      .then(() => {
        dispatch(deleteTodo(taskid));
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function editTask(id, Task) {
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    let editingTask = {
      title: Task.title,
      description: Task.description,
      assignedTo: Task.to,
      date: Task.date,
    };

    myFirestore
      .doc(`transactions/${id}/tasks/${Task.id}`)
      .update(editingTask)
      .then(() => {
        dispatch(
          editTodo(Task.id, Task.title, Task.description, Task.date, Task.to)
        );
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

export function completeTask(id, taskId) {
  // function to mark the task completed
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    myFirestore
      .doc(`transactions/${id}/tasks/${taskId}`)
      .update({ completed: true })
      .then(() => {
        dispatch(completeTodo(taskId));
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        dispatch(setErrors(err));
      });
  };
}

// pure Reducer Functions
export function addTodo(id, Title, Description, Date, To, From, Completed) {
  // action creator for ADD_TODO
  return {
    type: ADD_TODO,
    id,
    Title,
    Description,
    Date,
    To,
    From,
    Completed,
  };
}

export function deleteTodo(id) {
  // action creator for DELETE_TODO
  return {
    type: DELETE_TODO,
    id,
  };
}

export function editTodo(id, Title, Description, Date, To) {
  return {
    type: EDIT_TODO,
    id,
    Title,
    Description,
    Date,
    To,
  };
}

export function completeTodo(id) {
  return {
    type: COMPLETE_TODO,
    id,
  };
}

export function clearTodo() {
  return {
    type: CLEAR_TODO,
  };
}
