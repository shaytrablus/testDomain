const CLIENT_ID = '989528676780-rqilun6vnsdr1jlff2dus9mdo3309ha9.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBdk7HpTR_2dba2aIFyzKV-YHYuArRn41Q';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// document.getElementById('authorize_button').style.visibility = 'hidden';
// document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client:auth2', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    window.gapi.client
        .init({
            clientId: CLIENT_ID,
            scope: "email",
            plugin_name: 'modern-ally-418808',
        })
    console.log('GAPI client initialized');
    gapi.client.load('gmail', 'v1', () => {
        console.log('Gmail API client initialized');
    });
    gapiInited = true;
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    }).then(() => {
        console.log('gis client initialized');
    }, () => {
        console.log('failed');
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

 /**
     *  Sign out the user upon button click.
     */
 function handleSignoutClick() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
  }
  