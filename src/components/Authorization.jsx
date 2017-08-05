
import React, { Component } from 'react';
import decode from 'jwt-decode';

// AUTH HOC
const Authorization = (allowedRoles) =>
  (WrappedComponent) => {
    return class WithAuthorization extends Component {
      constructor(props) {
        super(props)

        let token = localStorage.getItem('ryionAuthToken');
        let data = decode(token);

        console.log('DECODED TOKEN', data);

        // LOAD USER AND PASS AS PROPS
        this.state = {
          role: data.roles
        }
      }
      render() {
        const role = this.state.role
        console.log('ROLES IN STATE', role);
        for(let x = 0; x < role.length; x++){
          if(allowedRoles.includes(role[x])) {
            return <WrappedComponent {...this.props} />
            break;
          }
        }
        return <h1>NOT PERMITTED</h1>
      }
    }
}

export default Authorization;
