function message() {
    // Display a confirmation dialog
    var result = window.confirm("Do you trust this domain?");

    // Check the user's response
    if (result) {
        console.log("User clicked OK.");
    } else {
        console.log("User clicked Cancel.");
    }

    return result;
}