import sqlite3 from 'sqlite3';

// Create a function to initialize the database
export class BlockDomainsDatabase {
    constructor() {
        let db = new sqlite3.Database('blockDomains.db', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the blockDomains database.');
                // Create the blockDomains table if it doesn't exist
                db.run(`CREATE TABLE IF NOT EXISTS blockDomains (
                    domainName TEXT PRIMARY KEY
                )`, (err) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    } else {
                        console.log('Table created successfully.');
                    }
                });
            }
        });
    }

    insertToBlockDatabase(newDomain) {
        this.db.run('INSERT INTO blockDomains(domainName) VALUES(?)', [newDomain], function(err) {
            if (err) {
                console.error('Error inserting domain:', err.message);
            } else {
                console.log('Domain inserted successfully.');
            }
        });
    }

    domainInBlock(newDomain) {
        this.db.get('SELECT * FROM blockDomains WHERE domainName = ?', [newDomain], (err, row) => {
            if (err) {
                console.error('Error checking domain:', err.message);
            } else {
                if (row) {
                    console.log('Domain exists in the block list.');
                } else {
                    console.log('Domain does not exist in the block list.');
                }
            }
        });
    }
}