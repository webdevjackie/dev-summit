'use strict';
const fs = require('fs-extra');
const config = require('config');

function modulePortalHome() {
    const deployToHome = config.get('DeployTo.homePage');
    if (!deployToHome) {
        return;
    }

    let portalHome = config.get('Portal.portalHome');

    if (portalHome.indexOf('/', portalHome.length - 1) === -1) {
        portalHome = portalHome + '/';
    }

    const index = portalHome.concat('framework/webapps/arcgis#home/index.html');

    fs.readFile(index, 'utf8', function(err,result){
        if (err){
            return console.log(err);
        }

        const headRegex = '</head>';
        let announcementsDialog = config.get('announcementsHTML');

        // Add version to announcements path
        const pathRegex = 'customizations/announcements';
        const replacementString = 'customizations/announcements' + '-' + config.get('Portal.release');
        announcementsDialog = announcementsDialog.replace(new RegExp(pathRegex), replacementString);

        // Check if announcementsDialog.js script is already present in index.html
        if (!result.match(new RegExp(announcementsDialog))) {
            console.log('Adding Portal Announcement Tool script to index.html');
            result = result.replace(new RegExp(headRegex), announcementsDialog + headRegex);
            console.log('Saving modified index.html');
            writeToFile(index, result);
        } else {
            console.error('NOTICE: Portal Announcement Tool IS IN INDEX.HTML.');
        }
    });

}

function writeToFile(index, result) {
    try {
        fs.writeFileSync(index, result, 'utf8');
    }
    catch (err) {
        return console.error(err);
    }
}

modulePortalHome();
module.exports = modulePortalHome;