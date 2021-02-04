/* eslint-disable require-jsdocs */
'use strict';

const fs = require('fs-extra');
const config = require('config');

function restoreIndexHTML() {
    let portalHome = config.get('Portal.portalHome');

    if (portalHome.indexOf('/', portalHome.length - 1) === -1) {
        portalHome = portalHome + '/';
    }

    const indexHTML = portalHome.concat('framework/webapps/arcgis#home/index.html');
    const itemHTML = portalHome.concat('framework/webapps/arcgis#home/item.html');
    const contentHTML = portalHome.concat('framework/webapps/arcgis#home/content.html');
    const viewerHTML = portalHome.concat('framework/webapps/arcgis#home/webmap/viewer.html');

    //Remove Announcement Tool from html
    restoreFile(indexHTML);
    restoreFile(itemHTML);
    restoreFile(contentHTML);
    restoreFile(viewerHTML);

    //Remove announcements directory
    deleteFolder();
}

function deleteFolder() {
    const portalHome = config.get('Portal.portalHome');

    if (portalHome.indexOf('/', portalHome.length - 1) === -1) {
        portalHome = portalHome + '/';
    }

    const customizationsDir = portalHome.concat('framework/webapps/arcgis#home/customizations/announcements/')
        .replace(new RegExp('announcements'), 'announcements-' + config.get('Portal.release'));
    
    if(fs.pathExistsSync(customizationsDir)){
        console.log('deleting framework/webapps/arcgis#home/customizations/announcements');
        fs.removeSync(customizationsDir);
    }
    else console.log('framework/webapps/arcgis#home/customizations/announcements is not present on system');
}

function restoreFile(file) {
    fs.readFile(file, 'utf8', function(err, result) {
        if (err) {
            return console.log(err);
        }

        let announcementInit = config.get('announcementsHTML');
        
        // Adjust path for viewer.html
        if (file.indexOf('viewer.html') != -1) {
            announcementInit = announcementInit.replace(new RegExp("src='."), "src='..");
        }

        // Add version to announcements path
        const pathRegex = 'customizations/announcements';
        const replacementString = 'customizations/announcements' + "-" + config.get('Portal.release');
        announcementInit = announcementInit.replace(new RegExp(pathRegex), replacementString);

        if(result.match(new RegExp(announcementInit))){
            // Remove references to AnnouncementInit.js
            result = result.replace(announcementInit, '');

            writeToFile(file, result);
        }

        
    });
}

function writeToFile(file, result) {
    fs.writeFile(file, result, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log('Removed Portal Announcement Tool from ' + file);
    });
}

restoreIndexHTML();
module.exports = restoreIndexHTML;