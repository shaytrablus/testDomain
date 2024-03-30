import sqlite3 from 'sqlite3';
import fs from 'fs';

export class DomainsDatabase {
    constructor() {
        let db = new sqlite3.Database('domains.db', (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the domains database.');
                db.run(`CREATE TABLE IF NOT EXISTS domains (
                    domainName TEXT PRIMARY KEY
                )`, (err) => {
                    if (err) {
                        console.error('Error creating table:', err.message);
                    } else {
                        console.log('Table created successfully.');
                        if (!fs.existsSync('domains.db')){
                            this.initializeDomains(db);
                        }
                    }
                });
            }
        });
    }

    initializeDomains(db) {
        fs.readFile('domains.csv', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            const lines = data.split('\n');
            for (const line of lines) {
                const domainName = line.trim();
                if (domainName) {
                    db.run('INSERT INTO domains (domainName) VALUES (?)', [domainName], (err) => {
                        if (err) {
                            console.error('Error inserting domain:', err.message);
                        }
                    });
                }
            }
            this.printDomains(db);
        });
    }

    printDomains(db) {
        db.all('SELECT * FROM domains', (err, rows) => {
            if (err) {
                console.error('Error selecting domains:', err.message);
                return;
            }
            for (const row of rows) {
                console.log(row.domainName);
            }
        });
    }


    insertToDatabase(newDomain) {
        let db = new sqlite3.Database('domains.db', (err) => {
            if (err) {
                console.error(err.message);
                return;
            }
            db.run('INSERT INTO domains (domainName) VALUES (?)', [newDomain], (err) => {
                if (err) {
                    console.error('Error inserting domain:', err.message);
                }
            });
            db.close();
        });
    }
}
