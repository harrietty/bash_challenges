const fs = require('fs');
const AWS = require('aws-sdk');
const {DataMapper} = require('@aws/dynamodb-data-mapper');
const uuid = require('uuid/v4');
const path = require('path');
const Challenge = require('./models/challenge.model');
const challengeNum = process.argv[2];
if (challengeNum === undefined) {
  throw new Error('Please provide a challenge number as an argument');
}
const challenge = require(
    path.join(__dirname, 'challenges', `${challengeNum}.json`)
);

const dynamodb = new AWS.DynamoDB({
  logger: console,
});

const s3 = new AWS.S3({
  logger: console,
});

/**
 * Saves the challenge's tests to S3 and then saves the
 * entire challenge to DynamoDB
 * @param {Object} challenge
 */
async function saveChallenge(challenge) {
  // Save tests to S3
  for (let j = 0; j < challenge.tests.length; j++) {
    const test = challenge.tests[j];
    const testNo = (j + 1).toString();
    for (let i = 0; i < test.files.length; i++) {
      const desiredKey = `${challengeNum}/${testNo}/${test.files[i]}`;
      try {
        await s3.putObject({
          Bucket: 'bash-challenges-files',
          Body: fs.readFileSync(
              path.join(
                  __dirname,
                  'challenges',
                  challengeNum,
                  testNo,
                  test.files[i]
              ),
              'utf-8'
          ),
          Key: desiredKey,
        }).promise();

        // Save filename from S3 for each test
        challenge.tests[j].files[i] = `https://s3-eu-west-1.amazonaws.com/bash-challenges-files/${desiredKey}`;
      } catch (e) {
        console.log(`Error saving ${desiredKey}`, e);
      }
    }
  }

  // Save to DynamoDB with correct URL for tests
  const mapper = new DataMapper({client: dynamodb});

  const c1 = new Challenge();
  c1.id = uuid();
  c1.description = challenge.description;
  c1.title = challenge.title;
  c1.difficulty = challenge.difficulty;
  c1.tests = challenge.tests;

  try {
    const res = await mapper.put(c1);
    console.log(res);
  } catch (e) {
    console.log('Error saving to DynamoDB', e);
  }
}

saveChallenge(challenge);
