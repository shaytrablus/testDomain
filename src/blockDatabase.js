class BlockDomainsDatabase {
    constructor() {
        // Initialize the blockDomains if it doesn't exist
        if (!localStorage.getItem('blockDomains')) {
            localStorage.setItem('blockDomains', JSON.stringify([]));
            let blockDomains = JSON.parse(localStorage.getItem('blockDomains'));
            console.log('BlockDomains database created successfully.');
        } else {
            console.log('Connected to the blockDomains database.');
        }
    }

    insertToBlockDatabase(newDomain) {
        // Parse the existing blockDomains
        let blockDomains = JSON.parse(localStorage.getItem('blockDomains'));

        // Check if the domain already exists
        if (blockDomains===null){
            localStorage.setItem('blockDomains', JSON.stringify([]));
            blockDomains = JSON.parse(localStorage.getItem('blockDomains'));
        }
        if (!(blockDomains.includes(newDomain))) {
            // Insert the new domain
            blockDomains.push(newDomain);
            localStorage.setItem('blockDomains', JSON.stringify(blockDomains));
            console.log('Domain inserted successfully.');
        } else {
            console.error('Error inserting domain: Domain already exists in blockDomains.');
        }
    }

    domainInBlock(newDomain) {
        // Parse the existing blockDomains
        let blockDomains = JSON.parse(localStorage.getItem('blockDomains'));

        // Check if the domain exists
        if (blockDomains){
            if (blockDomains.includes(newDomain)) {
                console.log('Domain exists in the block list.');
                return true;
            } else {
                console.log('Domain does not exist in the block list.');
                return false;
                }
            }
        }
    }