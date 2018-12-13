const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const challenge = require('./challenges/1.json');

var dynamodb = new AWS.DynamoDB({
  logger: console,
});

const batchParams = {
  RequestItems: {
    challenges: [
      {
        PutRequest: {
          Item: {
            id: {
              N: challenge.id.toString()
            },
            title: {
              S: challenge.title
            },
            description: {
              S: challenge.description
            },
            difficulty: {
              N: challenge.difficulty.toString()
            },
            example_use: {
              S: challenge.example_use
            },
            example_output: {
              S: challenge.example_output
            },
          }
        }
      },
    ],
    challenge_tests: challenge.tests.map(test => ({
      PutRequest: {
        Item: {
          id: {
            N: Math.ceil(Math.random() * 100).toString()
          },
          challenge_id: {
            N: challenge.id.toString()
          },
          input: {
            S: test.input
          },
          output: {
            S: test.output
          }
        }
      }
    }))
  }
}

dynamodb.batchWriteItem(batchParams, (err, res) => {
  console.log(err, res);
});
