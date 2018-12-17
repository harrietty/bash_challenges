/**
 * Handler function for API Gateway
 * @param {Object} event
 * @param {Object} context
 * @param {Function} callback
 */
function handler(event, context, callback) {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({'message': 'Hello World!'}),
  };

  callback(null, response);
};
module.exports = handler;
