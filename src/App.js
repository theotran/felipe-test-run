import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory} from 'react-router';
import { graphql, compose } from 'react-apollo';
import client from './index.js';
import gql from 'graphql-tag';
// import jwt from 'jsonwebtoken';
function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        };

import Dashboard from './components/Dashboard';
import SideNav from './components/SideNav';
import TopNav from './components/TopNav';
import TopBar from './components/TopBar';

//REACT MATERIAL UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  cyan500, grey300, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

//Customer
import CustomerTable from './components/Person/CustomerTable';
import PersonTable from './components/Person/PersonTable';
import PersonPageWithQuery from './components/Person/PersonPage';
import PersonEdit from './components/Person/PersonEdit';
import PersonUserAcct from './components/Person/PersonUserAcct';

// Employee
import EmployeeEdit from './components/Person/EmployeeEdit';
import EmployeeNotes from './components/Person/EmployeeNotes';

// ADMIN - USER
import UserEdit from './components/Admin/UserEdit';

//Job
import JobTable from './components/Job/JobTable';
import JobPageWithQuery from './components/Job/JobPage';

//Job/Site
import SiteTab from './components/Job/Site/SiteTab';

//Job/Quote
import QuoteTab from './components/Job/Quote/QuoteTab';

//Job/System
import SystemTab from './components/Job/System/SystemTab';

//Job/Construction
import ConstructionTab from './components/Job/Construction/ConstructionTab';

//Job/Contract
import ContractTab from './components/Job/Contract/ContractTab';

//Job/Equipment
import { InvertersWithQuery, ModulesWithQuery, EquipmentOptimizers, EquipmentCombiners, EquipmentPanelboards, EquipmentDisconnects, EquipmentMeters } from './components/Equipment/EquipmentComponents';


//Job/Permitting
import PermittingTab from './components/Job/Permitting/PermittingTab';

//Job/Electrical
import ElectricalTab from './components/Job/Electrical/ElectricalTab';
// Login Page
import LoginPage from './components/Login';
// Password Reset
import IdentifyPage from './components/Reset/Identify';
import ResetPasswordPage from './components/Reset/ResetPassword';

// Registration Page
import RegistrationPage from './components/Register';

// Accept Invitation Page
import AcceptInvitationPage from './components/AcceptInvitation';

// Verification
import VerifySent from './components/Verify/VerifySent';
import VerifyConfirm from './components/Verify/VerifyConfirm';
import VerifyInvite from './components/Verify/InviteSent';

import DesignTabContainer from './components/Job/Design/DesignTabContainer';
import DesignInfo from './components/Job/Design/DesignInfo';

//Job/Utility
import UtilityTab from './components/Job/Utility/UtilityTab';

//Job/ChangeOrder
import ChangeOrderTab from './components/Job/ChangeOrder/ChangeOrderTab';

// Job/Preview
import PreviewTab from './components/Job/Preview/PreviewTab';
import AccountingTab from './components/Job/Accounting/AccountingTab';

import Timesheet from './components/Admin/Timesheet';
import AdminTabs from './components/Admin/AdminTabs';
import GroupsTab from './components/Admin/Groups/GroupsTab';
import PermissionsTabWithQuery from './components/Admin/Permissions/PermissionsTab';
import AccountTabWithMutations from './components/Admin/Account/AccountTab';
import BillingInfo from './components/Admin/Account/BillingInfo';
//Action Items/Task List
import ActionItemList from './components/ActionItems/ActionItemList';
//Stripe Payment
import PaymentPage from './components/Pay/PaymentPage';
// import MapComponent from './components/Map';
import UtilityPage from './components/UtilityPage';
// import AccountingPage from './components/AccountingPage';
import EquipmentPage from './components/Equipment/EquipmentPage';
import LinksPage from './components/LinksPage';
// import CalendarPage from './components/CalendarPage';
// import StatisticsPage from './components/StatisticsPage';
import SupportPage from './components/SupportPage';
import ErrorPage from './components/ErrorPage';
import UnderConstructionPage from './components/UnderConstruction';

