/* eslint-disable require-jsdoc */
'use strict';
const fs = require('fs-extra');
const config = require('config');

function moduleAnnouncementTool() {
    let portalHome = config.get('Portal.portalHome');
    
    if (portalHome.indexOf('/', portalHome.length - 1) === -1) {
        portalHome = portalHome + '/';
    }

    try {
        const webappsSrc = './src/webapps/arcgis#home/customizations';
        const webappsDest = portalHome.concat('framework/webapps/arcgis#home/customizations');
        const customizationsHome = 'framework/webapps/arcgis#home/customizations/announcements';

        const announcementTitle = config.get('announcementTitle');
        const announcementContent = config.get('announcementContent');
        const announcementJSFile = webappsDest.concat('/announcements/Dialog.js');

        const announcementTitleRegex = 'title: announcementTitle';
        const announcementContentRegex = 'content: announcementContent';

        fs.copySync(webappsSrc, webappsDest);

        // Replace file contents 
        let result = fs.readFileSync(announcementJSFile, 'utf8');
        result = result.replace(new RegExp(announcementTitleRegex), 'title: ' + announcementTitle);
        result = result.replace(new RegExp(announcementContentRegex), 'content: ' + announcementContent);
        writeToFile(announcementJSFile, result);

        // If release folder exists (i.e., announcements-${version}), remove it.  
        // It will be recreated below.
        const semverDir = portalHome.concat(customizationsHome) + '-' + config.get('Portal.release');
        if (fs.pathExistsSync(semverDir)) {
            fs.removeSync(semverDir);
        }

        // Rename announcments folder to reflect current version number
        fs.renameSync(portalHome.concat(customizationsHome), semverDir);
        console.log('Successfully renamed ' + portalHome.concat(customizationsHome) + ' to ' + semverDir);

        // Loop through files within framework/webapps/arcgis#home/customizations/announcements.
        // Replace 'announcements' paths with 'announcements-${version}'
        fs.readdirSync(semverDir).forEach(item => {
            
            let file = semverDir.concat('/').concat(item);
            const pathRegex = 'customizations/announcements/';
    
            if (fs.statSync(file).isFile()){
                let data = fs.readFileSync(file, 'utf8');

                const foundMatches = data.match(new RegExp(pathRegex, 'g'));
                let replacementString = 'customizations/announcements' + "-" + config.get('Portal.release') + '/';

                if(foundMatches){
                    data = data.replace(new RegExp(pathRegex), replacementString);
                    writeToFile(file, data);
                }
            }
        });


    }
    catch (err) {
        return console.error(err);
    }
}

function writeToFile(file, result) {
    try {
        fs.writeFileSync(file, result, 'utf8');
    }
    catch (err) {
        return console.error(err);
    }
}

moduleAnnouncementTool();
module.exports = moduleAnnouncementTool;