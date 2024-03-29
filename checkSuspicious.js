const sqlite3 = require('sqlite3').verbose();
const jellyfish = require('jellyfish');
const { message } = require('./message');
const { isDomainValid } = require('./virusTotal');

function isSuspicious(domain1, domain2) {
    if (domain1 === domain2) {
        return false;
    }
    if (jellyfish.levenshtein_distance(domain1, domain2) < 3) {
        return true;
    }
    return false;
}

function findSuspicious(newDomain) {
    let db = new sqlite3.Database('domains.db', (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        db.all('SELECT * FROM domains', (err, rows) => {
            if (err) {
                console.error('Error selecting domains:', err.message);
                return;
            }
            for (const row of rows) {
                const domainName = row.domainName;
                if (isSuspicious(domainName, newDomain)) {
                    db.close();
                    return message();
                }
            }
            db.close();
            if (!isDomainValid(newDomain)) {
                return message();
            }
        });
    });
}
