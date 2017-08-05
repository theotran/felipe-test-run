
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

const FindAccountMutation = gql`
  mutation findAccount($email: String!) {
    findAccount (email: $email) {
      success
      message
      field
      token
    }
  }
`;

class IdentifyPage extends Component {
  constructor(props){
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this);
    this.tryNew = this.tryNew.bind(this);

    this.state = {
      email: "",
      field: "",
      sent: false,
      error: null
    };
  }

  tryNew = () => {
    this.setState({
      sent: false
    })
  }

  handleSubmit = (e) => {

    this.props.mutate({
      variables: {
        email: this.state.email
      }
    }).then(value => {
      if(value.data.findAccount.success === false){
        this.setState({
          field: value.data.findAccount.field,
          error: value.data.findAccount.message
        })
      } else {
        this.setState({
          sent: true,
          field: "",
          error: null
        })
      }
    })
    e.preventDefault
  }

  render() {
    let sendResetHeader;
    let sendReset;
    let sendResetButton;
    let errorEmail;
    let errorStyles = {
      color: 'red'
    };

    switch(this.state.field){
      case "email":
        errorEmail = <div style={errorStyles}>{this.state.error}</div>;
        break;
      default:
        errorEmail = null;
    }

    if(this.state.sent === false){
      sendResetHeader = <CardHeader
                          title="Find Your Account"
                          titleStyle={{fontSize: '25px', marginLeft: 90, marginTop: 25}}
                        />;

      sendReset = <div className="row">
                    <p>Enter an email address:</p>
                    <CardText>
                      <div className="form-group col-md-12">
                        <input
                          autoFocus={true}
                          name='Email'
                          type='email'
                          className="form-control"
                          value={this.state.email}
                          placeholder='Email'
                          onChange={(e) => this.setState({email: e.target.value})}
                          required
                        />
                        {errorEmail}
                      </div>
                    </CardText>
                  </div>;

      sendResetButton = <CardActions>
                          <RaisedButton
                            backgroundColor={"#00B1B3"}
                            labelColor={"#fff"}
                            label="Submit"
                            onTouchTap={this.handleSubmit}
                            disabled={this.state.email === "" ? true : false}
                          />
                        </CardActions>;

    } else if(this.state.sent === true){
      sendResetHeader = <CardHeader
                          title="We just emailed you a link!"
                          titleStyle={{fontSize: '25px', marginLeft: 90, marginTop: 25}}
                        />;

      sendReset = <div className="row">
                    <CardText>
                      <div className="form-group col-md-12">
                        <p>If you do not see our email, try checking your spam folder.</p>
                        <span><a style={{color: 'black'}} href="/login">Login Page</a></span>
                      </div>
                    </CardText>
                  </div>;

      sendResetButton = <CardActions>
                          <RaisedButton
                            backgroundColor={"#00B1B3"}
                            labelColor={"#fff"}
                            label="Try different email"
                            onTouchTap={this.tryNew}
                          />
                        </CardActions>;
    }

    return (
      <div className="panel panel-default" style={{width: '33%', margin: 'auto', marginTop: '5%'}}>
        <div className="panel-body">
          <div>
            <Card style={{textAlign: 'center', height: 250}}>

              {sendResetHeader}
              {sendReset}
              {sendResetButton}

            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const IdentifyPageWithMutation = graphql(FindAccountMutation)(IdentifyPage);

export default IdentifyPageWithMutation;
