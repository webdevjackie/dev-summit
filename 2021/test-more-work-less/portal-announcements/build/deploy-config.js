'use strict';

const fs = require('fs');
const config = require('config');


function moduleConfig() {
   let portalHome = config.get('Portal.portalHome');

   if (portalHome.indexOf('/', portalHome.length - 1) === -1) {
      portalHome = portalHome + '/';
  }

   const customizationsPackage = config.get('configCustomizations');
   const configFile = portalHome.concat('customizations/' + config.get('Portal.version') + '/framework/webapps/arcgis#home/js/arcgisonline/config.js');


   fs.readFile(configFile, 'utf8', function(err,result){
         if (err){
            return console.log(err);
         }

         const packagesRegex = 'packages:\\s*\\[';
         const getCustomizations = '/customizations';
         const hasCustomizations = result.match(new RegExp(getCustomizations));

         let isChanges = false;
         let replacementString = 'packages: [';

         // Announcement Tool requires 1 package to be added to the package
         // array in config.js: customizations.

         // 1. Check if config.js has customizations package
         if(!hasCustomizations) {
            console.log('Config.js missing customizations package, adding now...');
            replacementString += customizationsPackage;
            isChanges = true;
         }

         // Customizations package already present in config.js
         if(hasCustomizations) {
               console.error('NOTICE: CUSTOMIZATIONS PACKAGE ALREADY IN CONFIG.JS.');
         }

         if(isChanges) {
            result = result.replace(new RegExp(packagesRegex), replacementString);
            console.log('Saving new config.js. Portal restart required.');
            writeToFile(configFile, result);
         }
   });
  }
  function writeToFile(file,result){
      fs.writeFile(file, result, 'utf8', function (err) {
          if (err) return console.log(err);
      });
  }

moduleConfig();

module.exports = moduleConfig;