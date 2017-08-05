import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import client from './../../../index.js';
import GetJobQuery from '../../../queries/GetJobQuery';

import { withRouter } from 'react-router';
import LabelInput from '../../LabelInput';
import FormActionButton from '../../FormActionButton';
import SystemInverterSet from './SystemInverterSet';
import Panelboard from './Panelboard';
import update from 'immutability-helper';
import { Confirm, Loader, Segment, Dimmer } from 'semantic-ui-react';

const createSystemMutation = gql`
  mutation createSystem($ac: Float, $dc: Float, $build: JSON, $JobId: ID!) {
    createSystem (input: { ac: $ac, dc: $dc, build: $build, JobId: $JobId}) {
      id
      ac
      dc
      build
      singleLines{
        id
        data
        link
        svg
      }
    }
  }
`;

const updateSystemMutation = gql`
  mutation updateSystem($id: ID! $ac: Float, $dc: Float, $build: JSON, $JobId: ID!) {
    updateSystem (input: { id: $id ac: $ac, dc: $dc, build: $build, JobId: $JobId}) {
      id
      ac
      dc
      build
      singleLines{
       id
       data
       link
       svg
      }
    }
  }
`;

const createSingleLineMutation = gql`
  mutation createSingleLine($job:ID! , $SystemId: ID!) {
    createSingleLine (job: $job, input: { SystemId: $SystemId}) {
      id
      data
      link
      svg
      success
      message
    }
  }
`;



// const downloadSingleLine = gql`
//   mutation downloadSingleLine
// `;

// let cachedJobQuery;
let confirmText = `You currently have x number of unstamped single-lines remaining. Would you like to generate a single-line?`

