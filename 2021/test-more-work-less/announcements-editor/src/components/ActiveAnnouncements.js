import React, { Component } from 'react';

import { unescape } from 'lodash';

import List, { ListItem, ListItemSubtitle, ListItemTitle } from 'calcite-react/List';
import Button from 'calcite-react/Button';
import XIcon from 'calcite-ui-icons-react/XIcon';
import PencilIcon from 'calcite-ui-icons-react/PencilIcon';
import { CalciteH2 } from 'calcite-react/Elements';

import AnnouncementUtils from '../utils/announcementUtilities';

import './ActiveAnnouncements.css';

class ActiveAnnouncements extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentAnnouncements: ''
        };

        this.deleteAnnouncement = this.deleteAnnouncement.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentAnnouncements: this.props.currentAnnouncements
        })
    }

    deleteAnnouncement(date, title) {
        const announcementID = `${date}${title}`;
        const props = {
            ...this.props,
            editOrCreate: 'deleting'
        };

        AnnouncementUtils.updatePortalDescription(announcementID, props);
    }

    getAnnouncementList(currentAnnouncements) {
        const deleteBtn = (date, title) => {
            return (
                    <Button
                        key={`${date}-${title}-delete`}
                        onClick={() => this.deleteAnnouncement(date, title)}
                        icon={<XIcon size={16} />}
                        iconButton
                        title='Delete'
                    />
                );
        }

        const editBtn = (date, title, description) => {
            return (
                <Button
                    key={`${date}-${title}-edit`}
                    onClick={() => this.props.setIsEditing(date, title, description)}
                    icon={<PencilIcon size={16} />}
                    iconButton
                    title='Edit'
                />
            );
        }

        try {
            const announcements = JSON.parse([currentAnnouncements]);
            const listItems = announcements.map((announcement) => (
                <ListItem 
                    key={ `${announcement.date}${announcement.title}` } 
                    leftNode={ announcement.date } 
                    rightNode={ [editBtn(announcement.date, announcement.title, announcement.description), deleteBtn(announcement.date, announcement.title)] }
                >
                    <ListItemTitle dangerouslySetInnerHTML={{ __html: unescape(announcement.title) }} />
                    <ListItemSubtitle dangerouslySetInnerHTML={{ __html: unescape(announcement.description) }} />
                </ListItem>
            ));

            if(listItems.length) {
                return (
                    <List className="announcements-list">
                        { listItems }
                    </List>
                );
            } else {
                return (<CalciteH2>No Active Announcements</CalciteH2>);
            }
        }
        catch (error) {
            console.log(error);
            console.log(`Current Portal Organization Description:  ${currentAnnouncements}`)
            this.props.setJsonError();
        }
    }
    
    render() {
        let announcements = this.state.currentAnnouncements;


        if (announcements) {
            announcements = this.getAnnouncementList(announcements);
        } 
        
        return (
            <div>
                { announcements }
            </div>
        );
    }
}

export default ActiveAnnouncements;