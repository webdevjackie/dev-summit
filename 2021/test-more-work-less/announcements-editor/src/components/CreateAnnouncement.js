import React, { Component } from 'react';

import { unescape } from 'lodash';

import Form, { FormControl, FormControlLabel, FormHelperText } from 'calcite-react/Form';
import TextField from 'calcite-react/TextField';
import Button, { ButtonGroup } from 'calcite-react/Button';
import SaveIcon from 'calcite-ui-icons-react/SaveIcon';
import TrashIcon from 'calcite-ui-icons-react/TrashIcon';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import AnnouncementUtils from '../utils/announcementUtilities';

import './CreateAnnouncement.css';

class CreateAnnouncement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: '',
            title: '',
            date: '',
            isDateInvalid: false
        };
        this.handleTitleInput = this.handleTitleInput.bind(this);
        this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
        this.handleDateInput = this.handleDateInput.bind(this);
        this.saveAnnouncement = this.saveAnnouncement.bind(this);
        this.cancelAnnouncement = this.cancelAnnouncement.bind(this);
    }

    componentDidMount() {
        if(this.props.editOrCreate === 'editing'){
            this.setState({
                description: unescape(this.props.editedAnnouncement.description),
                title: unescape(this.props.editedAnnouncement.title),
                date: this.props.editedAnnouncement.date
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            title: '',
            description: '',
            date: '',
            isDateInvalid: false
        });
    }

    handleTitleInput(value) {
        this.setState({
            ...this,
            title: value
        });
    }

    handleDescriptionInput(value) {
        this.setState({
            ...this,
            description: value
        });
    }

    handleDateInput(e) {
        e.persist();
        try {
            const isDateInvalid = AnnouncementUtils.isDateInvalid(e.target.value);
            this.setState({
                ...this,
                date: e.target.value,
                isDateInvalid
            })
        }
        catch (error) {
            console.log(error);
        }
    }
    
    saveAnnouncement(e) {
        // Since this function is the result of a form submission, it was sometimes causing a page reload
        // before the portal description was actually updated. preventDefault stops this, and we
        // later close the form in App.js->loadPortalAnnouncements
        e.preventDefault();
        const title = AnnouncementUtils.fixDoubleQuotes(this.state.title);
        const description = AnnouncementUtils.fixDoubleQuotes(this.state.description);
        const date = this.state.date || AnnouncementUtils.formatDate(new Date());

        const newAnnouncement = {
            title,
            description,
            date
        };

        const props = {
            ...this.props,
            newAnnouncement
        }

        const announcementID = '';
        
        AnnouncementUtils.updatePortalDescription(announcementID, props);
    }

    cancelAnnouncement() {
        this.props.cancelCreateOnClick();
    }

    renderSaveBtn() {
        const isFormComplete = (this.props.editOrCreate === 'editing') || ((this.state.title.length > 0) && (this.state.description.length > 0)); 
        const isDateInvalid = this.state.isDateInvalid;
        const saveBtn = (
            <Button
                className='save-btn'
                disabled={!isFormComplete || isDateInvalid}
                type="submit"
                icon={<SaveIcon size={16} />}
                iconPosition="before"
            >
                Save
            </Button>
        );
        return saveBtn;
    }

    renderCancelBtn() {
        const cancelBtn = (
            <Button
                id='cancel-btn'
                clear
                onClick={ this.cancelAnnouncement }
                icon={<TrashIcon size={16} />}
                iconPosition="before"
            >
                Cancel
            </Button>
        );

        return cancelBtn;
    }

    renderAnnouncementForm() {
        const cancelBtn = this.renderCancelBtn();
        const saveBtn = this.renderSaveBtn();
        const isDateInvalid = this.state.isDateInvalid;
        const formHelperText = isDateInvalid ? (<FormHelperText>Invalid Format</FormHelperText>) : '';
        let defaultDate = AnnouncementUtils.formatDate(new Date());

        const modules = {
            toolbar: [
                [ 'bold', 'italic', 'underline' ],
                [ { color: [] }, { background: [] } ],
                [ { list: 'ordered' }, { list: 'bullet' }, 'link', 'image' ]
            ]
        };

        if(this.props.editOrCreate === 'editing' ){
            defaultDate = this.props.editedAnnouncement.date;
        }

        const announcementForm = (
            <Form onSubmit={this.saveAnnouncement}>
                <FormControl horizontal error={isDateInvalid}>
                    <FormControlLabel style={{ minWidth: '120px' }}>
                        Date
                    </FormControlLabel>
                    <TextField onChange={this.handleDateInput} defaultValue={unescape(defaultDate)}/>
                    {formHelperText}
                </FormControl>
                <FormControl horizontal>
                    <FormControlLabel style={{ minWidth: '120px' }}>
                        Title
                    </FormControlLabel>
                    <ReactQuill className="text-toolbar" 
                        theme='snow'
                        modules={modules}
                        value={this.state.title} 
                        onChange={this.handleTitleInput} 
                    />
                </FormControl>
                <FormControl horizontal>
                    <FormControlLabel style={{ minWidth: '120px' }}>
                        Description
                    </FormControlLabel>
                    <ReactQuill className="text-toolbar"
                        theme='snow'
                        modules={modules}
                        value={this.state.description} 
                        onChange={this.handleDescriptionInput} 
                    />
                </FormControl>
                <FormControl>
                    <ButtonGroup className='group-btns'>
                        {cancelBtn}
                        {saveBtn}
                    </ButtonGroup>
                </FormControl>
            </Form>
        );

        return announcementForm
    }
    
    render() {
        const announcementForm = this.renderAnnouncementForm();

        return (
        <div className='create-announcement'>
            { announcementForm }
        </div>
        );
    }
}

export default CreateAnnouncement;