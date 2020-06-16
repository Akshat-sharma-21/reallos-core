import React from 'react';
import './Transaction.css';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import NewTransactionButton from './NewTransactionButtonComponent';
import TranactionEmptyIllustration from '../../assets/transaction-empty.png';
import './Transaction.css';

function RenderTransactionBody({transactions}){ //Rendering the transaction page here
    if(transactions!=null){ //If transactions exist
        return(
            <>
            </>
        );
    }
    else{ //If no transactions exist
        return(
            <div id="transaction-dashboard-container">
                <Grid container direction="row" justify="center" alignItems="center">
                    <img src={TranactionEmptyIllustration} alt="" className="no-transasction-default-img"/>
                </Grid>
                <Grid container direction="column" justify="flex-start" alignItems="center"> 
                    <Grid item>
                        <Box component="h2" className="header-transaction">
                            Feels empty here...
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box component="p" m={-2} className="body-text">
                        Seems like you have not made any transactions.
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box component="p" className="body-text">
                        Click <strong>"New Transaction"</strong> to add a new transaction.
                        </Box>
                    </Grid>
                </Grid>   
            </div>
        );
    }
}


function TransactionDasboard(props){
    return(
        <Box component="body">
            <Container>
                <Grid container direction="row" justify="center" alignitems="center">
                    {/* Nav bar goes here*/}
                </Grid>
                <Grid container direction="row" justify="start" alignItems="center" className="row-header">
                    <h2 className="header-transaction">My Transaction</h2>
                </Grid>
                <RenderTransactionBody transactions={props.transactions} />
                <Grid container direction="row" justify="flex-end" alignitems="center">
                <Box component="div" m={-2}>
                    <NewTransactionButton />
                </Box>
                </Grid>
            </Container>
        </Box>
    );
}

export default TransactionDasboard;