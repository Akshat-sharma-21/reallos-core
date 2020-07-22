export const SET_LOADING_TRUE = 'SET_LOADING_TRUE';
export const SET_ERRORS = 'SET_ERRORS';
export const SET_LOADING_FALSE = 'SET_LOADING_FALSE'
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export function setLoadingTrue(){
    return ({
        type: SET_LOADING_TRUE
    });
}

export function setLoadingFalse(){
    return ({
        type: SET_LOADING_FALSE
    })
}

export function setErrors(error){
    return ({
        type: SET_ERRORS,
        error
    })
}

export function clearErrors(){
    return ({
        type: CLEAR_ERRORS
    })
}
