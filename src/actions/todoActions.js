import axios from "axios";
import { setLoadingTrue, setLoadingFalse, setErrors } from "./utilsActions";
import { addPeople } from "./peopleActions";
import { addUser } from "./userActions";

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
      axios
        .get(`/user-details`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
          },
        })
        .then((res) => {
          dispatch(
            addUser(
              // dispatching an action to add the user to the redux store
              res.data.id,
              res.data.firstName,
              res.data.lastName,
              res.data.email,
              res.data.phone,
              res.data.role,
              res.data.state,
              res.data.transaction
            )
          );
        })
        .catch((err) => {
          console.error(err);
          dispatch(setErrors(err));
        });
    }

    if (peopleLength === 0) {
      // if the redux store has no people stored
      axios
        .get(`/get-all-people/${id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
          },
        })
        .then((res) => {
          if (res.data.peopleList.length !== peopleLength) {
            // If there has been any changes to people added
            res.data.peopleList.map((person) => {
              dispatch(
                addPeople(
                  person.accepted,
                  person.email,
                  person.name,
                  person.role,
                  person.uid
                )
              );
            });
          }
        })
        .catch((err) => {
          console.error(err);
          dispatch(setErrors());
        });
    }

    axios
      .get(`/get-all-tasks/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
        },
      })
      .then((res) => {
        res.data.todoList.map((todo) => {
          dispatch(
            addTodo(
              todo.id,
              todo.title,
              todo.description,
              todo.date,
              todo.assignedTo,
              todo.assignedBy,
              todo.completed
            )
          );
        });
        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
      })
      .catch((err) => {
        console.error(err);
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
    };
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true
    axios
      .post(`/add-task/${id}`, Task, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
        },
      })
      .then((res) => {
        dispatch(
          addTodo(
            res.data.id,
            Task.title,
            Task.description,
            Task.date,
            Task.assignedTo,
            Task.assignedBy
          )
        );
        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
      })
      .catch((err) => {
        console.error(err);
        dispatch(setErrors(err)); // dispatching an action to set errors to true
      });
  };
}

export function deleteTask(id, taskid) {
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true
    axios
      .delete(`/delete-task/${id}/${taskid}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
        },
      })
      .then((res) => {
        dispatch(deleteTodo(taskid)); // dispatching an action to delete the todo from the redux store
        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
      })
      .catch((err) => {
        console.error(err);
        dispatch(setErrors()); // dispatching an action to set the errors
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
    axios
      .put(`/update-task/${id}/${Task.id}`, editingTask, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
        },
      })
      .then((res) => {
        dispatch(
          editTodo(Task.id, Task.title, Task.description, Task.date, Task.to)
        );
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        console.error(err);
        dispatch(setErrors(err));
      });
  };
}

export function completeTask(id, taskId) {
  // function to mark the task completed
  return (dispatch) => {
    dispatch(setLoadingTrue()); // dispatching an action to set loading to true

    axios
      .put(`/task-done/${id}/${taskId}`, null, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("FBIdToken"),
        },
      })
      .then(() => {
        dispatch(completeTodo(taskId)); // dispatching an action to complete the task
        dispatch(setLoadingFalse());
      })
      .catch((err) => {
        console.error(err);
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
