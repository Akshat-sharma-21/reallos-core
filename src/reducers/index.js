import {combineReducers} from 'redux';
import todoReducer from './todoReducer';
import userReducer from './userReducer';
import transactionReducer from './transactionReducer';
import peopleReducer from './peopleReducer';
import utilsReducer from './utilsReducer';
import assistReducer from './assistReducer'

const mainReducer = combineReducers({
    todo: todoReducer,
    user: userReducer,
    transaction: transactionReducer,
    utils: utilsReducer,
    people: peopleReducer,
    assist: assistReducer
});

export default mainReducer;