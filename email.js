import fs from 'fs';
import path from 'path';
import process from 'process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

//Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

//Serializes credentials to a file compatible with GoogleAuth.fromJSON.
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

//Load or request or authorization to call APIs.
export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

//@param {google.auth.OAuth2} auth An authorized OAuth2 client.

export async function checkMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
      const res = await gmail.users.messages.list({ userId: 'me', labelIds: ['INBOX'] });
      const messages = res.data.messages || [];
      for (const message of messages) {
        const msg = await gmail.users.messages.get({ userId: 'me', id: message.id, format: 'metadata', metadataHeaders: ['From'] });
        const headers = msg.data.payload.headers;
        const sender = headers.find(header => header.name === 'From').value;
        const senderDomain = sender.split('@')[1].split('>')[0];
        console.log("Sender's Domain:", senderDomain);
        if (await domainInBlock(senderDomain)) {
          await deleteEmails(gmail, senderDomain);
        } else {
          const ans = await findSuspicious(senderDomain);
          if (ans === 1) {
            await insertToDatabase(senderDomain);
          } else if (ans === 2) {
            await deleteEmails(gmail, senderDomain);
            await insertToBlockDatabase(senderDomain);
          }
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
}  

function deleteEmails(gmail, domain) {
    gmail.users.messages.list({
        userId: 'me',
        q: `from:${domain}`,
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err);
        const messages = res.data.messages;
        if (messages && messages.length > 0) {
            console.log(`Deleting ${messages.length} emails from ${domain} domain.`);
            messages.forEach((message) => {
                gmail.users.messages.delete({
                    userId: 'me',
                    id: message.id,
                }, (err, res) => {
                    if (err) return console.error('The API returned an error:', err);
                });
            });
        }
    });
}
