import {insertToDatabase} from './domainsDatabase';
import {insertToBlockDatabase} from './blockDatabase';
import {deleteEmails} from './checkEmail.html';
//get the message
var message = document.getElementById("myMessage");

// Get the button that opens the modal
var btn = document.querySelector("button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// Function to open the message
export function openMessage() {
    message.style.display = "block";
}

// Function to close the message
function closeMessage() {
    message.style.display = "none";
}

// Function to handle "Yes" button click
function handleYes() { // add to domainDatabase
    alert("You clicked Yes!");
    insertToDatabase(senderDomain);
    closeMessage();
}

// Function to handle "No" button click
function handleNo() { //add to blockDatabase and delete messages
    alert("You clicked No!");
    deleteEmails(gmail, senderDomain);
    insertToBlockDatabase(senderDomain);
    closeMessage();
}

// When the user clicks anywhere outside of the message, close it
window.onclick = function(event) {
    if (event.target == message) {
        closeMessage();
    }
}