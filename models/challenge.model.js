const {DynamoDbSchema, DynamoDbTable} = require('@aws/dynamodb-data-mapper');

/**
 * Base class for a Challenge object
 */
class Challenge {}

Object.defineProperties(Challenge.prototype, {
  [DynamoDbTable]: {
    value: 'bash_challenges',
  },
  [DynamoDbSchema]: {
    value: {
      id: {
        type: 'String',
        keyType: 'HASH',
      },
      title: {
        type: 'String',
      },
      description: {
        type: 'String',
      },
      difficulty: {
        type: 'Number',
      },
      example_use: {
        type: 'String',
      },
      example_output: {
        type: 'String',
      },
      tests: {
        type: 'Collection',
      },
    },
  },
});

module.exports = Challenge;
