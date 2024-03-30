const fs = require('fs');
const { google } = require('googleapis');
const { insertToBlockDatabase, domainInBlock, blockDatabase } = require('./blockDatabase');
const { domainsDatabase, insertToDatabase, findSuspicious } = require('./domainsDatabase');

// If modifying these scopes, delete the file token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

async function checkMessages(auth) {
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
