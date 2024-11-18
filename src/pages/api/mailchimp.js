const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.SERVER_PREFIX,
});

async function getSpecificList() {
  const listId = process.env.MAILCHIMP_LIST_ID;
  try {
    const response = await mailchimp.lists.getList(listId);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching specific list:', error);
    throw error;
  }
}

// Export the function for use in other files
module.exports = { getSpecificList };

// Example usage
getSpecificList();
