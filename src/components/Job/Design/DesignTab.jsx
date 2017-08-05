import React, {Component} from 'react';
import DesignInfo from './DesignInfo';

import MenuItem from 'material-ui/MenuItem';
import { Dropdown } from 'semantic-ui-react';
import AddDesignModal from './AddDesignModal';
import client from './../../../index.js';
import gql from 'graphql-tag';
import GetJobQuery from '../../../queries/GetJobQuery';
import update from 'immutability-helper';

let cachedJobQuery;

const UpdateDesignMutation = gql`
  mutation updateDesign( $id: ID!, $JobId: ID!, $type: String, $status: String, $DesignerId: ID, $startDate: DateTime, $asBuiltCompleteDate: DateTime, $ifcBuildCompleteDate: DateTime) {
    updateDesign(input: { id: $id, JobId: $JobId, type: $type, status: $status, DesignerId: $DesignerId, startDate: $startDate, asBuiltCompleteDate: $asBuiltCompleteDate, ifcBuildCompleteDate: $ifcBuildCompleteDate}) {
      id
      type
      designer {
        id
        firstName
        lastName
      }
      status
      startDate
      ifcBuildCompleteDate
      asBuiltCompleteDate
      notes {
        id
        text
        type
      }
    }
  }
`;

const UpdateEngineeringMutation = gql`
  mutation updateEngineering( $id: ID, $DesignId: ID, $isTPR: Boolean, $EngineerId: ID, $sentDate: DateTime, $dueDate: DateTime, $status: String, $receivedDate: DateTime, $completedDate: DateTime ) {
    updateEngineering(input: { id: $id, DesignId: $DesignId, isTPR: $isTPR, EngineerId: $EngineerId, sentDate: $sentDate, dueDate: $dueDate, status: $status, receivedDate: $receivedDate, completedDate: $completedDate}) {
      id
      type
      isTPR
      engineer {
        id
      }
      sentDate
      dueDate
      receivedDate
      completedDate
      status
    }
  }
`;

const UpdateReviewMutation = gql`
  mutation updateReview( $id: ID, $startDate: DateTime, $endDate: DateTime, $status: String, $isTPR: Boolean, $ReviewerId: ID ) {
    updateReview(input: {id: $id, startDate: $startDate, endDate: $endDate, status: $status, isTPR: $isTPR, ReviewerId: $ReviewerId}) {
      id
      type
      createdAt
      startDate
      endDate
      status
      isTPR
      reviewer {
        id
        firstName
        lastName
      }
    }
  }
`;

