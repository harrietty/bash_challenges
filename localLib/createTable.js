const AWS= require('aws-sdk');
dynamodb = new AWS.DynamoDB({
  region: 'eu-west-1',
  endpoint: new AWS.Endpoint('http://localhost:8800'),
});

/**
 * Creates a DynamoDB table locally
 */
async function createTable() {
  return await dynamodb.createTable({
    TableName: 'bash_challenges',
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'difficulty',
        AttributeType: 'N',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'bash_challenges_by_difficulty',
        KeySchema: [
          {
            AttributeName: 'difficulty',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 1,
        },
      },
    ],
  }).promise();
}

createTable().then(console.log).catch(console.log);
