export const FETCH_TRANSACTION = 'FETCH_TRANSACTION'; // fetching the transaction for the user
export const ADD_TRANSACTION = 'ADD_TRANSACTION'; // Adding the transaction to the reducer
export const SET_ACTIVE_TRANSACTION = 'SET_ACTIVE_TRANSACTION' // Setting the active transaction which will be used to fetch data fro other functionalities

let id = 0; // to mimic the assignment of a primary key by the database

export function fetchTransaction(userId){ // This is where an asynchronous call will be made to fetch the transactions from the database
    return({
        type: FETCH_TRANSACTION,
        userId
    });
}

export function addTransaction(Name, Address, Description){
    id++;
    return({
        type: ADD_TRANSACTION,
        id: id,
        Name: Name,
        Address: Address,
        Description: Description
    })
}

export function setActiveTransaction(transId){
    return({
        type: SET_ACTIVE_TRANSACTION,
        transId
    });
}