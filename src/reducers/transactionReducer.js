import * as actions from "../actions/transactionActions";

const initialState = [
  // this intitial state represents all the transaction is the database
];

function transactionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_TRANSACTION: // Adding a transaction for a particular user
      return [
        ...state,
        {
          id: action.id,
          Name: action.Name,
          Address: action.Address,
          Description: action.Description,
          allTask: action.allTask,
          completedTask: action.completedTask,
          active: false,
        },
      ];
    case actions.CLEAR_TRANSACTION_STORE: // clearing the redux store
      return initialState;
    default:
      return state;
  }
}

export default transactionReducer;
