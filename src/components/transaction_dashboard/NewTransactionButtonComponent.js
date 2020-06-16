import React from 'react';
import './Transaction.css';
import Button from '@material-ui/core/Button';
//Have to add a modal for the new tranaction here itself

function NewTransactionButton(props){
    return(
        <>
        <Button variant="outlined" className="button-transaction" size="large">+  New Transaction</Button>
        </>
    );
}

export default NewTransactionButton;