import * as actions from '../actions/peopleActions';
const intialState = [
];

function peopleReducer(state = intialState,action){
    switch(action.type){
        case actions.ADD_PEOPLE:
            return [
                ...state,{
                    accepted: action.accepted,
                    email: action.email,
                    name: action.name,
                    role: action.role,
                    uid: action.uid
                }
            ]
            case actions.DELETE_PEOPLE:
                return state.filter(todo => todo.email !== action.email);
            case actions.CLEAR_PEOPLE:
                return intialState;
        default:
            return state;
    }
}

export default peopleReducer;