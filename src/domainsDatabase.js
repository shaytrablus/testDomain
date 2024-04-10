class DomainsDatabase {
    constructor() {
        // Initialize the domains if it doesn't exist
        if (!localStorage.getItem('domains')) { 
            localStorage.setItem('domains', JSON.stringify([]));
            let domains = JSON.parse(localStorage.getItem('domains'));
            domains.push('gmail.com');
            domains.push('google.com');
            domains.push('facebook.com');
            domains.push('outlook.com');
            domains.push('linkedin.com');
            domains.push('twitter.com');
            domains.push('amazon.com');
            domains.push('whatsapp.com');
            domains.push('tiktok.com');
            domains.push('apple.com');
            domains.push('microsoft.com');
            domains.push('youtube.com');
            domains.push('virostotal.com');
            localStorage.setItem('domains', JSON.stringify(domains));
            console.log(domains);
            console.log('domains database created successfully.');
        } else {
            console.log('Connected to the domains database.');
        }
    }

    insertToDomainDatabase(newDomain) {
        // Parse the existing domains
        let domains = JSON.parse(localStorage.getItem('domains'));

        // Check if the domain already exists
        if (!domains.includes(newDomain)) {
            // Insert the new domain
            domains.push(newDomain);
            //localStorage.setItem('csvData', JSON.stringify(data));
            localStorage.setItem('domains', JSON.stringify(domains));
            console.log('Domain inserted successfully to "domains".');
        } else {
            console.error('Error inserting domain: Domain already exists in "domains".');
        }
    }
}