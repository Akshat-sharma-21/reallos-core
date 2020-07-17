import React from "react";
import TransactionDashbaord from "./transaction_dashboard/TransactionDasboardComponent";
import TransactionAssist from "./transaction_assist/TransactionAssistComponent";
import PaperWork from "./paperwork/PaperWork";
import PaperworkViewer from "./paperwork/PaperworkViewer";
import HomePage from "./home/HomePage";
import PeopleInvolved from "./people_involved/PeopleInvolved";
import Todo from "./todo/TodoComponent";
import DiscussionsMain from "./discussions/DiscussionsMain/DiscussionsMain";
import Error404Component from "./404/Error404Component";
import EmailHandler from "./email-handlers/EmailHandlerComponent";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Auth from "./account/Authenticate";

const PrivateRoute = (
  { component: Component, ...rest } // Component that protects all the routing if the user is not autenticated
) => (
  <Route
    {...rest}
    render={(props) =>
      Auth.getAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);

function Main(props) {
  // All the routes must be configured here

  return (
    <div>
      <Switch>
        <Route path="/home" component={HomePage} />
        <PrivateRoute
          exact
          path="/transaction"
          component={TransactionDashbaord}
        />
        <Route path="/action" component={EmailHandler} />
        <PrivateRoute
          path="/transaction/:tid/assist"
          component={TransactionAssist}
        />
        <PrivateRoute
          path="/transaction/:tid/paperwork/*"
          component={PaperworkViewer}
        />
        <PrivateRoute
          path="/transaction/:tid/paperwork"
          component={PaperWork}
        />
        <PrivateRoute
          path="/transaction/:tid/people"
          component={PeopleInvolved}
        />
        <PrivateRoute path="/transaction/:tid/todo" component={Todo} />
        <PrivateRoute
          path="/transaction/:tid/discussions"
          component={DiscussionsMain}
        />
        {/* <Redirect path="/transaction/:tid" to="assist" /> */}
        <Redirect exact from="/" to="home" />
        <Route path="*" component={Error404Component} />
      </Switch>
    </div>
  );
}

export default withRouter(Main);
