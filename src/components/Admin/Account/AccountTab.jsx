import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { browserHistory } from 'react-router';
import CreditCardComponent from './CreditCardComponent';
import CreditCardDropdown from './CreditCardDropdown';
import AddOnArea from './AddOnArea';
import { Button } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {injectStripe, CardElement, PostalCodeElement} from 'react-stripe-elements';

import { Container, Header } from 'semantic-ui-react'
import { Statistic, Divider } from 'semantic-ui-react'

import { Menu } from 'semantic-ui-react'

import ChangePlanModal from './ChangePlanPage';

class AccountTab extends Component {
  constructor(props) {
    super(props);

    this.toggleCardInfo = this.toggleCardInfo.bind(this);
    this.createToken = this.createToken.bind(this);
    this.selectCard = this.selectCard.bind(this);

    this.state = {
      ccOpen: false,
      ccId: '',
      action: '',
      activeItem: 'plan'
    };
  }
  toggleCardInfo(e, action){
    e.preventDefault();
    console.log(action);
    this.setState({ccOpen:!this.state.ccOpen, action: action});
  }
  selectCard(id){
    console.log("changeCard", this.state.ccId, id);
    this.setState({ccId: id})
  }
  createToken(){
    // console.log("create token stripe", stripe);
    switch(this.state.action){
      case 'add':
        return this.props.stripe.createToken().then(({token}) => {
          console.log(token);
          this.props.CreateSource({
            variables: {
              token : token.id
            },
            refetchQueries: [{query: getStripeCustomer}]
          }).then((res)=>{
            console.log(res);
            this.setState({ccOpen: false});
          });
        });
        break;
      case 'edit':
        console.log(this.state.ccId);
        return this.props.SetDefault({
          variables: {
            default_source: this.state.ccId
          },
          // refetchQueries: [{query: getStripeCustomer, variables: {id: this.props.data.company.account.stripe.id}}]
        }).then((res)=>{
          console.log(res);
          this.setState({ccOpen: false});
        })
        break;
      case 'remove':
        return this.props.DeleteCard({
          variables: {
            id: this.state.ccId
          },
          refetchQueries: [{query: getStripeCustomer}]
        }).then((res)=>{
          console.log(res);
          this.setState({ccOpen: false});
        })
        break;
      default:
        break;
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    console.log(this.props);
    const { ccOpen, ccId, action } = this.state;
    let ccInfo = null;
    let ccSelect = null;
    let buttons = null;
    if(this.props.data.loading){
      return <div>Loading</div>;
    }
    if(this.props.data.error){
      return <div>Error</div>;
    }

    if(!ccOpen){
      ccInfo = null;
      ccSelect = <CreditCardDropdown stripeCustomer={this.props.data.company.account.stripe} onSelect={this.selectCard}/>;
      buttons = (() => {
        return(
        <div className="row">
          <Button color="teal" content='ADD' icon='plus'  labelPosition='left' onClick={(e, data) => { this.toggleCardInfo(e, "add") }}/>
          <Button color="blue" content='DEFAULT' icon='edit' labelPosition='left' onClick={(e, data) => { this.toggleCardInfo(e, "edit") }}/>
          <Button color="red" content='REMOVE' icon='remove' labelPosition='left' onClick={(e, data) => { this.toggleCardInfo(e, "remove") }}/>
        </div>
        )
      })();
    } else {
      ccInfo = <CardElement/>

      let ccLabel;
      let ccBackgroundColor;
      switch(this.state.action){
        case 'add':
          ccLabel = "Submit"
          ccSelect = null;
          break;
        case 'edit':
          ccInfo = null;
          ccLabel = "Set Default";
          ccSelect = <div className="form-group col-md-6">Confirm new default card.</div>
          break;
        case 'remove':
          ccInfo = null;
          ccLabel = "Delete"
          ccSelect = <div className="form-group col-md-6">Are you sure you want to delete this card?</div>
          break;
        default:
          break;
      }
      buttons = (() => {
        return(
          <div className="row">
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={(e, data) => { this.toggleCardInfo(e) }}
            />
            <RaisedButton
              backgroundColor={"#00B1B3"}
              labelColor={"#fff"}
              label={ccLabel}
              onTouchTap={(e, data) => { this.createToken() }}
            />
          </div>
        )
      })();
    }

    const items = [
      { label: 'Team Users', value: this.props.data.company.account.teamUsers + "/" + this.props.data.company.account.plan.teamUsers },
      { label: 'Customer Users', value: this.props.data.company.account.customerUsers + "/" + this.props.data.company.account.plan.customerUsers  },
      { label: 'Subcontractor Users', value: this.props.data.company.account.subUsers + "/" + this.props.data.company.account.plan.subUsers  },
      { label: 'Leads', value: this.props.data.company.account.leads + "/" + this.props.data.company.account.plan.leads  },
      { label: 'Projects', value: this.props.data.company.account.projects + "/" + this.props.data.company.account.plan.projects  },
      { label: 'File Storage (GB)', value: this.props.data.company.account.dataUsage + "/" + this.props.data.company.account.plan.dataUsageGB  },
      { label: 'Unstamped SLDs', value: this.props.data.company.account.nonStampSLDUsed + "/" + this.props.data.company.account.nonStampSLD  },
      { label: 'Unstamped SLD Rev', value: this.props.data.company.account.nonStampRevUsed + "/" + this.props.data.company.account.nonStampRev  },
      { label: 'SLDs', value: this.props.data.company.account.stampSLDUsed + "/" + this.props.data.company.account.stampSLD  },
      { label: 'SLD Rev', value: this.props.data.company.account.stampRevUsed + "/" + this.props.data.company.account.stampRev  },
    ]
    if(this.props.data.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
        );
    }

    if(this.props.data.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    let upgradeUpsell;

    if(this.props.data.company.account.plan.name === 'Starter') {
      upgradeUpsell = <Container textAlign="center">
        <Header as="h3" color="teal">{"You are currently on the " + this.props.data.company.account.plan.name + " plan. "}</Header>
        <ChangePlanModal />
        <Header centered as="h3" >{"Upgrade to Professional and get: "}</Header>
    		<div className="content">
    			<ul className="pricingul">
    				<li className="pricingli upsellListItems">1500 Leads</li>
    				<li className="pricingli upsellListItems">500 Projects</li>
    				<li className="pricingli upsellListItems">30 Team Members</li>
    				<li className="pricingli upsellListItems">2500 Customer Users</li>
    				<li className="pricingli upsellListItems">1000 Sub Contractor Users</li>
    			</ul>
    		</div>
      </Container>

    }
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">Plan Info</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Account_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <div className="row usageContainer">
            <Container>
              <Header as='h3'>Usage</Header>
              <Statistic.Group items={items} color='teal' />
            </Container>
          </div>
          <Divider section />
          <div className="row">
            {upgradeUpsell}
          </div>
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">Payment & Billing</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Account_Icon.svg' height="35" width="50"/>
            </div>
          </div>
          <form onSubmit={this.createToken}>
            <div className="row">
              {ccInfo}
              {ccSelect}
              {buttons}
            </div>
          </form>

        </div>
      </div>
    );
  }
}

