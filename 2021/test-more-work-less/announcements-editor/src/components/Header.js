import React, { Component } from 'react';
import { CalciteH1, CalciteH2, CalciteH3 } from 'calcite-react/Elements';

import './Header.css';

class Header extends Component {
  setHeader(currentView) {
    if (currentView === 'active-list') {
      return(
        <CalciteH1>
          Active Announcements
        </CalciteH1>
      )
    } else if(currentView === 'json-syntax-error'){
      return (
        [<CalciteH1 className="title" key='error'>Error Reading Portal Organization Description</CalciteH1>,
         <CalciteH2 className="body" key='check-console'>Please check dev console for log, and update organization description in Portal.</CalciteH2>,
         <CalciteH3 className="body" key='illegal-syntax'>Error likely due to organization description pasted in as plain text instead of code snippet, or illegal syntax in recent announcement update.</CalciteH3>
        ]
    );
    } else {
      return (
        <CalciteH1>
          Add or Edit Announcement
        </CalciteH1>
      )
    }
  }

  render() {
    const header = this.setHeader(this.props.status);
    return (
      <div className="header"> 
        { header }
      </div>
    );
  }
}

export default Header;
