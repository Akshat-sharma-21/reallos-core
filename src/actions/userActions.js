import axios from 'axios'; // Importing axios to make endpoint request
import { myFirebase } from '../Config/MyFirebase';
import { setLoadingTrue, setLoadingFalse, setErrors } from './utilsActions'; // Importing acttions for util purposes

export const ADD_USER = 'ADD_USER'; // Action to add the user to the database
export const ADD_TRANSACTION_USER = 'ADD_TRANSACTION_USER'; // Action to add the transaction to the user
export const EDIT_USER = 'EDIT_USER';

export function signupUser(newUser) { 
    return (dispatch) => {
        dispatch(setLoadingTrue()); // dispatching an action set loading to true
        myFirebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password) // creating a new user with email and password
        .then( res =>{
            localStorage.setItem('userID', res.user.uid); // storing the uid in local storage

            let user = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phone: newUser.phone,
                role: newUser.role,
                state: newUser.state
            };

            axios.post(`/add-user-details/${localStorage.getItem('userID')}`,user)
            .then(() =>{
                myFirebase.auth().currentUser.sendEmailVerification(); // Sending the email verification to the new user
                dispatch(setLoadingFalse()); // dispatching an action to set loading to false
            })
            .catch(err =>{
                let error;
                switch(err.code){
                    case 'auth/email-already-in-use': 
                        error = 'Account already exists with this email';
                        break;
                    case 'auth/network-request-failed':
                        error = 'Please check your internet connection';
                        break;
                    default :
                        error = 'Something went wrong, try again later!'
                        break;
                }
                dispatch(setErrors(error));
            })

        })
        .catch(err => {
            let error;
            switch(err.code){
                case 'auth/email-already-in-use': 
                    error = 'Account already exists with this email';
                    break;
                case 'auth/network-request-failed':
                    error = 'Please check your internet connection';
                    break;
                default :
                    error = 'Something went wrong, try again later!'
                    break;
            }
            dispatch(setErrors(error));
        })
    }
} 

export function login(user) { 
    return (dispatch) => {
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true
        myFirebase.auth().signInWithEmailAndPassword(user.email, user.password) // Logging in the user
        .then( res => {
            if(!myFirebase.auth().currentUser.emailVerified){
                let error = {
                    code: 'verify email'
                }
                throw error;
            }
            return res.user.getIdToken(); // returning the jwt token
        })
        .then( token =>{
            localStorage.setItem('FBIdToken',token); // storing the token locally
            localStorage.setItem('userID', myFirebase.auth().currentUser.uid); // storing the uid locally

            window.location.href = '/transaction';
            dispatch(setLoadingFalse()); // dispatching an action to set loading to false
        })
        .catch( err =>{
            let error;
            switch(err.code){
                case 'auth/wrong-password': 
                    error = 'Incorrect email or passowrd!';
                    break;
                case 'auth/network-request-failed':
                    error = 'Please check your internet connection';
                    break;
                case 'verify email':
                    error = 'Please verify your email';
                    break;
                default :
                    error = 'Something went wrong, try again later!'
                    break;
            }
            dispatch(setErrors(error));
        })
    }
}

export function googleAuth(){
    return (dispatch) =>{
        myFirebase.auth().signInWithPopup(new myFirebase.auth.GoogleAuthProvider())
        .then(res =>{
            localStorage.setItem('userID', res.user.uid); // storing the userID in the localstorage
            res.user.getIdToken()
            .then( token =>{
                localStorage.setItem('FBIdToken',token); // storing the jwt in the localstorage
            })
            .catch(err =>{
                dispatch(setErrors(err));
            })

            window.location.href = '/transaction';
        })
        .catch(err =>{
            dispatch(setErrors(err)); // dispatching an action to set the error
        })
    }
}

export function facebookAuth(){
    return (dispatch) =>{
        myFirebase.auth().signInWithPopup(new myFirebase.auth.FacebookAuthProvider())
        .then(res =>{
            localStorage.setItem('userID', res.user.uid); // storing the userID in the localstorage
            res.user.getIdToken()
            .then( token =>{
                localStorage.setItem('FBIdToken',token); // storing the jwt in the localstorage
            })
            .catch(err =>{
                dispatch(setErrors(err));
            })

            window.location.href = '/transaction';
        })
        .catch(err =>{
            dispatch(setErrors(err)); // dispatching an action to set the error
        })
    }
}

