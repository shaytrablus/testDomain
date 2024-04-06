import {google} from 'googleapis';
import fs from 'fs';
import {insertToBlockDatabase, domainInBlock, blockDatabase} from './blockDatabase.js';
import {domainsDatabase, insertToDatabase, findSuspicious} from './domainsDatabase.js';


const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

export async function authenticateGmail() {
    let creds = null;
    try {
        // Load credentials from token.json file
        if (fs.existsSync("token.json")) {
            creds = JSON.parse(fs.readFileSync("token.json"));
        }
        // If there are no (valid) credentials available, let the user log in.
        if (!creds || !creds.valid) {
            // Load client secrets from a local file.
            const content = fs.readFileSync("credentials.json");
            const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            // Check if credentials expired and refresh if necessary
            if (creds && creds.expiry_date < Date.now() && creds.refresh_token) {
                const { token } = await oAuth2Client.refreshToken(creds.refresh_token);
                creds = token;
            } else {
                // Generate new credentials
                const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES,
                });
                console.log('Authorize this app by visiting this URL:', authUrl);
                const code = ''; // Input authorization code here
                const { tokens } = await oAuth2Client.getToken(code);
                creds = tokens;
            }
            // Save the credentials for the next run
            fs.writeFileSync("token.json", JSON.stringify(creds));
        }

        // Create a Gmail API client
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        return gmail;
    } catch (error) {
        console.error('Error authenticating with Gmail API:', error);
    }
}

// Usage:
// authenticateGmail().then(gmail => {
//     // Use gmail API client here
// }).catch(console.error);





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
