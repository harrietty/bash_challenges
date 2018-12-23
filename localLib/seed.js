const fs = require('fs');
const AWS = require('aws-sdk');
const {DataMapper} = require('@aws/dynamodb-data-mapper');
const path = require('path');
const Challenge = require('../models/challenge.model');

const dynamodb = new AWS.DynamoDB({
  region: 'eu-west-1',
  endpoint: new AWS.Endpoint('http://localhost:8800'),
  logger: console,
});

const mapper = new DataMapper({client: dynamodb});

const challenges = fs.readdirSync(
    path.join(__dirname, '..', 'challenges')).filter((f) => f.includes('.json')
);

challenges.forEach(async (challenge, j) => {
  const challengeNum = j + 1;
  const data = JSON.parse(
      fs.readFileSync(
          path.join(__dirname, '..', 'challenges', challenge), 'utf-8'
      )
  );

  // Change the file URL to the S3 url
  data.tests.forEach((test, i) => {
    const testNo = i + 1;
    test.files.forEach((file, i) => {
      const s3Key = `${challengeNum}/${testNo}/${file}`;
      test.files[i] = `https://s3-eu-west-1.amazonaws.com/bash-challenges-files/${s3Key}`;
    });
  });

  const c1 = new Challenge();
  c1.id = challengeNum;
  c1.description = data.description;
  c1.title = data.title;
  c1.difficulty = Number(data.difficulty);
  c1.tests = data.tests;
  c1.example_use = data.example_use;
  c1.example_output = data.example_output;

  try {
    const res = await mapper.put(c1);
    console.log(res);
  } catch (e) {
    console.log('Error saving to DynamoDB', e);
  }
});
