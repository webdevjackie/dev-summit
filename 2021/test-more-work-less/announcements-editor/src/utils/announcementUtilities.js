import { loadModules } from 'esri-loader';
import { loadCss } from 'esri-loader';
import { escape, unescape } from 'lodash';
export default class AnnouncementUtilities {
    // Utils to strip portal description into array of announcement objects
    static getAnnouncements(description) {
        if (description) {
            const parsedAnnouncements = this.cleanActiveAnnouncements(description);
            return parsedAnnouncements;
        } else {
            return '';
        }
    };

    static cleanActiveAnnouncements(description) {
        let announcements = this.removeHTML(description);
        announcements = this.removeWhitespace(announcements);
        return announcements;
    };

    static fixDoubleQuotes(announcementProperty) {
        const regExpr = /("|\\")/gms;
        announcementProperty = announcementProperty.replace(regExpr, "'");
        announcementProperty = this.removeParaTags(announcementProperty);
        return announcementProperty
    }

    // Quill Rich Text Editor wraps each property with extra paragraph
    // tags. To maintain consistency with Portal Announcement Tool styling,
    // remove these tags so that Title and Date are on the same line. 
    static removeParaTags(announcementProperty) {
        const regExpr = /(<p>|<\/p>)/gm
        return announcementProperty = announcementProperty.replace(regExpr, '');
    }