const getStripeCustomer = gql`
  query {
    company{
      id
      account {
        id
        stripe
        leads
        projects
        teamUsers
        customerUsers
        subUsers
        dataUsage
        nonStampSLDUsed
        nonStampSLD
        nonStampRevUsed
        nonStampRev
        stampSLDUsed
        stampSLD
        stampRevUsed
        stampRev
        plan{
          id
          name
          interval
          amount
          leads
          projects
          teamUsers
          customerUsers
          subUsers
          dataUsageGB
          hasBOM
          hasTimeTracker
          hasProjectPL
          hasActionItems
          hasEquipPDF
          hasInventory
          hasProposalTool
          hasActionItems
          hasESign
          hasAvl
          hasCustomPricing
          hasEquipDXF
          hasOnboarding
          hasPortal
          hasQuickbooks
          hasEmailSupport
          hasPhoneSupport
          hasPrivateDB
          hasConcierge
          stripeId
        }
      }
    }
  }
`;

const createSourceMutation = gql`
  mutation createSource($token: ID) {
    stripeCreateSource (token: $token) {
      stripe
      success
      message
      object
    }
  }
`;

const deleteCardMutation = gql`
  mutation deleteCard($id: ID) {
    stripeDeleteCard (input:{id: $id}) {
      stripe
      success
      message
      object
    }
  }
`;

const stripeUpdateCustomerMutation = gql`
  mutation updateCustomer($default_source: ID) {
    stripeUpdateCustomer (input:{default_source: $default_source}) {
      stripe
      success
      message
      object
    }
  }
`;

const AccountTabWithData = compose(
  graphql(getStripeCustomer),
  graphql(createSourceMutation, {name: "CreateSource"}),
  graphql(deleteCardMutation, {name: "DeleteCard"}),
  graphql(stripeUpdateCustomerMutation, {name: "SetDefault"}),
)(AccountTab);

export default injectStripe(AccountTabWithData)
