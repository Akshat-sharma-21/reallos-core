import * as actions from '../actions/transactionAssistActions';

const initialState = {
    modal: null
};

function assistReducer(state = initialState, action){
    switch(action.type){
        case actions.MODAL_OPEN:
            return {
                ...state, modal: true
            }
        case actions.MODAL_CLOSE:
            return {
                ...state, modal: false
            }
        default:
            return state;
    }
}

export default assistReducer;