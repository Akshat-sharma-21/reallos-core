import * as actions from '../actions/transactionAssistActions';

const initialState = {
    modal: null,
    escrow: {
        setup: false,
        goodFaith: false,
        completed: false
    }
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
        case actions.ESCROW_SETUP:
            return {
                ...state, escrow: {
                    setup: true,
                    goodFaith: state.escrow.goodFaith,
                    completed: (state.escrow.goodFaith) ? true : false
                }
            }
        case actions.ESCROW_GOOD_FAITH:
            return {
                ...state, escrow: {
                    setup: state.escrow.setup,
                    goodFaith: true,
                    completed: (state.escrow.setup) ? true : false
                }
            }
        default:
            return state;
    }
}

export default assistReducer;