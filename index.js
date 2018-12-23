const AWS = require('aws-sdk');

/**
 * Handler function for API Gateway
 * @param {Object} event
 * @param {Object} context
 * @param {Function} callback
 */
exports.handler = async (event, context) => {
  console.log({
    path: event.path,
    params: event.pathParameters,
    query: event.queryStringParameters,
  });

  const params = {
    logger: console,
  };

  if (process.env.NODE_ENV === 'development') {
    params.endpoint = new AWS.Endpoint('http://localhost:8800');
  }

  const dynamodb = new AWS.DynamoDB(params);

  let res;

  if (event.queryStringParameters && event.queryStringParameters.difficulty) {
    const difficulty = event.queryStringParameters.difficulty;
    if (isNaN(Number(difficulty))) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({messgae: 'Invalid difficulty: must be a number'}),
      };
    }

    const query = {
      TableName: 'bash_challenges',
      IndexName: 'bash_challenges_by_difficulty',
      KeyConditionExpression: 'difficulty = :difficulty',
      ExpressionAttributeValues: {
        ':difficulty': {
          N: difficulty,
        },
      },
    };

    console.log('Querying DyamoDB', {query});
    try {
      res = await dynamodb.query(query).promise();
    } catch (e) {
      console.log('Error', {error: e});
      throw new Error(e);
    }
  } else {
    const query = {
      TableName: 'bash_challenges',
      ProjectionExpression: 'title, description, id, difficulty',
    };

    console.log('Querying DyamoDB', {query});
    try {
      res = await dynamodb.scan(query).promise();
    } catch (e) {
      console.log('Error', {error: e});
      throw new Error(e);
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({challenges: res.Items.map((item) => ({
      title: item.title.S,
      description: item.description.S,
      difficulty: Number(item.difficulty.N),
      id: item.id.S,
    }))}),
  };
};
