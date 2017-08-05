import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';
import { browserHistory, Link } from 'react-router';

// import PaymentPage from './Pay/PaymentPage.jsx';
import { Button } from 'semantic-ui-react';
import { Image } from 'semantic-ui-react';
import { Header } from 'semantic-ui-react';
import { Form, Checkbox } from 'semantic-ui-react';

import {StripeProvider} from 'react-stripe-elements';
import PaymentBox from './Pay/PaymentBox';
import AddPlanModal from './Pay/AddPlanModal';
import scriptLoader from 'react-async-script-loader';
import {Elements} from 'react-stripe-elements';
import PaymentArea from './Pay/PaymentArea';

// PaymentForm
import AddressSection from './Pay/AddressSection';
import CardSection from './Pay/CardSection';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {injectStripe} from 'react-stripe-elements';
import { Dropdown } from 'semantic-ui-react';

import validator from 'validator';

//Stepper
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';

import { Icon, Image as ImageComponent, Item, Label } from 'semantic-ui-react';

const createAccountMutation = gql`
  mutation createAccount($CompanyId: ID, $PlanId: ID, $stripeId: ID) {
    createAccount (input: {CompanyId: $CompanyId, PlanId: $PlanId, stripeId: $stripeId}) {
      stripe
      company{
        id
        name
      }
      plan{
        id
        name
        interval
      }
      success
      message
      field
    }
  }
`;

const submitStripeTokenMutation = gql`
  mutation submitStripeToken ($token: String) {
    submitStripeToken (input: {token: $token}) {
      success
      message
      field
    }
  }
`;


const RegisterNewUserMutation = gql`
  mutation registerNewUser ($username: String!, $password: String!, $email: String!, $PersonId: ID!) {
    register (username: $username, password: $password, email: $email, PersonId: $PersonId) {
      id
      username
      success
      message
      field
    }
  }
`;

const CreateNewPersonMutation = gql`
  mutation createPerson ($firstName: String!, $lastName: String!) {
    createPerson (input: {firstName: $firstName, lastName: $lastName}) {
      id
      firstName
      lastName
      success
      message
      field
    }
  }
`;

const CreateNewCompanyMutation = gql`
  mutation createCompany ($name: String!, $teamName: String!) {
    createCompany (input: {name: $name, teamName: $teamName}) {
      id
      name
      teamName
      success
      message
      field
    }
  }
`;

const CreateNewGroupMutation = gql`
  mutation createGroup ($type: String!, $name: String!, $CompanyId: ID!) {
    createGroup (input: {type: $type, name: $name, CompanyId: $CompanyId}) {
      id
      type
      name
      CompanyId
      success
      message
      field
    }
  }
`;

const AddToGroupMutation = gql`
  mutation addToGroup ($GroupId: ID!, $MemberId: ID!) {
    addToGroup (input: {GroupId: $GroupId, MemberId: $MemberId}) {
      success
      message
      field
    }
  }
`;

const CreateGroupPermissionsMutation = gql`
  mutation createPermission ($GroupId: ID!) {
    createPermission(input: {GroupId: $GroupId}) {
      id
      auth
      success
      message
      field
    }
  }
`;

//From PaymentArea
const stripeCreateCustomerMutation = gql`
  mutation stripeCreateCustomer($source: ID) {
    stripeCreateCustomer (input: {source: $source}) {
      stripe
      success
      message
      object
    }
  }
`;

const stripeCreateSubscriptionMutation = gql`
  mutation stripeCreateSubscription($customer: ID, $plan: ID, $coupon: ID) {
    stripeCreateSubscription (input: {customer: $customer, plan: $plan, coupon: $coupon}) {
      stripe
      success
      message
      object
    }
  }
`;

const getStripeCouponMutation = gql`
  mutation getStripeCoupon($coupon: String) {
    getStripeCoupon (coupon: $coupon) {
      stripe
      success
      message
      object
    }
  }
`;

// Live Validation
const IsUniqueUsernameMutation = gql`
  mutation isUniqueUsername($username: String!) {
    isUniqueUsername(username: $username)
  }
`;

const IsUniqueTeamNameMutation = gql`
  mutation isUniqueTeamName($teamName: String!) {
    isUniqueTeamName(teamName: $teamName)
  }
`;

const IsUniqueEmailMutation = gql`
  mutation isUniqueEmail($email: String) {
    isUniqueEmail(email: $email)
  }
`;

let displayErrorUser;
let displayErrorEmail;
let displayErrorPassword;
let displayErrorFirst;
let displayErrorLast;
let displayErrorCompany;
let displayErrorTeamName;
let errorStyles = {
  color: 'red'
};
const formStyle = {
  width: '100%'
}

class RegistrationPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.validating = this.validating.bind(this);
    this.selectPlan = this.selectPlan.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleTeamNameChange = this.handleTeamNameChange.bind(this);

    this.state = {
      disabled: false,
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      teamName: "",
      validating: false,
      field: "",
      error: null,
      loading: false,
      finished: false,
      stepIndex: 0,
      plan: '',
      billingType: '',
      starterColor: null,
      personalColor: null,
      professionalColor: null,
      enterpriseColor: null,
      total: '',
      agreeToTerms: false,
      couponInput: '',
      couponMessage: '',
      totalColor: "#00B1B3",
      couponToApply: null,
      buttonLoading: false,
    }


  }

  handleCheckboxChange = (e, { value }) => this.setState({ billingType: value })

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value
    });
    this.props.IsUniqueUsername({
      variables: {
        username: e.target.value
      }
    }).then(result => {
      if(result.data.isUniqueUsername === false && this.state.username === ""){
        this.setState({
          field: "",
          error: ""
        })
      } else if(result.data.isUniqueUsername === false){
        this.setState({
          field: "username",
          error: "Username already taken.",
          disabled: true
        })
      } else {
        this.setState({
          field: "",
          error: "",
          disabled: false
        })
      }
    })
  }

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value
    });
    this.props.IsUniqueEmail({
      variables: {
        email: e.target.value
      }
    }).then(result => {
      if(result.data.isUniqueEmail === false){
        this.setState({
          field: "email",
          error: "There is already a user associated with this email address.",
          disabled: true
        })
      } else {
        this.setState({
          field: "",
          error: "",
          disabled: false
        })
      }
    })
  }

  handleTeamNameChange = (e) => {
    this.setState({
      teamName: e.target.value
    });
    this.props.IsUniqueTeamName({
      variables: {
        teamName: e.target.value
      }
    }).then(result => {
      if(result.data.isUniqueTeamName === false){
        this.setState({
          field: "teamName",
          error: "Team name already taken.",
          disabled: true
        })
      } else {
        this.setState({
          field: "",
          error: "",
          disabled: false
        })
      }
    })
  }

  handleBlur = (e) => {
    switch(e.target.name){
      case "Username":
        this.setState({
          username: e.target.value
        });
        this.props.IsUniqueUsername({
          variables: {
            username: this.state.username
          }
        }).then(result =>{
          console.log('USERNAME RESULT', result)
          if(result.data.isUniqueUsername === false && this.state.username === ""){
            this.setState({
              field: "",
              error: ""
            })
          } else if(result.data.isUniqueUsername === false){
            this.setState({
              field: "username",
              error: "Username already taken.",
              disabled: true
            }, () => {console.log('USERNAME TAKEN', this.state)})
          } else {
            this.setState({
              field: "",
              error: "",
              disabled: false
            })
          }
        })
        break;
      case "Email":
        this.setState({
          email: e.target.value
        });
        this.props.IsUniqueEmail({
          variables: {
            email: this.state.email
          }
        }).then(result => {
          if(result.data.isUniqueEmail === false){
            this.setState({
              field: "email",
              error: "There is already a user associated with this email address.",
              disabled: true
            })
          } else {
            this.setState({
              field: "",
              error: "",
              disabled: false
            })
          }
        })
        break;
      case "TeamName":
        this.setState({
          teamName: e.target.value
        });
        this.props.IsUniqueTeamName({
          variables: {
            teamName: this.state.teamName
          }
        }).then(result => {
          if(result.data.isUniqueTeamName === false){
            this.setState({
              field: "teamName",
              error: "Team name already taken.",
              disabled: true
            })
          } else {
            this.setState({
              field: "",
              error: "",
              disabled: false
            })
          }
        })
        break;
      default:
    }
  }

 componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.initPaymentPage();
        console.log("STRIPE LOAD SUCCEEDED willRecieve");
      }
      else this.props.onError()
    }
  }
  componentDidMount () {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.initPaymentPage()
      console.log("STRIPE LOAD SUCCEEDED didMount");
    }
  }


  handleSubmit(acctData) {
    console.log("PASSED THROUGH DATA", acctData);
    // e.preventDefault();
    this.props.CreateNewPerson({
      variables: {
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }
    }).then((person) => {
      console.log('CREATE PERSON', person);
      if(person.data.createPerson.success === false){
        this.setState({
          field: person.data.createPerson.field,
          error: person.data.createPerson.message,
          stepIndex: 0
        })
      } else {
        this.props.RegisterNewUser({
          variables: {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            PersonId: person.data.createPerson.id
          }
        }).then((user) => {
          console.log('REGISTER USER', user);
          if(user.data.register.success === false){
            this.setState({
              field: user.data.register.field,
              error: user.data.register.message,
              stepIndex: 0
            })
          } else {
            this.props.CreateNewCompany({
              variables: {
                name: this.state.company,
                teamName: this.state.teamName
              }
            }).then((company) => {
              console.log('CREATE COMPANY', company);
              if(company.data.createCompany.success === false){
                this.setState({
                  field: company.data.createCompany.field,
                  error: company.data.createCompany.message,
                  stepIndex: 0
                })
              } else {
                this.props.CreateNewGroup({
                  variables: {
                    name: "SuperAdmin",
                    type: "User",
                    CompanyId: company.data.createCompany.id
                  }
                }).then((superAdminUserGroup) => {
                  console.log('CREATE SUPER ADMIN USER GROUP', superAdminUserGroup);
                  if(superAdminUserGroup.data.createGroup.success === false){
                    this.setState({
                      field: superAdminUserGroup.data.createGroup.field,
                      error: superAdminUserGroup.data.createGroup.message
                    })
                  } else {
                    this.props.AddToGroup({
                      variables: {
                        GroupId: superAdminUserGroup.data.createGroup.id,
                        MemberId: user.data.register.id
                      }
                    }).then((superAdminMember) => {
                      console.log('Add user to Company SuperAdmin group', superAdminMember);
                      if(superAdminMember.data.addToGroup.success === false){
                        this.setState({
                          field: superAdminMember.data.addToGroup.field,
                          error: superAdminMember.data.addToGroup.message
                        })
                      } else {
                        this.props.CreateGroupPermissions({
                          variables: {
                            GroupId: superAdminUserGroup.data.createGroup.id
                          }
                        }).then((superAdminPermissions) => {
                          console.log('CREATE SUPER ADMIN PERMISSIONS', superAdminPermissions);
                          if(superAdminPermissions.data.createPermission.success === false){
                            this.setState({
                              field: superAdminPermissions.data.createPermission.field,
                              error: superAdminPermissions.data.createPermission.message
                            })
                          } else {
                        this.props.CreateNewGroup({
                          variables: {
                            name: "Accounting",
                            type: "User",
                            CompanyId: company.data.createCompany.id
                          }
                        }).then((accountingUserGroup) => {
                          console.log('CREATE ACCOUNTING USER GROUP', accountingUserGroup);
                          if(accountingUserGroup.data.createGroup.success === false){
                            this.setState({
                              field: accountingUserGroup.data.createGroup.field,
                              error: accountingUserGroup.data.createGroup.message
                            })
                          } else {
                            // this.props.AddToGroup({
                            //   variables: {
                            //     GroupId: accountingUserGroup.data.createGroup.id,
                            //     MemberId: user.data.register.id
                            //   }
                            // }).then((accountingGroupMember) => {
                            //   console.log('ADD user to Company Accounting group');
                            //   if(accountingGroupMember.data.addToGroup.success === false){
                            //     this.setState({
                            //       field: accountingGroupMember.data.addToGroup.field,
                            //       error: accountingGroupMember.data.addToGroup.message
                            //     })
                            //   } else {
                            this.props.CreateGroupPermissions({
                              variables: {
                                GroupId: accountingUserGroup.data.createGroup.id
                              }
                            }).then((accountingPermissions) => {
                              console.log('Create Accounting Permissions', accountingPermissions);
                              if(accountingPermissions.data.createPermission.success === false){
                                this.setState({
                                  field: accountingPermissions.data.createPermission.field,
                                  error: accountingPermissions.data.createPermission.message
                                })
                              } else {
                                this.props.CreateNewGroup({
                                  variables: {
                                    name: "Purchasing",
                                    type: "User",
                                    CompanyId: company.data.createCompany.id
                                  }
                                }).then((purchasingGroup) => {
                                  console.log('CREATE PURCHASING USER GROUP', purchasingGroup);
                                  if(purchasingGroup.data.createGroup.success === false){
                                    this.setState({
                                      field: purchasingGroup.data.createGroup.field,
                                      error: purchasingGroup.data.createGroup.message
                                    })
                                  } else {
                                    this.props.CreateNewGroup({
                                      variables: {
                                        name: "Sales",
                                        type: "User",
                                        CompanyId: company.data.createCompany.id
                                      }
                                    }).then((salesUserGroup) => {
                                      console.log('CREATE SALES USER GROUP', salesUserGroup);
                                      if(salesUserGroup.data.createGroup.success === false){
                                        this.setState({
                                          field: salesUserGroup.data.createGroup.field,
                                          error: salesUserGroup.data.createGroup.message
                                        })
                                      } else {
                                        this.props.CreateNewGroup({
                                          variables: {
                                            name: "Customer",
                                            type: "User",
                                            CompanyId: company.data.createCompany.id
                                          }
                                        }).then((customerUserGroup) => {
                                          console.log('CREATE CUSTOMER USER GROUP', customerUserGroup);
                                          if(customerUserGroup.data.createGroup.success === false){
                                            this.setState({
                                              field: customerUserGroup.data.createGroup.field,
                                              error: customerUserGroup.data.createGroup.message
                                            })
                                          } else {
                                            this.props.CreateGroupPermissions({
                                              variables: {
                                                GroupId: customerUserGroup.data.createGroup.id
                                              }
                                            }).then((customerPermissions) => {
                                              console.log('Create customer Permissions', customerPermissions);
                                              if(customerPermissions.data.createPermission.success === false){
                                                this.setState({
                                                  field: customerPermissions.data.createPermission.field,
                                                  error: customerPermissions.data.createPermission.message
                                                })
                                              } else {
                                                this.props.CreateNewGroup({
                                                  variables: {
                                                    name: "Employee",
                                                    type: "User",
                                                    CompanyId: company.data.createCompany.id
                                                  }
                                                }).then((employeeUserGroup) => {
                                                  console.log('CREATE EMPLOYEE USER GROUP', employeeUserGroup);
                                                  if(employeeUserGroup.data.createGroup.success === false){
                                                    this.setState({
                                                      field: employeeUserGroup.data.createGroup.field,
                                                      error: employeeUserGroup.data.createGroup.message
                                                    })
                                                  } else {
                                                    this.props.CreateGroupPermissions({
                                                      variables: {
                                                        GroupId: employeeUserGroup.data.createGroup.id
                                                      }
                                                    }).then((employeePermissions) => {
                                                      console.log('CREATE EMPLOYEE PERMISSIONS', employeePermissions);
                                                      if(employeePermissions.data.createPermission.success === false){
                                                        this.setState({
                                                          field: employeePermissions.data.createPermission.field,
                                                          error: employeePermissions.data.createPermission.message
                                                        })
                                                      } else {
                                                        this.props.CreateNewGroup({
                                                          variables: {
                                                            name: "Subcontractor",
                                                            type: "User",
                                                            CompanyId: company.data.createCompany.id
                                                          }
                                                        }).then((subcontractorUserGroup) => {
                                                          console.log('CREATE SUBCONTRACTOR USER GROUP', subcontractorUserGroup);
                                                          if(subcontractorUserGroup.data.createGroup.success === false){
                                                            this.setState({
                                                              field: subcontractorUserGroup.data.createGroup.field,
                                                              error: subcontractorUserGroup.data.createGroup.message
                                                            })
                                                          } else {
                                                            this.props.CreateNewGroup({
                                                              variables: {
                                                                name: "Customer",
                                                                type: "Person",
                                                                CompanyId: company.data.createCompany.id
                                                              }
                                                            }).then((customerGroup) => {
                                                              console.log('CREATE CUSTOMER GROUP', customerGroup);
                                                              if(customerGroup.data.createGroup.success === false){
                                                                this.setState({
                                                                  field: customerGroup.data.createGroup.field,
                                                                  error: customerGroup.data.createGroup.message
                                                                })
                                                              } else {
                                                                this.props.CreateNewGroup({
                                                                  variables: {
                                                                    name: "Subcontractor",
                                                                    type: "Person",
                                                                    CompanyId: company.data.createCompany.id
                                                                  }
                                                                }).then((subcontractorGroup) => {
                                                                  console.log('CREATE SUBCONTRACTOR GROUP', subcontractorGroup);
                                                                  if(subcontractorGroup.data.createGroup.success === false){
                                                                    this.setState({
                                                                      field: subcontractorGroup.data.createGroup.field,
                                                                      error: subcontractorGroup.data.createGroup.message
                                                                    })
                                                                  } else {
                                                                    this.props.CreateNewGroup({
                                                                      variables: {
                                                                        name: "Sales",
                                                                        type: "Person",
                                                                        CompanyId: company.data.createCompany.id
                                                                      }
                                                                    }).then((salesGroup) => {
                                                                      console.log('CREATE SALES GROUP', salesGroup);
                                                                      if(salesGroup.data.createGroup.success === false){
                                                                        this.setState({
                                                                          field: salesGroup.data.createGroup.field,
                                                                          error: salesGroup.data.createGroup.message
                                                                        })
                                                                      } else {
                                                                        this.props.CreateNewGroup({
                                                                          variables: {
                                                                            name: "ProjectManager",
                                                                            type: "Person",
                                                                            CompanyId: company.data.createCompany.id
                                                                          }
                                                                        }).then((projectManagerGroup) => {
                                                                          console.log('CREATE PM GROUP', projectManagerGroup);
                                                                          if(projectManagerGroup.data.createGroup.success === false){
                                                                            this.setState({
                                                                              field: projectManagerGroup.data.createGroup.field,
                                                                              error: projectManagerGroup.data.createGroup.message
                                                                            })
                                                                          } else{
                                                                            this.props.CreateNewGroup({
                                                                              variables: {
                                                                                name: "Preview",
                                                                                type: "Person",
                                                                                CompanyId: company.data.createCompany.id
                                                                              }
                                                                            }).then((previewGroup) => {
                                                                              console.log('CREATE PREVIEW GROUP', previewGroup);
                                                                              if(previewGroup.data.createGroup.success === false){
                                                                                this.setState({
                                                                                  field: previewGroup.data.createGroup.field,
                                                                                  error: previewGroup.data.createGroup.message
                                                                                })
                                                                              } else {
                                                                                this.props.CreateNewGroup({
                                                                                  variables: {
                                                                                    name: "Designer",
                                                                                    type: "Person",
                                                                                    CompanyId: company.data.createCompany.id
                                                                                  }
                                                                                }).then((designerGroup) => {
                                                                                  console.log('CREATE DESIGNER GROUP', designerGroup);
                                                                                  if(designerGroup.data.createGroup.success === false){
                                                                                    this.setState({
                                                                                      field: designerGroup.data.createGroup.field,
                                                                                      error: designerGroup.data.createGroup.message
                                                                                    })
                                                                                  } else {
                                                                                    this.props.CreateNewGroup({
                                                                                      variables: {
                                                                                        name: "ElectricalEngineers",
                                                                                        type: "Person",
                                                                                        CompanyId: company.data.createCompany.id
                                                                                      }
                                                                                    }).then((electricalEngineerGroup) => {
                                                                                      console.log('CREATE ELECTRICAL ENGINEER GROUP', electricalEngineerGroup);
                                                                                      if(electricalEngineerGroup.data.createGroup.success === false){
                                                                                        this.setState({
                                                                                          field: electricalEngineerGroup.data.createGroup.field,
                                                                                          error: electricalEngineerGroup.data.createGroup.message
                                                                                        })
                                                                                      } else {
                                                                                        this.props.CreateNewGroup({
                                                                                          variables: {
                                                                                            name: "MechanicalEngineers",
                                                                                            type: "Person",
                                                                                            CompanyId: company.data.createCompany.id
                                                                                          }
                                                                                        }).then((mechanicalEngineerGroup) => {
                                                                                          console.log('CREATE MECHANICAL ENGINEER GROUP', mechanicalEngineerGroup);
                                                                                          if(mechanicalEngineerGroup.data.createGroup.success === false){
                                                                                            this.setState({
                                                                                              field: mechanicalEngineerGroup.data.createGroup.field,
                                                                                              error: mechanicalEngineerGroup.data.createGroup.message
                                                                                            })
                                                                                          } else {
                                                                                            this.props.CreateNewGroup({
                                                                                              variables: {
                                                                                                name: "StructuralEngineers",
                                                                                                type: "Person",
                                                                                                CompanyId: company.data.createCompany.id
                                                                                              }
                                                                                            }).then((structuralEngineerGroup) => {
                                                                                              console.log('CREATE STRUCTURAL ENGINEER GROUP', structuralEngineerGroup);
                                                                                              if(structuralEngineerGroup.data.createGroup.success === false){
                                                                                                this.setState({
                                                                                                  field: structuralEngineerGroup.data.createGroup.field,
                                                                                                  error: structuralEngineerGroup.data.createGroup.message
                                                                                                })
                                                                                              } else {
                                                                                                this.props.CreateNewGroup({
                                                                                                  variables: {
                                                                                                    name: "CivilEngineers",
                                                                                                    type: "Person",
                                                                                                    CompanyId: company.data.createCompany.id
                                                                                                  }
                                                                                                }).then((civilEngineerGroup) => {
                                                                                                  console.log('CREATE CIVIL ENGINEER GROUP', civilEngineerGroup);
                                                                                                  if(civilEngineerGroup.data.createGroup.success === false){
                                                                                                    this.setState({
                                                                                                      field: civilEngineerGroup.data.createGroup.field,
                                                                                                      error: civilEngineerGroup.data.createGroup.message
                                                                                                    })
                                                                                                  } else {
                                                                                                    this.props.CreateNewGroup({
                                                                                                      variables: {
                                                                                                        name: "ElectricalEngineersTPR",
                                                                                                        type: "Person",
                                                                                                        CompanyId: company.data.createCompany.id
                                                                                                      }
                                                                                                    }).then((electricalEngineerTPRGroup) => {
                                                                                                      console.log('CREATE ELECTRICAL ENGINEER TPR GROUP', electricalEngineerTPRGroup);
                                                                                                      if(electricalEngineerTPRGroup.data.createGroup.success === false){
                                                                                                        this.setState({
                                                                                                          field: electricalEngineerTPRGroup.data.createGroup.field,
                                                                                                          error: electricalEngineerTPRGroup.data.createGroup.message
                                                                                                        })
                                                                                                      } else {
                                                                                                        this.props.CreateNewGroup({
                                                                                                          variables: {
                                                                                                            name: "MechanicalEngineersTPR",
                                                                                                            type: "Person",
                                                                                                            CompanyId: company.data.createCompany.id
                                                                                                          }
                                                                                                        }).then((mechanicalEngineerTPRGroup) => {
                                                                                                          console.log('CREATE MECHANICAL ENGINEER TPR GROUP', mechanicalEngineerTPRGroup);
                                                                                                          if(mechanicalEngineerTPRGroup.data.createGroup.success === false){
                                                                                                            this.setState({
                                                                                                              field: mechanicalEngineerTPRGroup.data.createGroup.field,
                                                                                                              error: mechanicalEngineerTPRGroup.data.createGroup.message
                                                                                                            })
                                                                                                          } else {
                                                                                                            this.props.CreateNewGroup({
                                                                                                              variables: {
                                                                                                                name: "StructuralEngineersTPR",
                                                                                                                type: "Person",
                                                                                                                CompanyId: company.data.createCompany.id
                                                                                                              }
                                                                                                            }).then((structuralEngineerTPRGroup) => {
                                                                                                              console.log('CREATE STRUCTURAL ENGINEER TPR GROUP', structuralEngineerTPRGroup);
                                                                                                              if(structuralEngineerTPRGroup.data.createGroup.success === false){
                                                                                                                this.setState({
                                                                                                                  field: structuralEngineerTPRGroup.data.createGroup.field,
                                                                                                                  error: structuralEngineerTPRGroup.data.createGroup.message
                                                                                                                })
                                                                                                              } else {
                                                                                                                this.props.CreateNewGroup({
                                                                                                                  variables: {
                                                                                                                    name: "CivilEngineersTPR",
                                                                                                                    type: "Person",
                                                                                                                    CompanyId: company.data.createCompany.id
                                                                                                                  }
                                                                                                                }).then((civilEngineerTPRGroup) => {
                                                                                                                  console.log('CREATE CIVIL ENGINEER TPR GROUP', civilEngineerTPRGroup);
                                                                                                                  if(civilEngineerTPRGroup.data.createGroup.success === false){
                                                                                                                    this.setState({
                                                                                                                      field: civilEngineerTPRGroup.data.createGroup.field,
                                                                                                                      error: civilEngineerTPRGroup.data.createGroup.message
                                                                                                                    })
                                                                                                                  } else {
                                                                                                                    this.props.CreateNewGroup({
                                                                                                                      variables: {
                                                                                                                        name: "Permitting",
                                                                                                                        type: "Person",
                                                                                                                        CompanyId: company.data.createCompany.id
                                                                                                                      }
                                                                                                                    }).then((permittingGroup) => {
                                                                                                                      console.log('CREATE PERMITTING GROUP', permittingGroup);
                                                                                                                      if(permittingGroup.data.createGroup.success === false){
                                                                                                                        this.setState({
                                                                                                                          field: permittingGroup.data.createGroup.field,
                                                                                                                          error: permittingGroup.data.createGroup.message
                                                                                                                        })
                                                                                                                      } else {
                                                                                                                        this.props.CreateNewGroup({
                                                                                                                          variables: {
                                                                                                                            name: "Utility",
                                                                                                                            type: "Person",
                                                                                                                            CompanyId: company.data.createCompany.id
                                                                                                                          }
                                                                                                                        }).then((utilityGroup) => {
                                                                                                                          console.log('CREATE UTILITY GROUP', utilityGroup);
                                                                                                                          if(utilityGroup.data.createGroup.success === false){
                                                                                                                            this.setState({
                                                                                                                              field: utilityGroup.data.createGroup.field,
                                                                                                                              error: utilityGroup.data.createGroup.message
                                                                                                                            })
                                                                                                                          } else {
                                                                                                                            this.props.CreateNewGroup({
                                                                                                                              variables: {
                                                                                                                                name: "ConstructionCrew",
                                                                                                                                type: "Person",
                                                                                                                                CompanyId: company.data.createCompany.id
                                                                                                                              }
                                                                                                                            }).then((constructionCrewGroup) => {
                                                                                                                              console.log('CREATE CONSTRUCTION CREW GROUP', constructionCrewGroup);
                                                                                                                              if(constructionCrewGroup.data.createGroup.success === false){
                                                                                                                                this.setState({
                                                                                                                                  field: constructionCrewGroup.data.createGroup.field,
                                                                                                                                  error: constructionCrewGroup.data.createGroup.message
                                                                                                                                })
                                                                                                                              } else {
                                                                                                                                this.props.CreateNewGroup({
                                                                                                                                  variables: {
                                                                                                                                    name: "Electricians",
                                                                                                                                    type: "Person",
                                                                                                                                    CompanyId: company.data.createCompany.id
                                                                                                                                  }
                                                                                                                                }).then((electricianGroup) => {
                                                                                                                                  console.log('CREATE ELECTRICIAN GROUP', electricianGroup);
                                                                                                                                  if(electricianGroup.data.createGroup.success === false){
                                                                                                                                    this.setState({
                                                                                                                                      field: electricianGroup.data.createGroup.field,
                                                                                                                                      error: electricianGroup.data.createGroup.message
                                                                                                                                    })
                                                                                                                                  } else {
                                                                                                                                    this.props.CreateNewGroup({
                                                                                                                                      variables: {
                                                                                                                                        name: "Plumbers",
                                                                                                                                        type: "Person",
                                                                                                                                        CompanyId: company.data.createCompany.id
                                                                                                                                      }
                                                                                                                                    }).then((plumberGroup) => {
                                                                                                                                      console.log('CREATE PLUMBER GROUP', plumberGroup);
                                                                                                                                      if(plumberGroup.data.createGroup.success === false){
                                                                                                                                        this.setState({
                                                                                                                                          field: plumberGroup.data.createGroup.field,
                                                                                                                                          error: plumberGroup.data.createGroup.message
                                                                                                                                        })
                                                                                                                                      } else {
                                                                                                                                        this.props.CreateNewGroup({
                                                                                                                                          variables: {
                                                                                                                                            name: "Inspectors",
                                                                                                                                            type: "Person",
                                                                                                                                            CompanyId: company.data.createCompany.id
                                                                                                                                          }
                                                                                                                                        }).then((inspectorGroup) => {
                                                                                                                                          console.log('CREATE INSPECTOR GROUP', inspectorGroup);
                                                                                                                                          if(inspectorGroup.data.createGroup.success === false){
                                                                                                                                            this.setState({
                                                                                                                                              field: inspectorGroup.data.createGroup.field,
                                                                                                                                              error: inspectorGroup.data.createGroup.message
                                                                                                                                            })
                                                                                                                                          } else {
                                                                                                                                            this.props.CreateNewGroup({
                                                                                                                                              variables: {
                                                                                                                                                name: "Accountant",
                                                                                                                                                type: "Person",
                                                                                                                                                CompanyId: company.data.createCompany.id
                                                                                                                                              }
                                                                                                                                            }).then((accountantGroup) => {
                                                                                                                                              console.log('CREATE ACCOUNTANT GROUP', accountantGroup);
                                                                                                                                              if(accountantGroup.data.createGroup.success === false){
                                                                                                                                                this.setState({
                                                                                                                                                  field: accountantGroup.data.createGroup.field,
                                                                                                                                                  error: accountantGroup.data.createGroup.message
                                                                                                                                                })
                                                                                                                                              } else {
                                                                                                                                                this.props.CreateNewGroup({
                                                                                                                                                  variables: {
                                                                                                                                                    name: "Manager",
                                                                                                                                                    type: "Person",
                                                                                                                                                    CompanyId: company.data.createCompany.id
                                                                                                                                                  }
                                                                                                                                                }).then((managerGroup) => {
                                                                                                                                                  console.log('CREATE MANAGER GROUP', managerGroup);
                                                                                                                                                  if(managerGroup.data.createGroup.success === false){
                                                                                                                                                    this.setState({
                                                                                                                                                      field: managerGroup.data.createGroup.field,
                                                                                                                                                      error: managerGroup.data.createGroup.message
                                                                                                                                                    })
                                                                                                                                                  } else {
                                                                                                                                                    this.props.CreateNewGroup({
                                                                                                                                                      variables: {
                                                                                                                                                        name: "Employee",
                                                                                                                                                        type: "Person",
                                                                                                                                                        CompanyId: company.data.createCompany.id
                                                                                                                                                      }
                                                                                                                                                    }).then((employeeGroup) => {
                                                                                                                                                      console.log('CREATE EMPLOYEE GROUP', employeeGroup);
                                                                                                                                                      if(employeeGroup.data.createGroup.success === false){
                                                                                                                                                        this.setState({
                                                                                                                                                          field: employeeGroup.data.createGroup.field,
                                                                                                                                                          error: employeeGroup.data.createGroup.message
                                                                                                                                                        })
                                                                                                                                                      } else {
                                                                                                                                                        this.props.AddToGroup({
                                                                                                                                                          variables: {
                                                                                                                                                            GroupId: employeeGroup.data.createGroup.id,
                                                                                                                                                            MemberId: person.data.createPerson.id
                                                                                                                                                          }
                                                                                                                                                        }).then((employeeMember) => {
                                                                                                                                                          console.log('Add user to Company Employee group', employeeMember);
                                                                                                                                                          if(employeeMember.data.addToGroup.success === false){
                                                                                                                                                            this.setState({
                                                                                                                                                              field: employeeMember.data.addToGroup.field,
                                                                                                                                                              error: employeeMember.data.addToGroup.message
                                                                                                                                                            })
                                                                                                                                                          } else {
                                                                                                                                                            this.props.CreateAccount({
                                                                                                                                                              variables: {
                                                                                                                                                                CompanyId: company.data.createCompany.id,
                                                                                                                                                                PlanId: acctData.planId,
                                                                                                                                                                stripeId: acctData.customerId
                                                                                                                                                              }
                                                                                                                                                            }).then((account)=>{
                                                                                                                                                              browserHistory.push('/verify');
                                                                                                                                                              console.log("NEWACCOUNT IS", account);
                                                                                                                                                            })
                                                                                                                                                          }
                                                                                                                                                        })
                                                                                                                                                      }
                                                                                                                                                    })
                                                                                                                                                  }
                                                                                                                                                })
                                                                                                                                                }
                                                                                                                                              })
                                                                                                                                            }
                                                                                                                                          })
                                                                                                                                        }
                                                                                                                                      })
                                                                                                                                    }
                                                                                                                                  })
                                                                                                                                }
                                                                                                                              })
                                                                                                                            }
                                                                                                                          })
                                                                                                                        }
                                                                                                                      })
                                                                                                                    }
                                                                                                                  })
                                                                                                                }
                                                                                                              })
                                                                                                            }
                                                                                                          })
                                                                                                        }
                                                                                                      })
                                                                                                    }
                                                                                                  })
                                                                                                }
                                                                                              })
                                                                                            }
                                                                                          })
                                                                                        }
                                                                                      })
                                                                                    }
                                                                                  })
                                                                                }
                                                                              })
                                                                            }
                                                                          })
                                                                        }
                                                                      })
                                                                    }
                                                                  })
                                                                }
                                                              })
                                                            }
                                                          })
                                                        }
                                                      })
                                                    }
                                                  })
                                                }
                                              })
                                            }
                                          })
                                        }
                                      })
                                    }
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
  }

  validating() {
    this.setState({validating: true});
  }

  renderPasswordConfirmError() {
    if(this.state.validating && this.state.password !== this.state.confirmPassword){
      return <div style={{color:'red'}}>Passwords do not match.</div>
    }
    return null;
  }

  selectPlan(plan){
    console.log("PLANSELECTED", plan);
    this.setState({plan: plan}, this.selectColor(plan))
  }

  selectColor(plan){
    this.setState({
      starterColor: plan+"Color" === "starterColor" ? "#c7d7d9" : null,
      personalColor: plan+"Color" === "personalColor" ? "#c7d7d9" : null,
      professionalColor: plan+"Color" === "professionalColor" ? "#c7d7d9" : null,
      enterpriseColor: plan+"Color" === "enterpriseColor" ? "#c7d7d9" : null,
    });
  }

  handleSave = (ev) => {

  console.log("stripe is", this.props.stripe);

  this.setState({ buttonLoading: true })
  function stripePlanId(name, interval){
    switch((name+interval).toLowerCase()){
        // test plan
        case "startermonthly":
            return "1000-101";
        case "starterannual":
            return "1000-201";
        // livemode plans
        case "personalmonthly":
            return "1002";
        case "personalannual":
            return "1003";
        case "professionalmonthly":
            return "2002";
        case "professionalannual":
            return "2003";
        case "enterprisemonthly":
            return "2000-101";
        case "enterpriseannual":
            return "2000-201";
        default:
            return null;
    }
  }
    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken().then(({token}) => {
      console.log('Received Stripe token:', token);
      if(token){
        this.props.CreateCustomer({
          variables: {
            source: token.id
          }
        }).then((data) => {
          console.log("STRIPEDATA", data);
          let acctData = {customerId: data.data.stripeCreateCustomer.stripe.id, planId: stripePlanId(this.state.plan, this.state.billingType)};
          let subscriptionVars = {
            customer: data.data.stripeCreateCustomer.stripe.id,
            plan: stripePlanId(this.state.plan, this.state.billingType),
          }
          if(this.state.couponToApply){
            subscriptionVars.coupon = this.state.couponToApply;
          }
          console.log("SUBSCRIPTIONVARS", subscriptionVars);
          this.props.CreateSubscription({
            variables: subscriptionVars
          }).then((subscription)=>{
            console.log("STRIPESUBSCRIPTION", subscription);
            if(subscription.data.stripeCreateSubscription.success){
              return acctData;
            }
          })
          .then((val) => {
            this.handleSubmit(val);
          });
          console.log("MUTATION RESULT", data);
        })
      }
    })

  }

  dummyAsync = (cb) => {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex + 1,
        finished: stepIndex >= 2,
      }));
    }
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: stepIndex - 1,
      }));
    }
  };

  toggleCheckbox(key) {
    const nextKeyState = !this.state.agreeToTerms;
    console.log("Toggling checkbox value! ", nextKeyState);
    this.setState({agreeToTerms: nextKeyState})
  }

  handleCouponSubmit() {
    this.props.GetCoupon({
      variables: {
        coupon: this.state.couponInput
      }
    }).then((res)=>{
      if(res.data.getStripeCoupon.stripe){
        console.log("RES IS", res, res.data.getStripeCoupon.stripe.redeem_by, (Date.now())/1000);
        if(res.data.getStripeCoupon.stripe.redeem_by > (Date.now())/1000){
          let totalSplit = this.state.total.split('/');
          let newTotal = parseFloat(totalSplit[0].replace('$',''));
          let couponDisplay;
          if(res.data.getStripeCoupon.stripe.percent_off){
            newTotal = (Math.floor((newTotal * ((100-res.data.getStripeCoupon.stripe.percent_off)/100))*100))/100;
            couponDisplay = '(' + res.data.getStripeCoupon.stripe.percent_off + '% OFF)';
          }
          if(res.data.getStripeCoupon.stripe.amount_off){
            newTotal = newTotal - (res.data.getStripeCoupon.stripe.amount_off/100);
            couponDisplay = '($' + res.data.getStripeCoupon.stripe.amount_off/100 + ' OFF)';
          }
          newTotal = '$' + newTotal + '/' + totalSplit[1];
          this.setState({total: newTotal, couponMessage: "Discount Applied " + couponDisplay, couponToApply: this.state.couponInput, totalColor: "red", couponDetails: `"LAUNCH" ` + "(50% Off for 1 Year)" });
        } else {
          this.setState({couponMessage: "Coupon Expired"});
        }
      } else {
        this.setState({couponMessage: "Invalid Coupon"});
      }

    })


  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
        <div className="row">
          <h4 style={{ textAlign: "center", color: "#00B1B3" }}>
            Thank you for choosing Ryion. Please fill out the information below to begin your 30 DAY FREE Trial.
          </h4>
            <div className="" id="registerAdminPageId">
              <div className="login-header row">
                <div className="col-sm-12">
                  <h3 className="registerPageHeader">Register with Ryion</h3>
                </div>
              </div>

              <form onSubmit={(e)=>this.handleSave(e)}>

                <div className="row">
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor="Username">Username*</label>
                    <input
                      className='form-control'
                      name='Username'
                      type='text'
                      autoFocus='true'
                      placeholder='Username'
                      value={this.state.username}
                      onBlur={this.handleBlur}
                      onChange={(e) => {!validator.matches(e.target.value, /^[\w-]{3,12}$/) ? this.setState({field: "username", error: "Username must be 3-12 characters. Hyphens and underscores allowed.", username: e.target.value}) : this.handleUsernameChange(e) }}
                      title="Username must be 3-12 characters. Hyphens and underscores allowed."
                      pattern="^[\w-]{3,12}$"
                      required
                    />
                    {displayErrorUser}
                  </div>

                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='Email'>Email*</label>
                    <input
                      className='form-control'
                      name='Email'
                      type='email'
                      placeholder='Email'
                      value={this.state.email}
                      onBlur={this.handleBlur}
                      onChange={(e) => {!validator.isEmail(e.target.value) ? this.setState({field: "email", error: "Enter a valid email.", email: e.target.value}) : this.handleEmailChange(e) }}
                      required
                    />
                    {displayErrorEmail}
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='firstName'>First Name*</label>
                    <input
                      className='form-control'
                      name='firstName'
                      type='text'
                      placeholder='First Name'
                      value={this.state.firstName}
                      title="Letters Only"
                      pattern="^[a-zA-Z-]+$"
                      onChange={(e) => this.setState({firstName: e.target.value})}
                      required
                    />
                    {displayErrorFirst}
                  </div>
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='lastName'>Last Name*</label>
                    <input
                      className='form-control'
                      name='lastName'
                      type='text'
                      placeholder='Last Name'
                      title="Letters Only"
                      pattern="^[a-zA-Z.]+$"
                      value={this.state.lastName}
                      onChange={(e) => this.setState({lastName: e.target.value})}
                      required
                    />
                    {displayErrorLast}
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='Password'>Password*</label>
                    <input
                      className='form-control'
                      name='Password'
                      type='password'
                      placeholder='Password'
                      value={this.state.password}
                      onChange={(e) => {!validator.matches(e.target.value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*_-]).{8,25}$/) ? this.setState({field: "password", error: "Password must be 8-25 characters and include one upper and lowercase letter, a number and a special character (#?!@$%^&*_-).", password: e.target.value}) : this.setState({field: "", error: "", password: e.target.value}) }}
                      title="Password must be 8-25 characters and include one upper and lowercase letter, a number and a special character (#?!@$%^&*_-)."
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*_-]).{8,25}$"
                      required
                    />
                    {displayErrorPassword}
                  </div>

                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='confirmPassword'>Confirm Password*</label>
                    <input
                      name='confirmPassword'
                      type='password'
                      placeholder='Confirm Password'
                      className='form-control'
                      onBlur={this.validating}
                      value={this.state.confirmPassword}
                      onChange={(e) => this.setState({confirmPassword: e.target.value})}
                      required
                    />
                    {this.renderPasswordConfirmError()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='company'>Company*</label>
                    <input
                      className='form-control'
                      name='company'
                      type='text'
                      placeholder='Company'
                      title="Letters and Numbers Only"
                      pattern="^([A-Za-z0-9]+ ?)*$"
                      value={this.state.company}
                      onChange={(e) => {!validator.matches(e.target.value, /^([A-Za-z0-9]+ ?)*$/) ? this.setState({field: "company", error: "Letters and numbers only", company: e.target.value}) : this.setState({field: "", error: "", company: e.target.value}) }}
                      required
                    />
                    {displayErrorCompany}
                  </div>
                  <div className="col-sm-6 registerInputs">
                    <label className="stripelabel" htmlFor='teamName'>Team Name*</label>
                    <input
                      className='form-control'
                      name='TeamName'
                      type='text'
                      placeholder='Team Name'
                      title="Letters Only"
                      pattern="^[a-zA-Z]+$"
                      value={this.state.teamName}
                      onBlur={this.handleBlur}
                      onChange={(e) => {!validator.matches(e.target.value, /^[a-zA-Z]+$/) ? this.setState({field: "teamName", error: "Letters Only", teamName: e.target.value}) : this.handleTeamNameChange(e) }}
                      required
                    />
                    {displayErrorTeamName}
                  </div>
                  <div className="col-sm-6">
                    <Link to={'/login'}>
                      <h4 style={{ color: "#00b1b3", marginLeft: "10px", marginTop: "20px" }}>or click here to login</h4>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
        </div>
        );
      case 1:
        return (
          <div>
            <h4 style={{ textAlign: "center", color: "#00B1B3" }}>
              {"Select your plan below"}
            </h4>
            <div className="row">
                <div className="whole col-lg-4 col-md-12 col-sm-12">
                    <div className="type simple">
                    <p>Starter</p>
                    </div>
                  <div className="plan">

                    <div className="header">
                      <span>$</span>99.<sup>99</sup>/Monthly<br />
                      <span>$</span>999.<sup>99</sup>/Annual
                      {/* <p className="month">$999.99/Annual</p> */}
                    </div>
                    <div className="content">
                      <ul className="pricingul">
                        <li className="pricingli">3 Leads</li>
                        <li className="pricingli">3 Projects</li>
                        <li className="pricingli">3 Team Members</li>
                        <li className="pricingli">3 Customer Users</li>
                        <li className="pricingli">3 Sub Contractor Users</li>
                      </ul>
                    </div>
                    <div className="price" >
                      {/* <a href="#" className="bottom"><p className="cart">Select</p></a> */}
                      <Button.Group>
                        <Button color="blue" onClick={(e, data) => {
                          this.setState({ plan: 'Starter', billingType: 'Monthly', total: '$99.99/Monthly'})
                        }}>Monthly</Button>
                        <Button.Or />
                        <Button color="teal" onClick={(e, data) => {
                          this.setState({ plan: 'Starter', billingType: 'Annual', total: '$999.99/Annual'})
                        }}>Annual</Button>
                      </Button.Group>
                    </div>
                  </div>
                </div>

                <div className="whole col-lg-4 col-md-12 col-sm-12">
                		<div className="type standard">
                		<p>Professional</p>
                		</div>
                	<div className="plan">

                		<div className="header">
                      <span>$</span>799.<sup>99</sup>/Monthly<br />
                      <span>$</span>7,999.<sup>99</sup>/Annual
                      {/* <p className="month">$7,999.99/Annual</p> */}
                		</div>
                		<div className="content">
                			<ul className="pricingul">
                				<li className="pricingli">1500 Leads</li>
                				<li className="pricingli">500 Projects</li>
                				<li className="pricingli">30 Team Members</li>
                				<li className="pricingli">2500 Customer Users</li>
                				<li className="pricingli">1000 Sub Contractor Users</li>
                			</ul>
                		</div>
                		<div className="price">
                			{/* <a href="#" className="bottom"><p className="cart">Select</p></a> */}
                      <Button.Group>
                        <Button color="blue" onClick={(e, data) => {
                          this.setState({ plan: 'Professional', billingType: 'Monthly', total: '$799.99/Monthly'})
                        }}>Monthly</Button>
                        <Button.Or />
                        <Button color="teal" onClick={(e, data) => {
                          this.setState({ plan: 'Professional', billingType: 'Annual', total: '$7,999.99/Annual'})
                        }}>Annual</Button>
                      </Button.Group>
                		</div>
                	</div>
                </div>

              	<div className="whole col-lg-4 col-md-12 col-sm-12">
              		<div className="type ultimate">
              		<p>Enterprise</p>
              		</div>
              	<div className="plan">

              		<div className="header">
                      <span>$</span>1,499.<sup>99</sup>/Monthly<br />
                      <span>$</span>14,999.<sup>99</sup>/Annual
                      {/* <p className="month">$14,999.99/Annual</p> */}
              		</div>
              		<div className="content">
              			<ul className="pricingul">
                				<li className="pricingli">Unlimited Leads</li>
                				<li className="pricingli">UnlimitedProjects</li>
                				<li className="pricingli">Unlimited Members</li>
                				<li className="pricingli">Unlimited Customer Users</li>
                				<li className="pricingli">Unlimited Sub Contractor Users</li>
              			</ul>
              		</div>
              		<div className="price">
                    {/* <a href="#" className="bottom"><p className="cart">Select</p></a> */}
                      <Button.Group>
                        <Button color="blue" onClick={(e, data) => {
                          this.setState({ plan: 'Enterprise', billingType: 'Monthly', total: '$1,499.99/Monthly'})
                        }}>Monthly</Button>
                        <Button.Or />
                        <Button color="teal" onClick={(e, data) => {
                          this.setState({ plan: 'Enterprise', billingType: 'Annual', total: '$14,999.99/Annual'})
                        }}>Annual</Button>
                      </Button.Group>
              		</div>
              	</div>
              </div>

            </div>
            <h3 style={{ textAlign: "center", color: "#00B1B3" }}>Your plan: {this.state.plan ? this.state.plan + " " + this.state.total + " (First 30 days free) " : " "}</h3>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ textAlign: "center", color: "#00B1B3" }}>
              Enter your payment information below. You will not be charged until your free trial is over. Start using Ryion risk-free today and cancel anytime.
            </h3>
            <div className="row">
                <h3 style={{  color: "#00B1B3" }}>Plan: {this.state.plan ? this.state.plan : ''}</h3>
                <h3 style={{  color: "#00B1B3" }}>Free Trial: 30 Days Free</h3>
                <h3 style={{  color: "#00B1B3" }}>Discount Code: {this.state.couponDetails ? this.state.couponDetails : ''}</h3>
                <h3 style={{  color: this.state.totalColor }}>Total Billed After Free Trial: {this.state.total ? this.state.total : ''}</h3>
                <CardSection plan={this.state.plan} billingType={this.state.billingType} />
            </div>

            <div className="row">
              <div className="col-sm-3">
                <label htmlFor="Discount Code">Discount Code</label>
                <input
                  className='form-control'
                  name='Discount Code'
                  type='text'
                  autoFocus='true'
                  placeholder=''
                  value={this.state.couponInput}
                  onChange={(e) => this.setState({couponInput: e.target.value})}
                />
                <h4 style={{ color: "red" }}>{this.state.couponMessage}</h4>
              </div>
              <div className="couponSubmit">
                <Button color="teal" content='ENTER'  onClick={(e, data) => { this.handleCouponSubmit()}} />
              </div>

            </div>

            <div className="termsConfirmation">

              {/* <Link style={{ color: "#00b1b3"}} to={'/policies/terms'} target="_blank">
                <h4 style={{ color: "#00b1b3"}}>Click here to view our terms and conditions</h4>
              </Link> */}

              <div className="ui checkbox">
                <input id={this.state.agreeToTerms} checked={ this.state.agreeToTerms} type="checkbox" onChange={() => { this.toggleCheckbox('agreeToTerms') }}/>

                <label style={{ lineHeight: 1, color: "#00b1b3" }} htmlFor={this.state.agreeToTerms}><Link style={{ color: "#00b1b3"}} to={'/policies/terms'} target="_blank">I agree to the Terms and Conditions, Privacy Policy and Subscriber Agreements</Link></label>
              </div>
            </div>
          </div>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Click here
            </a> to reset the process.
          </p>
        </div>
      );
    }

    let BackButton;
    if(stepIndex === 0) {
      BackButton = ""
    } else {
        BackButton = <Button disabled={stepIndex === 0} color="grey" content={'BACK'}  onClick={(e, data) => { this.handlePrev()}} />
    }

    let loaderButton;
    if(this.state.buttonLoading) {
      loaderButton = <Button
        loading
        color="teal"
        content={stepIndex === 2 ? 'START YOUR FREE TRIAL NOW' : 'NEXT'}
        onClick={(e, data) => { stepIndex === 2 ? this.handleSave() : this.handleNext()}}
        disabled={this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "" || this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" || this.state.company === "" || this.state.teamName === "" || this.state.field !== "" || this.state.disabled === true ? true : this.state.plan === '' && stepIndex === 1 || this.state.validating && this.state.password !== this.state.confirmPassword ? true : false || stepIndex === 2 && !this.state.agreeToTerms ? true : false}

      />
    } else {
      loaderButton = <Button
        color="teal"
        content={stepIndex === 2 ? 'START YOUR FREE TRIAL NOW' : 'NEXT'}
        onClick={(e, data) => { stepIndex === 2 ? this.handleSave() : this.handleNext()}}
        disabled={this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "" || this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" || this.state.company === "" || this.state.teamName === "" || this.state.field !== "" || this.state.disabled === true ? true : this.state.plan === '' && stepIndex === 1 || this.state.validating && this.state.password !== this.state.confirmPassword ? true : false || stepIndex === 2 && !this.state.agreeToTerms ? true : false}

      />
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          {/* <RaisedButton
            labelColor={"#fff"}
            backgroundColor={" #00B1B3"}
            label={stepIndex === 2 ? 'Start Your Free Trial Now' : 'Next'}
            // disabled={this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "" || this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" || this.state.company === "" ? true : this.state.plan === '' && stepIndex === 1 || this.state.validating && this.state.password !== this.state.confirmPassword ? true : false || stepIndex === 2 && !this.state.agreeToTerms ? true : false}
            onTouchTap={stepIndex === 2 ? this.handleSave : this.handleNext}
          /> */}
          {/* <Button
            color="teal"
            content={stepIndex === 2 ? 'START YOUR FREE TRIAL NOW' : 'NEXT'}
            onClick={(e, data) => { stepIndex === 2 ? this.handleSave() : this.handleNext()}}
            disabled={this.state.username === "" || this.state.password === "" || this.state.confirmPassword === "" || this.state.email === "" || this.state.firstName === "" || this.state.lastName === "" || this.state.company === "" ? true : this.state.plan === '' && stepIndex === 1 || this.state.validating && this.state.password !== this.state.confirmPassword ? true : false || stepIndex === 2 && !this.state.agreeToTerms ? true : false}

          /> */}
          {loaderButton}
          {BackButton}

        </div>
      </div>
    );
  }

  render(){
    console.log("Plan ", this.state.plan)
    console.log("Billing Type ", this.state.billingType)
    console.log("Total ", this.state.total)
    switch(this.state.field){
      case "username":
        displayErrorUser = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "email":
        displayErrorEmail = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "password":
        displayErrorPassword = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "firstName":
        displayErrorFirst = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "lastName":
        displayErrorLast = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "company":
        displayErrorCompany = <div style={errorStyles}>{this.state.error}</div>;
        break;
      case "teamName":
        displayErrorTeamName = <div style={errorStyles}>{this.state.error}</div>;
      default:
        displayErrorUser = null;
        displayErrorEmail = null;
        displayErrorPassword = null;
        displayErrorFirst = null;
        displayErrorLast = null;
        displayErrorCompany = null;
        displayErrorTeamName = null;
    }

    //PaymentForm
    const formStyle2 = {
      width: '100%'
    }

    const {loading, stepIndex} = this.state;

    return (
    <div className="row">

      <div className="newCompanyRegisterContainer" style={{width: '100%', maxWidth: 800, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Register</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select Plan</StepLabel>
          </Step>
          <Step>
            <StepLabel>Pay</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>


    </div>
    )
  };
}

const RegistrationPageWithMutation = compose(
  graphql(RegisterNewUserMutation, { name: "RegisterNewUser" }),
  graphql(CreateNewPersonMutation, { name: "CreateNewPerson" }),
  graphql(CreateNewCompanyMutation, { name: "CreateNewCompany" }),
  graphql(CreateNewGroupMutation, { name: "CreateNewGroup" }),
  graphql(AddToGroupMutation, { name: "AddToGroup" }),
  graphql(CreateGroupPermissionsMutation, { name: "CreateGroupPermissions" }),
  graphql(submitStripeTokenMutation),
  graphql(stripeCreateCustomerMutation, {name: "CreateCustomer"}),
  graphql(stripeCreateSubscriptionMutation, {name: "CreateSubscription"}),
  graphql(createAccountMutation, {name: "CreateAccount"}),
  graphql(IsUniqueUsernameMutation, { name: "IsUniqueUsername" }),
  graphql(IsUniqueTeamNameMutation, { name: "IsUniqueTeamName" }),
  graphql(IsUniqueEmailMutation, { name: "IsUniqueEmail" }),
  graphql(getStripeCouponMutation, {name: "GetCoupon"}),
  )(withRouter(RegistrationPage));

export default injectStripe(RegistrationPageWithMutation);