class DesignTab extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEngineeringChange = this.handleEngineeringChange.bind(this);
    this.handleReviewChange = this.handleReviewChange.bind(this);

    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      designNumber: this.props.job.designs[0] ? 0 : null,
      designs: this.props.job.designs ? this.props.job.designs : [],
      selected: this.props.job.designs[0] ? this.props.job.designs[0].id : '',
      design: this.props.job.designs[0] ? this.props.job.designs[0] : {}
    }
  }

  handleChange(key, value) {
    let newData = update(this.state, {
      design: { [key]: { $set: value } },
      designs: { [this.state.designNumber] : { [key] : { $set: value } } }
    });
    //triggering these elements by default because they're not actual onBlur inputs, this is how we invoke handleBlur on whatever action it was
    this.setState(newData, () => {
      if(key === 'startDate' || key === 'ifcBuildCompleteDate' || key === 'asBuiltCompleteDate' || key === 'designer' || key === 'inHouseApprovedBy' || key === 'designer' || key === 'status'){
        this.handleBlur(this.state.design);
      }
    })
  }

  handleBlur(design) {
    console.log("Design Tab handleBlur", this);
    console.log("Design tab", design)
    this.setState({design: design});
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    if(cachedJobQuery.job.designs[this.state.designNumber].type !== design.type || cachedJobQuery.job.designs[this.state.designNumber].status !== design.status || cachedJobQuery.job.designs[this.state.designNumber].designer !== design.designer || cachedJobQuery.job.designs[this.state.designNumber].startDate !== design.startDate || cachedJobQuery.job.designs[this.state.designNumber].ifcBuildCompleteDate !== design.ifcBuildCompleteDate || cachedJobQuery.job.designs[this.state.designNumber].asBuiltCompleteDate) {
      console.log(design)
      client.mutate({
        mutation: UpdateDesignMutation,
        variables: {
          id: this.props.job.designs[this.state.designNumber].id,
          JobId: this.props.job.id,
          type: design.type ? design.type : '',
          status: design.status ? design.status : '',
          DesignerId: design.designer ? design.designer.id : null,
          startDate: design.startDate ? design.startDate : null,
          ifcBuildCompleteDate: design.ifcBuildCompleteDate ? design.ifcBuildCompleteDate : null,
          asBuiltCompleteDate: design.asBuiltCompleteDate ? design.asBuiltCompleteDate : null,
        },
        optimisticResponse: {
          id: this.props.job.designs[this.state.designNumber].id,
          type: design.type,
          DesignerId: design.designer,
          status: design.status,
          startDate: design.startDate,
          ifcBuildCompleteDate: design.ifcBuildCompleteDate,
          asBuiltCompleteDate: design.asBuiltCompleteDate,
          notes: design.notes,
          engineering: design.engineering,
          __typename: "Design"
        },
        update: (proxy, result) => {

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          if('updateDesign' in result.data){
            data.job.designs[this.state.designNumber] = result.data.updateDesign;
          } else {
            data.job.designs[this.state.designNumber] = result.data;
          }

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      //end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
      console.log('query after write: ', cachedJobQuery);
    }
  }

  handleEngineeringChange(index, key, value) {
    console.log("DesignTab handleEngineeringChange",key + ' ' + value);
    let newData = update(this.state, {
      design: { engineering: { [index]: {[key]: {$set: value}}}},
      designs: {[this.state.designNumber]: { engineering: { [index]: {[key]: {$set: value}}}}}
    });
    this.setState(newData, ()=>{
      this.handleEngBlur(index,key,value);
    })
  }

  handleEngBlur(eIndex, key, value) {
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    let cachedJobString = cachedJobQuery.job.designs[this.state.designNumber].engineering[eIndex]

    if(cachedJobString['key'] !== this.state.design.engineering[eIndex][key]){
      client.mutate({
        mutation: UpdateEngineeringMutation,
        variables: {
          id: this.state.design.engineering[eIndex].id,
          DesignId: this.state.design.id,
          isTPR: this.state.design.engineering[eIndex].isTPR ? this.state.design.engineering[eIndex].isTPR : false,
          EngineerId: this.state.design.engineering[eIndex].engineer ? this.state.design.engineering[eIndex].engineer.id : null,
          sentDate: this.state.design.engineering[eIndex].sentDate ? this.state.design.engineering[eIndex].sentDate : null,
          dueDate: this.state.design.engineering[eIndex].dueDate ? this.state.design.engineering[eIndex].dueDate : null,
          status: this.state.design.engineering[eIndex].status ? this.state.design.engineering[eIndex].status : '',
          receivedDate: this.state.design.engineering[eIndex].receivedDate ? this.state.design.engineering[eIndex].receivedDate : null,
          completedDate: this.state.design.engineering[eIndex].completedDate ? this.state.design.engineering[eIndex].completedDate : null
        },
        optimisticResponse: {
          id: this.state.design.engineering[eIndex].id,
          DesignId: this.state.design.id,
          isTPR: this.state.design.engineering[eIndex].isTPR,
          EngineerId: this.state.design.engineering[eIndex].engineer,
          sentDate: this.state.design.engineering[eIndex].sentDate,
          dueDate: this.state.design.engineering[eIndex].dueDate,
          status: this.state.design.engineering[eIndex].status,
          receivedDate: this.state.design.engineering[eIndex].receivedDate,
          completedDate: this.state.design.engineering[eIndex].completedDate
        },
        update: (proxy, result) => {
          // console.log('PROXY', proxy);
          // console.log('RESULT', result);

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          // console.log('data', data);
          // console.log('onBlur result', result);

          if('updateEngineering' in result.data){
            data.job.designs[this.state.designNumber].engineering[this.state.eIndex] = result.data.updateEngineering;
          } else {
            data.job.designs[this.state.designNumber].engineering[this.state.eIndex] = result.data;
          }

          // console.log('data after adding data', data);
          // console.log('result after adding data', result);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      // end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });
    }
  }

  handleReviewChange(index, key, value) {
    console.log('DesignTab handleReviewChange', index + ' ' + key + ' ' + value);
    let newData = update(this.state, {
      design: {reviews: {[index]: {[key]: {$set: value}}}},
      designs: {[this.state.designNumber]: {reviews: {[index]: {[key]: {$set: value}}}}}
    });
    this.setState(newData, () => {
      this.handleReviewBlur(index, key, value);
    });
  }

  handleReviewBlur(index, key, value) {
    console.log(index)
    cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });

    let cachedJobReviewString = cachedJobQuery.job.designs[this.state.designNumber].reviews[index]

    if(cachedJobReviewString[key] !== this.state.design.reviews[index][key]){
      client.mutate({
        mutation: UpdateReviewMutation,
        variables: {
          id: this.state.design.reviews[index].id,
          startDate: this.state.design.reviews[index] ? this.state.design.reviews[index].startDate : null,
          endDate: this.state.design.reviews[index] ? this.state.design.reviews[index].endDate : null,
          status: this.state.design.reviews[index] ? this.state.design.reviews[index].status : '',
          isTPR: this.state.design.reviews[index] ? this.state.design.reviews[index].isTPR : false,
          ReviewerId: this.state.design.reviews[index] ? this.state.design.reviews[index].reviewer.id : null
        },
        optimisticResponse: {
          id: this.state.design.reviews[index].id,
          receivedDate: this.state.design.reviews[index].startDate,
          endDate: this.state.design.reviews[index].endDate,
          status: this.state.design.reviews[index].status,
          isTPR: this.state.design.reviews[index].isTPR,
          ReviewerId: this.state.design.reviews[index].reviewer.id
        },
        update: (proxy, result) => {
          console.log('PROXY', proxy);
          console.log('RESULT', result);

          const data = proxy.readQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            }
          });

          console.log('data', data);
          console.log('onBlur result', result);

          if('updateReview' in result.data){
            data.job.designs[this.state.designNumber].reviews[index] = result.data.updateReview;
          } else {
            data.job.designs[this.state.designNumber].reviews[index] = result.data;
          }

          console.log('data after adding data', data);
          console.log('result after adding data', result);

          proxy.writeQuery({
            query: GetJobQuery,
            variables: {
              id: this.props.job.id
            },
            data
          });
        }
      });
      // end client.mutate
      cachedJobQuery = client.readQuery({
        query: GetJobQuery,
        variables: {
          id: this.props.job.id
        }
      });

      console.log(cachedJobQuery)
    }
  }

  render() {
    console.log("DESIGN TABS PROPS ", this.props)
    if(this.props.job.loading) {
      return (
        <div className="load-div">
        <img className="customIconsLoader" role="presentation" src='/images/Projects.gif'/>
         <br />
         Please Wait While We Load Your Project Information
        </div>
      );
    }

    if(this.props.job.error) {
      console.log(this.props.job.error);
      return (<div>An unexpected error occurred</div>);
    }

    const designs = this.state.designs.map((design, index) => {
      return (<MenuItem value={design.id} key={index} primaryText={design.type}  />);
    });

    let designInfo;
    if (this.state.designs.length === 0) {
     designInfo = <div className='row'><br />There are no designs!</div>;
    }

    if(this.state.designs.length !== 0){
      designInfo = <DesignInfo design={this.state.design} job={this.props.job} designNumber={this.state.designNumber} changeHandler={this.handleChange} blurHandler={this.handleBlur} handleEngineeringChange={this.handleEngineeringChange} handleReviewChange={this.handleReviewChange} />;
    }

    let designDropdown;
    if (this.props.designs !== []) {
      designDropdown =
      <div>
        <div className='col-md-3 form-group'>
          <Dropdown
            placeholder='Designs'
            fluid selection options={this.props.designs.map((design, index) => {
              return {
                key: index,
                text: design.type,
                value: design.id
              }
            })}
            value={this.state.selected}
            onChange={(e, data) => {
              console.log("VALUE IN DROPDOWN ", this.state)
              for (let i=0; i < this.state.designs.length; i++) {
                if (this.state.designs[i].id === data.value) {
                  this.setState({
                    designNumber: i,
                    selected: data.value,
                    design: this.props.job.designs[i]
                  })
                }
              }
            }}
          />
        </div>
        <div className='col-md-1'></div>
      </div>
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-12 tabHeader">
              <h4 className="tabHeaderText">DESIGN</h4>
              <img className="tabHeaderLogo paddedImage" role="presentation" src='/images/Design_IconUpdated_p.svg' height="35" width="50"/>
            </div>
          </div>
          <div className='row'>
            {designDropdown}
            <div className='col-md-3'>
              <AddDesignModal addDesign={this.props.addDesign} jobId={this.props.job.id} />
            </div>
          </div>
          <br />
            {designInfo}
        </div>
      </div>
    )
  }
}


export default DesignTab;
