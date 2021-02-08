# Announcements Editor
Users can update current announcements displayed on the Portal homepage. 

## Configuring build for deployment
In `config.json`, update the following keys to configure the build for a specific environment:
- portalURL :  "https://{server}/portal",
- jsapiURL: "https://js.arcgis.com/${version}/",
<!-- After applying your changes ensure you can reach all urls in Chrome or Firefox-->

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

