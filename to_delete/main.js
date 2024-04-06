import {DomainsDatabase} from './domainsDatabase.js';
import {BlockDomainsDatabase} from './blockDatabase.js';
 //import {findSuspicious} from './checkSuspicious.js';
import {checkMessages, authorize} from './email.js';

const domainsDatabase1= new DomainsDatabase();
const blockDomainsDatabase1 = new BlockDomainsDatabase();
// findSuspicious('facebook.com');
const auth= authorize();
if (auth!=null){
    checkMessages(auth);
}