export function additionalInformation(userInfo){
    return (dispatch) =>{
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true

        let info = {
            email: myFirebase.auth().currentUser.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            phone: userInfo.phone,
            role: userInfo.role,
            state: userInfo.state
        };

        axios.post(`/add-user-details/${localStorage.getItem('userID')}`,info,{
            headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
        })
        .then(() =>{

            dispatch(addUser( // dispatching an action to add the user to the redux store
                localStorage.getItem('userID'),
                info.firstName,
                info.lastName,
                info.email,
                info.phone,
                info.role,
                info.state,
                null
            ));
            dispatch(setLoadingFalse()); // Dispatching an action to set loading to false
        })
        .catch(err =>{
            dispatch(setErrors(err)); // dispatching an action to set the errors
        })
    }
}





export function editingUser(newUser) { // to edit the current user
    return (dispatch) => {
        axios.put(`/update-profile`,newUser, {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('FBIdToken')}
        })
        .then(() => {
            dispatch(editUser(
                newUser.firstName,
                newUser.lastName,
                newUser.email,
                newUser.role,
                newUser.phone,
                newUser.state
            ));
        })
        .catch(err => {
            console.error(err);
            if(err.response){
                    dispatch(setErrors(err.response.data)); // dispatching an action to set the error
                }
                else{
                    dispatch(setErrors({error: 'Please check your internet connection'}));
                }
        })
    }
}


export function acceptInvitation(transId,user){
    return (dispatch) =>{
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true
        myFirebase.auth().signInWithEmailAndPassword(user.email, user.password) // Logging in the user
        .then( res => {
            if(!myFirebase.auth().currentUser.emailVerified){
                let error = {
                    code: 'verify email'
                }
                throw error;
            }
            return res.user.getIdToken(); // returning the jwt token
        })
        .then( token =>{
            localStorage.setItem('FBIdToken',token); // storing the token locally
            localStorage.setItem('userID', myFirebase.auth().currentUser.uid); // storing the uid locally

            axios.post(`/invite/${transId}`,null,{ // Adding the signed in user to the transaction
                headers: {Authorization: 'Bearer '+ token}
            })
            .then(()=>{
                axios.put(`/add-transaction-to-user/${transId}`,null,{
                    headers: {Authorization: 'Bearer ' + token}
                })
                .then(() =>{
                    window.location.href = '/transaction'; // redirecting to the transaction
                    dispatch(setLoadingFalse()); // dispatching an action to set loading to false
                })
                .catch(err =>{
                    console.error(err);
                    dispatch(setErrors(err)); // dispatching an action to add the errors
                })
            })
            .catch(err =>{
                console.error(err);
                dispatch(setErrors(err)); // dispatching an action to set the errors
            })
        })
        .catch( err =>{
            let error;
            switch(err.code){
                case 'auth/wrong-password': 
                    error = 'Incorrect email or passowrd!';
                    break;
                case 'auth/network-request-failed':
                    error = 'Please check your internet connection';
                    break;
                case 'verify email':
                    error = 'Please verify your email';
                    break;
                default :
                    error = 'Something went wrong, try again later!'
                    break;
            }
            dispatch(setErrors(error));
        })
    }
}

export function acceptInvitationSignUp(transId,newUser){
    return (dispatch) => {
        dispatch(setLoadingTrue()); // dispatching an action set loading to true
        myFirebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password) // creating a new user with email and password
        .then( res =>{
            localStorage.setItem('userID', res.user.uid); // storing the uid in local storage
                return res.user.getIdToken();
        })
        .then(token => {

            localStorage.setItem('FBIdToken', token); // Storing the token in the local storage
            let user = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phone: newUser.phone,
                role: newUser.role,
                state: newUser.state
            };

            axios.post(`/add-user-details/${localStorage.getItem('userID')}`,user)
            .then(() =>{
                myFirebase.auth().currentUser.sendEmailVerification(); // Sending the email verification to the new user

                axios.post(`/invite/${transId}`, null, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('FBIdToken')}
                })
                .then(() =>{
                    axios.put(`/add-transaction-to-user/${transId}`,null,{
                        headers: {Authorization: 'Bearer ' + localStorage.getItem('FBIdToken')}
                    })
                    .then(()=>{
                        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
                    })
                    .catch(err =>{
                        console.error(err);
                        dispatch(setErrors(err));
                    })
                })
                .catch(err =>{
                    console.error(err);
                    dispatch(setErrors(err));
                })
            })
            .catch(err =>{
                let error;
                switch(err.code){
                    case 'auth/email-already-in-use': 
                        error = 'Account already exists with this email';
                        break;
                    case 'auth/network-request-failed':
                        error = 'Please check your internet connection';
                        break;
                    default :
                        error = 'Something went wrong, try again later!'
                        break;
                }
                dispatch(setErrors(error));
            })
        })
        .catch(err => {
            let error;
            switch(err.code){
                case 'auth/email-already-in-use': 
                    error = 'Account already exists with this email';
                    break;
                case 'auth/network-request-failed':
                    error = 'Please check your internet connection';
                    break;
                default :
                    error = 'Something went wrong, try again later!'
                    break;
            }
            dispatch(setErrors(error));
        })

    } 
}

