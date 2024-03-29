async function isDomainValid(domain) {
    const apiKey = '272264df46cbfc7b845b59154f41ae0cfccbf25fddd29c6fb57042267c7bb7dd';
    const url = 'https://www.virustotal.com/api/v3/domains/' + domain;
    const headers = {
        'x-apikey': apiKey
    };

    try {
        const response = await fetch(url, { headers });
        if (response.ok) {
            const data = await response.json();
            if ('error' in data) {
                console.log("Error:", data.error.message);
                return null;
            } else {
                return data.data.attributes.last_analysis_stats.malicious === 0;
            }
        } else if (response.status === 429) {
            console.log('Encountered rate-limiting. Sleeping for 45 seconds.');
            await new Promise(resolve => setTimeout(resolve, 45000)); // Wait for 45 seconds
            return isDomainValid(domain);
        } else {
            console.log("Error:", response.status);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
