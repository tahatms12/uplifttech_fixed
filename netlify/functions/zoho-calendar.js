
const axios = require('axios');

exports.handler = async function(event, context) {
  try {
    const response = await axios.get(process.env.VITE_ZOHO_CALENDAR_URL, {
      responseType: 'text'
    });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: response.data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch calendar' }),
    };
  }
};
