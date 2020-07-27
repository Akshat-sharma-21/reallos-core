import {setLoadingTrue, setLoadingFalse, setErrors} from './utilsActions';
import {addUser} from './userActions';
import axios from 'axios';
import {myFirestore} from '../Config/MyFirebase'; // Importing the firestore

export const MODAL_OPEN = 'MODAL_OPEN';
export const MODAL_CLOSE = 'MODAL_CLOSE';

export function openAssistModal(user,transId){
    return (dispatch) =>{
        dispatch(setLoadingTrue());
        if(user.id === null){ // if the user is not stored in the redux store
           axios.get('/user-details',{
               headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
           })
           .then(res =>{
                dispatch(addUser( // dispatching an action to add the user to the redux store
                    localStorage.getItem('userID'),
                    res.data.firstName,
                    res.data.lastName,
                    res.data.email,
                    res.data.phone,
                    res.data.role,
                    res.data.state,
                    res.data.transaction
                ));
           })
           .catch(err =>{
               console.error(err);
               dispatch(setErrors(err));
           })
        }
        
        myFirestore.collection('transactions').doc(transId).get()
        .then(doc =>{
            if(doc.exists){
                if(doc.data().assistView.includes(localStorage.getItem('userID'))){ // if the transaction assist has already been seen by the user
                    dispatch(modalClose()); // dispatching an action to set the modal to closed
                }
                else{ // else let the modal be open
                    dispatch(modalOpen()); // dipatching an action to set the modal to open
                    
                    let assistViewArray = doc.data().assistView;
                    assistViewArray.push(localStorage.getItem('userID')); // pushing the user id in the array

                    myFirestore.collection('transactions').doc(transId).update({
                        assistView : assistViewArray
                    });

                }
                dispatch(setLoadingFalse()); // dispatching an action to set loading to false
            }
            else{
                console.error('Transaction not found'); // If the document doesn't exist in the database
                dispatch(setErrors('Transaction not found'));
            }
        })
        .catch(err =>{
            console.error(err);
            dispatch(setErrors(err));
        })
    }
}

// pure Reducer functions

export function modalOpen(){
    return ({
        type: MODAL_OPEN
    });
}

export function modalClose(){
    return ({
        type: MODAL_CLOSE
    });
}
