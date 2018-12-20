const AWS = require('aws-sdk');

/**
 * Handler function for API Gateway
 * @param {Object} event
 * @param {Object} context
 * @param {Function} callback
 */
exports.handler = async (event, context, callback) => {
  const dynamodb = new AWS.DynamoDB({
    logger: console,
  });

  try {
    const res = await dynamodb.scan({
      TableName: 'bash_challenges',
      ProjectionExpression: 'title, description, id, difficulty',
    }).promise();
    console.log(res);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({challenges: res}),
    };
    callback(null, response);
  } catch (e) {
    console.log(e);
    callback(e);
  }
};
