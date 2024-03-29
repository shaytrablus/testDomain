require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "maishay272727@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "shaytrablus2@gmail.com>",
  to: "maishay272727@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};