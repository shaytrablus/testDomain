import sqlite3 from 'sqlite3';
import {isDomainValid} from './virusTotal.js';
import {openMessage} from './message.js';

function isSuspicious(domain1, domain2) {
    if (domain1 === domain2) {
        return false;
    }
    if (levenshteinDistance(domain1, domain2) < 3) {
        return true;
    }
    return false;
}

export function findSuspicious(newDomain) {
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
                    console.log("suspicious");
                    openMessage();
                    //TODO:check an opthion to return something after click
                    return;
                }
            }
            db.close();
            if (isDomainValid(newDomain)==false) {
                console.log("suspicious2");
                openMessage();
                //TODO:check an opthion to return something after click
                return;
            }
        });
    });
}

const levenshteinDistance = (s, t) => {
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const arr = [];
    for (let i = 0; i <= t.length; i++) {
      arr[i] = [i];
      for (let j = 1; j <= s.length; j++) {
        arr[i][j] =
          i === 0
            ? j
            : Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
      }
    }
    return arr[t.length][s.length];
  };
