const AWS = require('aws-sdk');

const params = {
  logger: console,
};

if (process.env.NODE_ENV === 'development') {
  params.endpoint = new AWS.Endpoint('http://localhost:8800');
}

const dynamodb = new AWS.DynamoDB(params);

/**
 * Handler function for API Gateway
 * @param {Object} event
 * @param {Object} context
 * @param {Function} callback
 */
exports.getAll = async (event, context) => {
  console.log({
    path: event.path,
    params: event.pathParameters,
    query: event.queryStringParameters,
  });

  let res;
  const keys = [
    'title',
    'description',
    'id',
    'difficulty',
    'example_use',
    'example_output',
  ].join(',');

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
      ProjectionExpression: keys,
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
      ProjectionExpression: keys,
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
      exampleUse: item.example_use.S,
      exampleOutput: item.example_output.S,
    }))}),
  };
};

exports.getById = async (event, context) => {
  const id = event.pathParameters.challengeId;
  if (isNaN(Number(id))) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({messgae: 'Invalid id: must be a number'}),
    };
  }

  const query = {
    TableName: 'bash_challenges',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': {
        S: id,
      },
    },
  };

  try {
    const res = await dynamodb.query(query).promise();
    const challenge = res.Items[0];
    if (!challenge) {
      return {
        statusCode: 404,
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({challenge: {
          title: challenge.title.S,
          description: challenge.description.S,
          example_use: challenge.example_use.S,
          example_output: challenge.example_output.S,
          id: challenge.id.S,
          difficulty: challenge.difficulty.N,
          tests: challenge.tests.L.map((test) => ({
            input: test.M.input.S,
            output: test.M.output.S,
            files: test.M.files.L.map((file) => file.S),
          })),
        }}),
      };
    }
  } catch (e) {
    console.log('Error', {error: e});
    throw new Error(e);
  }
};