export function googleAuthInvitation(transId){
    return (dispatch) =>{
        dispatch(setLoadingTrue()); // dispatching an action to set lodaing to true
       myFirebase.auth().signInWithPopup(new myFirebase.auth.GoogleAuthProvider())
        .then(res =>{
            localStorage.setItem('userID', res.user.uid); // storing the userID in the localstorage
            res.user.getIdToken()
            .then( token =>{
                localStorage.setItem('FBIdToken',token); // storing the jwt in the localstorage

                axios.post(`/invite/${transId}`,null,{ // Adding the signed in user to the transaction
                    headers: {Authorization: 'Bearer '+ token}
                })
                .then(()=>{
                    axios.put(`/add-transaction-to-user/${transId}`,null,{
                        headers: {Authorization: 'Bearer ' + token}
                    })
                    .then(() =>{
                        window.location.href = '/transaction'; // redirecting to the transaction
                        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
                    })
                    .catch(err =>{
                        console.error(err);
                        dispatch(setErrors(err)); // dispatching an action to add the errors
                    })
                })
                .catch(err =>{
                    console.error(err);
                    dispatch(setErrors(err)); // dispatching an action to set the errors
                })
            })
            .catch(err =>{
                dispatch(setErrors(err));
            })
        })
        .catch(err =>{
            dispatch(setErrors(err)); // dispatching an action to set the error
        })
    }
}


export function facebookAuthInvitation(transId){
    return (dispatch) =>{
        dispatch(setLoadingTrue()); // dispatching an action to set lodaing to true
       myFirebase.auth().signInWithPopup(new myFirebase.auth.FacebookAuthProvider())
        .then(res =>{
            localStorage.setItem('userID', res.user.uid); // storing the userID in the localstorage
            res.user.getIdToken()
            .then( token =>{
                localStorage.setItem('FBIdToken',token); // storing the jwt in the localstorage

                axios.post(`/invite/${transId}`,null,{ // Adding the signed in user to the transaction
                    headers: {Authorization: 'Bearer '+ token}
                })
                .then(()=>{
                    axios.put(`/add-transaction-to-user/${transId}`,null,{
                        headers: {Authorization: 'Bearer ' + token}
                    })
                    .then(() =>{
                        window.location.href = '/transaction'; // redirecting to the transaction
                        dispatch(setLoadingFalse()); // dispatching an action to set loading to false
                    })
                    .catch(err =>{
                        console.error(err);
                        dispatch(setErrors(err)); // dispatching an action to add the errors
                    })
                })
                .catch(err =>{
                    console.error(err);
                    dispatch(setErrors(err)); // dispatching an action to set the errors
                })
            })
            .catch(err =>{
                dispatch(setErrors(err));
            })
        })
        .catch(err =>{
            dispatch(setErrors(err)); // dispatching an action to set the error
        })
    }
}


// pure reducer functions here
export function addUser(id,firstName,lastName,email,phone,role,state,transactions) { // User is added to the redux store
    return({
        type: ADD_USER,
        id: id,
        firstName,
        lastName,
        email,
        phone,
        role,
        state,
        transactions
    });
}

export function addTransactionUser(payload) {
    return({
        type: ADD_TRANSACTION_USER,
        payload
    });
}

export function editUser(firstName, lastName, email, role, phone, state) { // Editing the user 
    return({
        type: EDIT_USER,
        Name: firstName+" "+lastName,
        firstName,
        lastName,
        email,
        role,
        phone,
        state
    });
}
