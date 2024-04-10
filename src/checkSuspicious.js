import { isDomainValid } from './virusTotal.js';
import { openMessage } from '../to_delete/message.js';

function isSuspicious(domain1, domain2) {
    if (domain1 === domain2) {
        return false;
    }
    if (levenshteinDistance(domain1, domain2) < 3) {
        return true;
    }
    return false;
}

 function findSuspicious(newDomain) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (isSuspicious(value, newDomain)){
            openMessage();
            return;
        }
        if (isDomainValid(newDomain) == false) {
            openMessage();
            return;
        }
    }     
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