    static removeHTML(description) {

        // Match announcements array
        let regExpr = /"announcements":(.*?)](\s*)}/gms;

        // Check that there are any announcements
        if(description.match(regExpr)){
            let formattedDescription = description.match(regExpr)[0];

            // Remove 'announcements': prepending array
            regExpr = /"announcements":(\s*)/gms;
            formattedDescription = formattedDescription.replace(regExpr, '');

            // Remove trailing announcementsDialog }
            regExpr = /](\s*)}/gms;
            formattedDescription = formattedDescription.replace(regExpr, ']');
            return formattedDescription;
        } else {
            // No announcements
            regExpr = /^(.*?)"announcements":(.*?)\[(.*?)/gms;
            description = description.replace(regExpr, '[');
            regExpr = /](.*)"search"(.*)/gms;
            return description = description.replace(regExpr, ']');
        }
    };

    static removeWhitespace(description) {
        let regExpr = /[\s]{2,}/gms;
        description = description.replace(regExpr, ' ');

        return description;
    };

    // Utils to format portal description when pasted as plaintext (instead of code snippet)
    // in Portal organization description
    static formatPortalDescription(description) {
        // Fix Quotes
        let regExpr = /&quot;/g
        let formattedDescription = description.replace(regExpr, "\"");

        // Fix '<' and '>'
        regExpr = /(&lt;)|(&amp;lt;)/g;
        formattedDescription = formattedDescription.replace(regExpr, "<");
        regExpr = /(&gt;)|(&amp;gt;)/g;
        formattedDescription = formattedDescription.replace(regExpr, ">");

        // Remove extraneous HTML (<div></div><br /> tags)
        regExpr = /(<div>)|(<\/div>)|(<br \/>)/g;
        formattedDescription = formattedDescription.replace(regExpr, '');
        // Replace end </div>
        formattedDescription = `${formattedDescription} </div>`;

        // Handle special characters for spaces
        formattedDescription = formattedDescription.replace(/\s/g, ' ');

        return formattedDescription;
    }

    // Utils to add new announcement and update portal description
    static formatDate(dateObj) {
        const date = dateObj.toLocaleDateString();
        let time = dateObj.toLocaleTimeString();

        // Remove seconds from time to match Portal Announcements structure
        // i.e.; 1:00PM
        const secondsPlace = time.lastIndexOf(':');
        const hoursMins = time.slice(0, secondsPlace);
        const amOrPm = time.slice(secondsPlace+4);

        time = `${hoursMins}${amOrPm}`;

        const formattedDate = `${date} ${time}`;
        return formattedDate;
    }

    static isDateInvalid(formattedDate) {
        const regExpr = /([0-9]{1,2}\/[0-9]{1,2}\/[\d]{4}) ([\d]{1,2}:[\d]{2,2})(AM|PM)/g;

        if(formattedDate.match(regExpr)){
            return false;
        }
        else {
            return true;
        }

    }

    static buildAnnouncement(title, description, date) {
        const announcement = {
            date,
            title,
            description
        };
        
        return announcement;
    }

    static addAnnouncement(announcement, currentDescription){
        const regExpr = /"announcements":(.*?)](\s*)/gms;
        let announcementsList = currentDescription.match(regExpr)[0];

        announcementsList = this.prepareAnnouncements(announcement, announcementsList);

        // Update portal description with updated announcements list
        const updatedDescription = currentDescription.replace(regExpr, announcementsList);

        return updatedDescription;
    }

    static prepareAnnouncements(newAnnouncement, list) {
        // Remove "announcements": before array
        list = this.removePrefix(list);
        
        // Remove trailing } from announcementsDialog{}
        const regExpr = /](\s*)}/gms;
        list = list.replace(regExpr, ']');

        // Push new announcement to array
        let updatedList = this.removeWhitespace(list);
        updatedList = JSON.parse(updatedList);

        //verify all remaining elements in updatedList are scaped before updating portal org description field
        this.reformatAnnouncements(updatedList);

        updatedList.push(newAnnouncement);

        // Prepend "announcements" to array 
        updatedList = this.addPrefix(updatedList);

        return updatedList;
    }

    static removePrefix(announcementList) {
        let regExpr = /"announcements":(\s*)\[/gms;
        const list = announcementList.replace(regExpr, '[');

        return list;
    }

    static addPrefix(announcementList) {
        let list = JSON.stringify(announcementList);
        list = `"announcements": ${list}`;

        return list;
    }

    // Utilities for saving, editing, or deleting an announcement
    static updatePortalDescription(id, props) {
        const config = props.config;

        // Check that config loaded
        if(!config) {
            return;
        }

        const cssUrl = `${config.jsapiUrl}esri/css/main.css`;
        loadCss(cssUrl);

        const options = {
            url: config.jsapiUrl
        };

        loadModules(['esri/portal/Portal', 'esri/request'], options)
        .then(([Portal, esriRequest]) => {

            const portal = new Portal();
            portal.url = props.config.portalUrl;
            portal.authMode = "anonymous";

            //update portl org Description
            portal.load().then(() => {
                // If Portal Announcements were entered in Portal Organization Description
                // as plain text (instead of as a code snippet), need to handle escaped characters
                let regExpr = /&quot;/g
                props.portalDescription = portal.description.replace(regExpr, "\"");

                const options = {
                    query: {
                        f: "json",
                        description: this.getDescription(id, props)
                    },
                    responseType: "json",
                    method: "post"
                };

                const updateUrl = `${props.portalUrl}/portals/${props.portalID}/update`;

                esriRequest(updateUrl, options).then(function(response){
                    //console.log("Response:" + JSON.stringify(response));
                    props.updateListOnClick();
                });
            });
        })
        .catch(err => {
            // handle any script or module loading errors
            console.error(err);
            props.cancelCreateOnClick();
        });
    }

    static getDescription(id, props) {
        let updatedDescription = props.portalDescription;
        let announcementID = id;
        let title, description, date;

        //Identify any text in the Org Description field that was not added as "View HTML Source" and remove it from the announcement 
        //json structure to maintian the integrity of the json. Append any found text at the begining of the description data
        updatedDescription = this.removeTextFromJson(updatedDescription);

        if (props.newAnnouncement) {
            title = this.fixDoubleQuotes(props.newAnnouncement.title);
            description = this.fixDoubleQuotes(props.newAnnouncement.description);
            date = props.newAnnouncement.date;
        }

        if (props.editOrCreate === 'deleting') {
            updatedDescription = this.deleteFromPortal(id, updatedDescription);
    
            return updatedDescription;
        } else if (props.editOrCreate === 'editing') {
            const oldAnnouncement = props.editedAnnouncement;
            announcementID = `${oldAnnouncement.date}${oldAnnouncement.title}`;

            // delete old announcement
            updatedDescription = this.deleteFromPortal(announcementID, updatedDescription);

            // Set to changed title, description or date, or refer to old title, date, or description if not edited
            title = title || this.fixDoubleQuotes(unescape(oldAnnouncement.title));
            description = description || this.fixDoubleQuotes(unescape(oldAnnouncement.description));
            date = date || oldAnnouncement.date;
        } 

        // Add new or edited announcement
        const announcement = this.buildAnnouncement(escape(title), escape(description), escape(date));
        updatedDescription = this.addAnnouncement(announcement, updatedDescription);

        return updatedDescription;
    }

    static removeTextFromJson(description) {
        let prejsonSegment = '';
        let startndx = description.indexOf('<div class="config"');

        if (startndx > 0) {
            prejsonSegment = description.slice(0, startndx).trim();
        }
        
        let jsonSegment = description.slice(startndx);

        //search at the beginning of the json structure
        startndx = jsonSegment.indexOf('">') + '">'.length;
        let regExpr = /\{(\s*)"helpLink":(.*?)/gmis;
        let beginOfSegment = jsonSegment.match(regExpr)[0];
        let endndx = jsonSegment.indexOf(beginOfSegment);
        let notJsonSegment = jsonSegment.slice(startndx, endndx).trim();
        if (notJsonSegment.length > 0) {
            jsonSegment = jsonSegment.replace(notJsonSegment, '');
            prejsonSegment += notJsonSegment;
        }

        //search at the end of the json structure
        regExpr = /"browseData":(.*?)](\s*)}(\s*)}/gms;
        let endOfSegment = jsonSegment.match(regExpr)[0];

        startndx = jsonSegment.indexOf(endOfSegment) + endOfSegment.length;
        endndx = jsonSegment.indexOf('</div>');
        notJsonSegment = jsonSegment.slice(startndx, endndx).trim();
        if (notJsonSegment.length > 0) {
            jsonSegment = jsonSegment.replace(notJsonSegment, '');
            prejsonSegment += notJsonSegment;
        }
        
        return  (prejsonSegment + jsonSegment);
    }

    // Method to format announcements after Portal organization description has added plaintext (instead of code snippet)
    static reformatAnnouncements(list) {
        let regExpr = /(<(.*?)>)/g;
        for (var ndx = 0; ndx < list.length; ndx++) {
            if (list[ndx].title.match(regExpr)) {
                list[ndx].title = escape(list[ndx].title);
            }

            if (list[ndx].description.match(regExpr)) {
                list[ndx].description = escape(list[ndx].description);
            }

            if (list[ndx].date.match(regExpr)) {
                list[ndx].date = escape(list[ndx].date);
            }
        }
    }

    static deleteFromPortal(id, description) {
        const currentDescription = description;
        const regExpr = /"announcements":(.*?)}(\s*)]/gms;
        let announcementsList = currentDescription.match(regExpr)[0];

        // Remove announcement by id
        announcementsList = this.filterAnnouncement(id, announcementsList);

        // Update portal description with updated announcements list
        const updatedDescription = currentDescription.replace(regExpr, announcementsList);

        return updatedDescription;
    }

    static filterAnnouncement(id, list) {
        // Remove "announcements": before array
        let updatedList = this.removePrefix(list);

        // Remove deleted announcement from array
        updatedList = this.removeWhitespace(updatedList);
        updatedList = JSON.parse(updatedList);
        updatedList = updatedList.filter(item => `${item["date"]}${item["title"]}` !== id);

        // Prepend "announcements" to array
        updatedList = this.addPrefix(updatedList);

        return updatedList;
    }
}
