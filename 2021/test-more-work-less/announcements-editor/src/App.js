import React, { Component } from 'react';
import { loadModules } from 'esri-loader';
import { loadCss } from 'esri-loader';

import Loader from 'calcite-react/Loader';
import { CalciteH2 } from 'calcite-react/Elements';
import Button from 'calcite-react/Button';
import PlusIcon from 'calcite-ui-icons-react/PlusIcon';

import Header from './components/Header';
import CreateAnnouncement from './components/CreateAnnouncement';
import ActiveAnnouncements from './components/ActiveAnnouncements';
import AnnouncementUtils from './utils/announcementUtilities';

import axios from 'axios';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        portalLoadStatus: 'loading',
        portalDescription: '',
        currentAnnouncements: '',
        currentView: 'active-list',
        selectedItem: {},
        portalUrl: '',
        portalID: '',
        config: {}
    };

    this.updateAnnouncementsList = this.updateAnnouncementsList.bind(this);
    this.cancelCreate = this.cancelCreate.bind(this);
    this.setIsEditing = this.setIsEditing.bind(this);
    this.setJsonError = this.setJsonError.bind(this);
    this.getConfig = this.getConfig.bind(this);
  }

  componentDidMount() {
    // Need to make a network request to load config when app first loads.
    this.getConfig();
  }

  updateAnnouncementsList() {
    this.loadPortalAnnouncements();
  }

  cancelCreate() {
    this.setState({
      ...this,
      currentView: 'active-list'
    });
  }

  setIsEditing(date, title, description) {
    const selectedItem = {
      date,
      title,
      description
    };

    this.setState({
      ...this,
      currentView: 'editing',
      selectedItem
    });
  }

  setJsonError(){
    this.setState({
      ...this,
      currentView: 'json-syntax-error'
    });
  }

  renderActiveAnnouncements(loadStatus) {
    let activeAnnouncements;
    let createBtn = this.renderCreateBtn();

    if (loadStatus === 'success') {
      activeAnnouncements = [
        <ActiveAnnouncements key='portalDescription'
          portalUrl={this.state.portalUrl} 
          portalID={this.state.portalID}
          updateListOnClick={this.updateAnnouncementsList} 
          currentAnnouncements={this.state.currentAnnouncements} 
          portalDescription={this.state.portalDescription}
          config={this.state.config}
          editOrCreate='deleting'
          setIsEditing={this.setIsEditing}
          setJsonError={this.setJsonError}
        />, createBtn
      ];
    } else if (loadStatus === 'loading') {
      activeAnnouncements = <Loader text='Loading...'/>;
    } else if (loadStatus === 'orgDescriptionMissing') {
      activeAnnouncements = <CalciteH2>Portal Organization description not configured</CalciteH2>
    } else {
      activeAnnouncements = <CalciteH2>Portal failed to load</CalciteH2>
    }

    return activeAnnouncements;
  }

  renderCreateAnnouncement() {
    return (<CreateAnnouncement 
      portalUrl={this.state.portalUrl} 
      portalID={this.state.portalID} 
      portalDescription={this.state.portalDescription}
      config={this.state.config}
      updateListOnClick={this.updateAnnouncementsList}
      editOrCreate={this.state.currentView}
      editedAnnouncement={this.state.selectedItem}
      cancelCreateOnClick={this.cancelCreate}
      />)
  }
  
  // currentView can equal active-list, creating, or editing
  renderHeader(currentView){
    return <Header status={currentView}/>
  }

  renderCreateBtn() {
    return (
      <Button
        className='create-btn'
        key='create'
        onClick={() => this.setState({
            currentView: 'creating'
        })}
        icon={<PlusIcon size={16} />}
        iconPosition='before'
      >
      Add
      </Button>
    );
  }

  render() {
    const activeAnnouncements = this.renderActiveAnnouncements(this.state.portalLoadStatus);
    const createAnnouncement = this.renderCreateAnnouncement();
    const currentView = this.state.currentView;
    const header = this.renderHeader(currentView);

    // Three possible views:
    // 1. Viewing Active Announcements
    // 2. Creating/Editing an Announcement
    // 3. JSON Syntax Error

    // 1. Viewing Active Announcements (not creating, not editing)
    if (currentView === 'active-list') {
      return (
        <div className='App'>
          { header }
          { activeAnnouncements }
        </div>
      );
    }
    // 2. Creating/Editing Announcement
    else if(currentView === 'editing' || currentView === 'creating'){
      return (
        <div className='App'>
            { header }
            { createAnnouncement }
        </div>
      )
    }
    // 3. Error in JSON Syntax from recent announcements update 
    else {
      return (
        <div className='App'>
            { header }
        </div>
      )
    }
  }

  getConfig = () => {
    let configPromise = axios.get('config.json')
    .then(res => {
      this.setState({
        ...this,
        config: res.data
      });
      this.loadPortalAnnouncements();
    });
  
    return configPromise;
  };

  loadPortalAnnouncements = () => {
    this.setState({
      ...this,
      portalLoadStatus: 'loading'
    });
    const config = this.state.config;
    const cssUrl = config.cssUrl;
    loadCss(cssUrl);

    const options = {
      url: config.jsapiUrl
    };

    loadModules(['esri/portal/Portal'], options)
    .then(([Portal]) => {
      const portal = new Portal();
      portal.url = config.portalUrl; 
      portal.authMode = 'immediate';

      portal.load().then(() => {
        let description = portal.description;
        let currentAnnouncements = AnnouncementUtils.getAnnouncements(description);
        // Check that a portal organization description exists
        if(description === '<br>') {
          this.setState({
            portalLoadStatus: 'orgDescriptionMissing'
          });
          return;
        }

        // If Portal Announcements were entered in Portal Organization Description
        // as plain text (instead of as a code snippet), need to handle escaped characters
        const dirtyFormat = /&quot;/g;
        if(dirtyFormat.test(portal.description)) {
            description = AnnouncementUtils.formatPortalDescription(description);
            currentAnnouncements = AnnouncementUtils.removeHTML(description);
            currentAnnouncements = AnnouncementUtils.removeWhitespace(currentAnnouncements);
        } 

        const portalUrl = portal.restUrl;
        const portalID = portal.id;
        // Set currentView to ensure it is updated
        this.setState({
          ...this,
          portalLoadStatus: 'success', 
          portalDescription: description,
          currentAnnouncements: currentAnnouncements,
          currentView: 'active-list',
          portalUrl: portalUrl,
          portalID: portalID
         });
      });
    })
    .catch(err => {
      // handle any script or module loading errors
      console.error(err);
      this.setState({
        portalLoadStatus: 'failed'
      })
    });
  }
}

export default App;
