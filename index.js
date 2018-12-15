const AWS = require('aws-sdk');
const {DataMapper} = require('@aws/dynamodb-data-mapper');
const uuid = require('uuid/v4');
const path = require('path');
const Challenge = require('./challenge.model');
const challengeNum = process.argv[2];
if (challengeNum === undefined) throw new Error('Please provide a challenge number as an argument');
const challenge = require(path.join(__dirname, 'challenges', `${challengeNum}.json`));

const dynamodb = new AWS.DynamoDB({
  logger: console,
});

const mapper = new DataMapper({client: dynamodb});

const c1 = new Challenge();
c1.id = uuid();
c1.description = challenge.description;
c1.title = challenge.title;
c1.difficulty = challenge.difficulty;
c1.tests = challenge.tests;

mapper.put(c1)
  .then(console.log)
  .catch(console.log);
