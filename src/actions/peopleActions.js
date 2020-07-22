import axios from 'axios'; 
import {setLoadingTrue, setLoadingFalse, setErrors} from './utilsActions';
import {addUser} from './userActions';

export const ADD_PEOPLE = 'ADD_PEOPLE';
export const DELETE_PEOPLE = 'DELETE_PEOPLE';
export const CLEAR_PEOPLE = 'CLEAR_PEOPLE';


export function getAllPeople(id,user){
    return (dispatch) => {
        dispatch(clearPeople()); // dispatching an action to clear the people
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true

        if(user === null){ // if the user isn't available
            axios.get(`/user-details`,{
                headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
            })
            .then(res =>{
                dispatch(addUser( // dispatching an action to add the user to the redux store
                    res.data.id,
                    res.data.firstName,
                    res.data.lastName,
                    res.data.email,
                    res.data.phone,
                    res.data.role,
                    res.data.state,
                    res.data.transaction
                ))
            })
            .catch(err =>{
                console.error(err);
                dispatch(setErrors(err));
            })
        }

        axios.get(`/get-all-people/${id}`,{
            headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
        }) 
        .then( res => {
            res.data.peopleList.map( person =>{
                dispatch(addPeople(
                    person.accepted,
                    person.email,
                    person.name,
                    person.role,
                    person.uid
                ))
            })
            dispatch(setLoadingFalse());
        })
        .catch(err => {
            console.error(err);
            dispatch(setErrors());
        })
    }
}

export function addPerson(id,newPerson){ // adding a new person to the redux store
    return (dispatch)=>{
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true
        axios.post(`/add-people/${id}`,newPerson,{
            headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
        })
        .then( res =>{
            dispatch(addPeople(
                newPerson.accepted,
                newPerson.email,
                newPerson.name,
                newPerson.role
            ))
            dispatch(setLoadingFalse()); //disaptching an action to set loading to false
        })
        .catch(err =>{
            console.error(err);
            dispatch(setErrors(err)); // dispatching an action to set the errors
        })
    }
}

export function deletePeople(id,email){
    return (dispatch)=>{
        dispatch(setLoadingTrue()); // dispatching an action to set loading to true
        axios.delete(`/delete-people/${id}/${email}`,{
            headers: {Authorization: 'Bearer '+localStorage.getItem('FBIdToken')}
        })
        .then(()=>{
            dispatch(deleteFromStore(email)); // dispatchig an action to remove the person from the store
            dispatch(setLoadingFalse()); // dispatching an action to set loading to false
        })
        .catch(err =>{
            console.error(err);
            dispatch(setErrors(err)); // dispatching an action to set the errors
        })
    }
}



// pure reducer functions
export function addPeople(accepted, email, name, role, uid){
    return({
        type: ADD_PEOPLE,
        accepted: accepted, 
        email: email,
        name: name,
        role: role,
        uid: uid
    });
}

export function deleteFromStore(email){
    return({
        type: DELETE_PEOPLE,
        email: email
    })
}

export function clearPeople(){
    return({
        type: CLEAR_PEOPLE
    });
}