class SystemTab extends Component {
  constructor(props) {
    super(props);
    console.log('system props!', props)
    this.handleChange = this.handleChange.bind(this);
    this.addInverterSet = this.addInverterSet.bind(this);
    this.changeInverter = this.changeInverter.bind(this);
    this.changePanel = this.changePanel.bind(this);
    this.changePanelboardInverter = this.changePanelboardInverter.bind(this);
    this.addPanelArray = this.addPanelArray.bind(this);
    this.addPanelboard = this.addPanelboard.bind(this);
    this.createSingleLine = this.createSingleLine.bind(this);
    this.calcWatts = this.calcWatts.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      name: this.props.job.name,
      number: this.props.job.number,
      id: this.props.job.system ? this.props.job.system.id : '',
      ac: this.props.job.system ? this.props.job.system.ac : 0,
      dc: this.props.job.system ? this.props.job.system.dc : 0,
      build: this.props.job.system ? this.props.job.system.build : {
        inverters: []
      },
      singleLines: this.props.job.system ? this.props.job.system.singleLines : [],
      singleLineLink: null,
      isGenerating: false,
      isFinished: false,
      confirmText: confirmText,
      confirmOpen: false
    }
  }

  // componentDidMount() {
  //   console.log(this.props)
  // }

  addPanelboard(){
    let nextPanelboardState
    let newPanelboardArr = [{
      id: "Sub-Panelboard " + this.state.build.panelboards.length,
      name: "Sub-Panelboard " + this.state.build.panelboards.length,
      model: "Sub-Panelboard " + this.state.build.panelboards.length,
      inverters: []
    }];
    nextPanelboardState = update(this.state,{
      build: {
        panelboards: {
          0: {name: {$set: "Master Panelboard"}},
          $push: newPanelboardArr
        }
      }
    });
    this.setState(nextPanelboardState, this.handleChange);
  }
  addInverterSet(){
    let newInverterSet = [{
      id : '',
      orientation: '',
      rows:'',
      isMicro: false,
      hasOptimizers: false,
      combiner: "none",
      panels: [],
      panelboard: null
    }];
    let newInverterState;
    if(this.state.build.inverters.length + 1 === 2){
      console.log("length is 2");
      let newPanelboardsArray = [{
        id: "Master Panelboard",
        name: "Master Panelboard",
        model: "Master Panelboard",
        inverters: []
      }];
      newInverterState = update(this.state, {
        build : {
          panelboards: {$set: newPanelboardsArray},
          inverters: {$push: newInverterSet}
        }
      });
      this.setState(newInverterState, this.handleChange);
    } else {
      console.log("length is !2")
      newInverterState = update(this.state, {
        build : {inverters: {$push: newInverterSet}}
      });
      this.setState(newInverterState);
    }
  }
  addPanelArray(iIndex){
    console.log("addPanelArray state", iIndex, this.state);
    if(this.state.build.inverters[iIndex].panels.length < 4){
      let newPanelArray = [{
        id : '',
        count: '',
        rows:'',
        perRow: '',
        orientation: '',
        azimuth: '',
        tilt: '',
        distanceFrom: '',
        hasOptimizer: ''
      }];
      let newState = update(this.state, {
        build: { inverters: { [iIndex]: {panels: {$push: newPanelArray}}}}
      });
      this.setState(newState, console.log("addInverterSetState", this.state));
    } else {
      alert("Maximum of 4 different Arrays per Inverter");
    }
  }
  calcWatts(){
    let newWatts = update(this.state, {
      ac: {
        $set: this.state.build.inverters.reduce((a, c) => {
          let iCount = c.count ? parseInt(c.count, 10) : 0 ;
          let iWatts = c.acWattsMaxOut ? c.acWattsMaxOut : 0;
          return a + (iWatts * iCount);
        }, 0),
      },
      dc: {
        $set: this.state.build.inverters.reduce((a,c)=>{
          console.log(a, c)
          let dcPanels
          let iCount = c.count ? parseInt(c.count, 10) : 0;
          if(c.panels.length > 0){
            dcPanels = c.panels.reduce((acc,curr)=>{
              console.log(acc)
              console.log(curr)
              let pWatts = curr.stcWatts ? curr.stcWatts : 0 ;
              let pPerRow = curr.perRow ? curr.perRow : 0;
              let pArrayCount = curr.arrayCount ? curr.arrayCount : 0;
              console.log(pWatts, pPerRow, pArrayCount)
              return acc + (pWatts  * pPerRow * pArrayCount);
            }, 0);
          }
          console.log(dcPanels, iCount)
          return a + (dcPanels);
        }, 0)
      }
    });
    this.setState(newWatts);

  }
  changeInverter(index, key, value){
    console.log("changeInverter", index, key, value);
    console.log('State in ChangeInverter', this);

    let newData;

    if(key === 'combiner'){
      console.log("combiner change", value);
    }

    if(key === 'count'){

      newData = update(this.state, {
        build: { inverters: { [index]: {
          [key]: {$set: value}
        }}},
      });
      console.log("SET COUNT1", newData)
      this.setState(newData, this.handleChange);
      console.log("SET COUNT2", this.state);
    }
    if(key === 'id'){
      let inputs = value.mpptInPer1 + value.mpptInPer2;
        newData = update(this.state, {
          build: { inverters: { [index]: {
            [key]: {$set: value.id},
            isMicro: {$set: value.isMicro},
            canOptimize: {$set: value.canOptimize},
            acWattsMaxOut: {$set: value.acWattsMaxOut},
            inputs: {$set: inputs},
            transformer: {$set: value.hasTransformer}
          }}}
        });
      this.setState(newData, this.handleChange);
      console.log("KEY IS ID");
    } else {
      newData = update(this.state, {
        build: { inverters: { [index]: {[key]: {$set: value}}}},
      });
      this.setState(newData, this.handleChange);
    }
  }
  changePanel(iIndex, pIndex, key, value){
    let newData = null;
    if(key === 'id'){
      console.log("panel select");
        newData = update(this.state, {
          build: { inverters: { [iIndex]: { panels: { [pIndex]: {
            [key]: {$set: value.id},
            kW: {$set: (value.ptcWatts/1000)},
            stcWatts: {$set: value.stcWatts}
          }}}}}
        });
      console.log("KEY IS ID");
    } else {
      newData = update(this.state, {
        build: { inverters: { [iIndex]: { panels: { [pIndex]: {[key]: {$set: value}}}}}},
      });
    }
    this.setState(newData, this.handleChange);

    // console.log("changePanel", iIndex, pIndex, key, value);
    // console.log(this);
    // let newData = update(this.state, {
    //   build: { inverters: { [iIndex]: { panels: { [pIndex]: {[key]: {$set: value}}}}}},
    // });
    // this.setState(newData, ()=>{
    //   this.handleChange();
    // })
  }
  changePanelboardInverter(pIndex, iIndex, key, value){
    console.log('changing inverter panelboard')
  }
  handleChange() {
    console.log("handleBlur from System Tab", this);
    this.calcWatts();
    let cachedJobQuery = client.readQuery({
      query: GetJobQuery,
      variables: {
        id: this.props.job.id
      }
    });
    console.log(cachedJobQuery);
    console.log("onBlur new made", this);
    let handleChangeVars = {
          id: this.state.id,
          ac: this.state.ac,
          dc: this.state.dc,
          build: this.state.build,
          JobId: this.props.job.id,
          singleLines: this.state.singleLines
        }
      let systemMutation;
      if(!cachedJobQuery.job.system){
        delete handleChangeVars.id;
        systemMutation = createSystemMutation;
        console.log("No System", this.state.id);
      } else {
        systemMutation = updateSystemMutation;
        handleChangeVars.id = this.props.job.system.id;
      }
      console.log(handleChangeVars);
      client.mutate({
        mutation: systemMutation,
        variables: handleChangeVars,

          update: (proxy, result) => {
            console.log('PROXY', proxy);

            console.log('RESULT', result);

            // Read the data from our cache for this query.
            const data = proxy.readQuery({
              query: GetJobQuery,
              variables: {
                id: this.props.job.id
              }
            });
            console.log('data', data);
            //combining our original query data with mutation result
            if(cachedJobQuery.job.system){
              if('updateSystem' in result.data){
                data.job.system = result.data.updateSystem;
              } else {
                data.job.system = result.data
              }
            } else {
              if('createSystem' in result.data){
                data.job.system = result.data.createSystem;
              } else {
                data.job.system = result.data
              }
            }

            console.log('data after updating system', data);
            console.log(this);
            // Write our combined data back to the store cache
            proxy.writeQuery({
              query: GetJobQuery,
              variables: {
                id: this.props.job.id
              },
              data
            });
          }
        });

        //updating the variable after we change it
        cachedJobQuery = client.readQuery({
          query: GetJobQuery,
          variables: {
            id: this.props.job.id
        }
      });
  }

  showConfirm() {
    this.setState({ ...this.state, confirmOpen: true})
    console.log(this.state.confirmOpen)
  }

  handleConfirm() {
    this.createSingleLine()
  }

  handleCancel() {
    this.setState({ ...this.state, confirmOpen: false});
  }

  // sldLink = this.state.singleLines[this.state.singleLines.length - 1].link;
  createSingleLine(){
    console.log("in create Single line", this);
    this.setState({ ...this.state, isGenerating: true, confirmText: 'Currently generating. Please wait and DO NOT CLICK any buttons, as you may be charged multiple times. This process could take up to two minutes.'})
    // this.props.dimmerOn();
    this.props.createSingleLine({
      variables: { job: this.props.job.id, SystemId: this.props.job.system.id}
    }).then((data)=>{
      if(data.data.createSingleLine.success === false){
        alert(data.data.createSingleLine.message);
      } else {
        let newSLDState = update(this.state, {
          singleLines: {$push: [data.data.createSingleLine]},
          singleLineLink: {$set: data.data.createSingleLine.link}
        })
        this.setState(newSLDState, ()=>{console.log("new SLD state", this.state.singleLines, this.state.singleLineLink)})
      }
    }).then(() => {
      this.refs.sldpdf.click()
    }).then(() => {
      // this.props.dimmerOff();
      this.setState({ ...this.state, singleLineLink: null, confirmOpen: false, isGenerating: false, isFinished: true, confirmText: confirmText})
    })
  }

  render() {
    // console.log("SystemTab", this);
    console.log('これは日本語で書いたコメントだよ！喜べ！', this);
    console.log(this.state.confirmOpen)
    console.log('OOGA BOOGA', this.props.job.system)
    if(this.props && this.props.job){
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
    }

    let sets = null;
    if('inverters' in this.state.build){
      console.log("in has inverters");
      sets = this.state.build.inverters.map((item, index) => {
        if(!item.panelboard){
          return (
            <SystemInverterSet key={index} inverter={item} panelboards={'panelboards' in this.state.build ? this.state.build.panelboards : null} inverterNumber={index} changeInverter={this.changeInverter} changePanelboardInverter={this.changePanelboardInverter} changePanel={this.changePanel} addPanelArray={this.addPanelArray} jobId={this.props.job.id} system={this.state} moveInverter={this.moveInverter}/>
          );
        } else {
          return null;
        }
      });
    }

    let Panelboards;

    if(this.state.build.panelboards){
      Panelboards = (() => {
        return(
          <div className="panel panel-default">
            <div className="panel-heading">
              {this.state.build.panelboards.length > 1 ? "Panelboards" : "Panelboard"}
            </div>
            {
              this.state.build.panelboards.map((panelboard, index, array) => {
                console.log("Panelboard in Map", panelboard)
                return(
                  <div key={index} className="panel-heading row">
                    <Panelboard key={index} index={index} panelboard={panelboard} panelboards={array} someProp={"hello"}/>
                    {
                      this.state.build.inverters.map((inverter, index, array)=>{
                        if(inverter.panelboard === panelboard.id){
                          return (
                            <SystemInverterSet key={index} inverter={inverter} panelboards={'panelboards' in this.state.build ? this.state.build.panelboards : null} inverterNumber={index} changeInverter={this.changeInverter} changePanelboardInverter={this.changePanelboardInverter} changePanel={this.changePanel} addPanelArray={this.addPanelArray} jobId={this.props.job.id} system={this.state} moveInverter={this.moveInverter}/>
                          );
                        } else {
                          return null;
                        }
                      })
                    }
                  </div>

                )
              })
            }

            <FormActionButton onClick={this.addPanelboard} text="+"/>
          </div>
        )
      })();
    }

    let diagram;
    if(this.state.singleLines[0]){
      console.log(this.state.singleLines[this.state.singleLines.length - 1])
      // let parser = new DOMParser();
      diagram = <div dangerouslySetInnerHTML={{ __html: this.state.singleLines[this.state.singleLines.length - 1].svg}} />
    }

    let sldLink = this.state.singleLineLink;
    let downloadLink;
    if (sldLink !== null) {
      console.log('running link thing')
      downloadLink = (() => {
        return (
          <a href={sldLink} download='sldLOLOL.pdf' ref='sldpdf' />
        )
      })();
    } else if (sldLink === null) {
      downloadLink = null;
    }

    let confirmTextDiv;
    if (this.state.isGenerating) {
      confirmTextDiv = (() => {
        return (
          <Segment basic textAlign='center'>
            <img className="customIconsLoader" role="presentation" src='/images/Single-line.gif'/>
            <br />
            {this.state.confirmText}
          </Segment>
          // <div>{this.state.confirmText}</div>
          // <div>今は単線結線図を作っております。少々お待ちください</div>
        )
      })();
    } else {
      confirmTextDiv = (() => {
        return (
          <Segment basic textAlign='center'>
            {this.state.confirmText}
          </Segment>
          // <div>{this.state.confirmText}</div>
          // <div>今は単線結線図を作っております。少々お待ちください</div>
        )
      })();
    }
    let generatingButtonText = 'DO NOT CLICK!'
    let confirmModal;
    if (this.state.isGenerating) {
      confirmModal = (() => {
        return (
          <Confirm
            open={this.state.confirmOpen}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            content={confirmTextDiv}
            closeOnDimmerClick={false}
            cancelButton={generatingButtonText}
            confirmButton={generatingButtonText}
          />
        )
      })();
    } else {
      confirmModal = (() => {
        return (
          <Confirm
            open={this.state.confirmOpen}
            onCancel={this.handleCancel}
            onConfirm={this.handleConfirm}
            content={confirmTextDiv}
            closeOnDimmerClick={false}
          />
        )
      })();
    }

    let finishedTextDiv;
    if (this.state.isGenerating) {
      finishedTextDiv = (() => {
        return (
          <Segment basic textAlign='center'>
            Completed and downloaded.
          </Segment>
          // <div>今は単線結線図を作っております。少々お待ちください</div>
        )
      })();
    } else {
      finishedTextDiv = null;
    }

    return (
      <div className="panel panel-default">
        {/*<Dimmer.Dimmable as={Segment} dimmed={true} >*/}

          <div className="panel-heading">
            <div className="row">
                <div className="col-md-12 tabHeader">
                    <h4 className="tabHeaderText">SYSTEM INFO</h4>
                    <img className="tabHeaderLogo" role="presentation" src='/images/System_Icon_p.svg' height="30"/>
                </div>
              </div>
          </div>
         {/* <FormActionButton onClick={this.createSingleLine} text="Generate Single-line"/>
          <button>
            <a href={sldLink} download target="_blank">
              Click here to download
            </a>
          </button>*/}
          <div className="panel-body">
            <div className="row">

              <LabelInput label="DC Size (STC)" name='dc' value={this.state.dc + " W"} placeholder="DC System Watts" readOnly={true} className="col-md-6"/>
              <LabelInput label="AC Size" name='ac' value={this.state.ac + " W"} placeholder="AC System Watts" readOnly={true} className="col-md-6"/>
            </div>
            {Panelboards}
            <div className="panel-heading">
              Inverter Set&nbsp;&nbsp;&nbsp;&nbsp;
              <FormActionButton onClick={this.addInverterSet} text="+"/>
            </div>
              <div className="row">
                {sets}
              </div>
  <br /> <br />
            <div className="row">
              <div className="col-md-12 tabHeader">
                  <h4 className="tabHeaderText">SINGLE-LINE GENERATOR</h4>
                  <img className="tabHeaderLogo" role="presentation" src='/images/System_Icon_p.svg' height="30"/>
              </div>
              <FormActionButton onClick={this.showConfirm} text="GENERATE SINGLE-LINE"/>
              {finishedTextDiv}
              <div>
                {confirmModal}
                {downloadLink}
              </div>
            </div>
          {/*<button>
            <a href={this.sldLink} download target="_blank">
              Click here to download
            </a>
          </button>*/}
          </div>
          {/*<div className="panel-heading">
                    <div className="panel-heading">
                      Single-line Generator
                    </div>
                    <FormActionButton onClick={this.createSingleLine} text="Generate"/>
                  </div>*/}
          {/*<Dimmer
            active
          >
            <Loader
            >
              {this.state.generatingText}
            </Loader>
          </Dimmer>
        </Dimmer.Dimmable>*/}
      </div>


    )
  }
}





const SystemTabWithMutation = compose(
  graphql(createSingleLineMutation, {
    name: 'createSingleLine',//naming the mutation so you can call it
    options: {
      fetchPolicy: 'network-only'
    }
  }),
  // graphql(updateConstructionMutation, {
  //   name: 'updateConstruction',//naming the mutation so you can call it
  //   options: {
  //     fetchPolicy: 'cache-and-network'
  //   }
  // })
)(withRouter(SystemTab));

export default SystemTabWithMutation;