import PoliciesPage from './components/Policies/PoliciesPage';

//USER
import UserPanelPage from './components/User/UserPanelPage';


// AUTHORIZATION AND CONDITIONAL RENDERING
import Authorization from './components/Authorization';

//STRIPE
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';

import MediaQueryable from 'react-media-queryable';

// turns off semantic-ui debugging in console
localStorage.setItem('debug', null);


const formStyle = {
  width: '100%'
}

const RegistrationPageWithStripeProvider = () => (
  <StripeProvider apiKey="pk_test_0KsddA5DIdYOuDzZ4id12DOi" style={formStyle}>
    <Elements style={formStyle}>
      <RegistrationPage />
    </Elements>
  </StripeProvider>
)

const AccountTabWithStripeProvider = () => (
  <StripeProvider apiKey="pk_test_0KsddA5DIdYOuDzZ4id12DOi" style={formStyle}>
    <Elements style={formStyle}>
      <AccountTabWithMutations />
    </Elements>
  </StripeProvider>
)

// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  fontFamily: 'Heebo, sans-serif',
  palette: {
      primary1Color: "#00b1b3",
      primary2Color: "#00B1B3",
      primary3Color: "#612A60",
      accent1Color: "#00B1B3",
      accent2Color: "#E2ECEB",
      accent3Color: grey500,
      textColor: darkBlack,
      alternateTextColor: white,
      canvasColor: white,
      borderColor: grey300,
      pickerHeaderColor: cyan500,
      shadowColor: fullBlack,
  },
  appBar: {
    height: 50,
  },
});


const Footer = () => (
  <div className="row">
   <footer className="main-footer">
     <div className="pull-right hidden-xs version">
       V1.12
     </div>
     <span className="copyright">Copyright &copy; Square Whale, Inc. All rights Reserved</span>
   </footer>
  </div>
)

import { Container } from './containers';

const LandingContainer = (props) => (
  <div>
    <TopBar />
    <section className="contentRyion landingBackground">
      {/* <Image src='/images/RYION_UI_RegisterAdminBG.png' fluid /> */}
      <div className="row">
        <div className="col-md-12">
            {props.children}
        </div>
      </div>
    </section>
    <Footer />
  </div>
)
const PoliciesContainer = (props) => (
  <div>
    <TopBar />
    <section className="contentRyion">
      {/* <Image src='/images/RYION_UI_RegisterAdminBG.png' fluid /> */}
      <div className="row">
        <div className="col-md-12">
            {props.children}
        </div>
      </div>
    </section>
    <Footer />
  </div>
)

const LoginContainer = (props) => (
  <div>
    {props.children}
  </div>
)

let mediaQueries = {
  small: "(max-width: 694px)",
  large: "(min-width: 695px)"
};




//Parent components must render their "props.children" for the child routes to show
class App extends Component {


  render() {

    // CUSTOM
    // const Subcontractor = Authorization(['SuperAdmin']);
    // const Purchasing = Authorization(['SuperAdmin', ]);
    // const Sales = Authorization(['SuperAdmin']);
    // const Customer = Authorization(['SuperAdmin']);

    // const formStyle = {
    //   width: '100%'
    // }

    return (

      <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={browserHistory}>

          <Route path="/" component={Container} >
            <Route path="commercial" component={JobPageWithQuery}>
              <IndexRoute component={ConstructionTab} />
            </Route>
            <Route path="projects" component={JobTable}>
              <IndexRoute component={JobTable} />
            </Route>
            <Route path="task-list" component={ActionItemList} />
            <Route path="commercial/project/" component={JobPageWithQuery}>
              <IndexRoute component={SiteTab} />
            </Route>
            <Route path='*' component={ErrorPage} />
          </Route>
        </Router>
      </MuiThemeProvider>
    )
  }
}



export default App;
