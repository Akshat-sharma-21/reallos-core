import React from "react";
import "./Transaction.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import NewTransactionButton from "./NewTransactionButtonComponent";
import NavBar from "../shared/navbar/navbar";
import SearchBar from "../shared/searchbar/SearchBarComponent";
import TransactionCardGroup from "./TransactionCardGroup";
import MiniDrawer from "../shared/TransactionDrawerComponent";
/**
 * Renders transactions within Transaction Dashboard
 *
 * @param {*} transactions
 * Transaction Object
 */
function RenderTransactionBody({ transactions }) {
  if (transactions != null) {
    //If transactions exist
    return (
      <>
        <Grid container direction="row" justify="center" alignItems="center">
          <SearchBar />
        </Grid>
        <TransactionCardGroup />
      </>
    );
  } else {
    //If no transactions exist
    return (
      <>
        <Grid container direction="row" justify="center" alignItems="center">
          <img
            src={require("../../assets/transaction-empty.png")}
            alt=""
            className="no-transasction-default-img"
          />
        </Grid>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Box
              component="h2"
              className="header-transaction"
              style={{ marginBottom: "50px" }}
            >
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
      </>
    );
  }
}

function TransactionDasboard(props) {
  return (
    <Box component="div">
      <Container>
        <MiniDrawer />
        <NavBar />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          className="row-header"
        >
          <h2 className="header-transaction">My Transactions</h2>
        </Grid>
        <RenderTransactionBody transactions={props.transactions} />
        {/*props.transaction*/}
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
