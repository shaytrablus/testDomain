require('./email.js')
require('./app.js')
require('./domainsDatabase.js')
require('./blockDomainsDatabase.js')

const app = new app();
const domainsDatabase= new domainsDatabase();
const blockDomainsDatabase= new blockDomainsDatabase();
checkMessages()