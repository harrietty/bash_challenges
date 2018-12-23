## Bash Challenges API


#### Making infrastructure changes

To make any changes to the infrastructure, update the `serverless.yml` file and run `$ npm run deploy`.

At the moment, any changes to the DynamoDB Tables also need to be made in the `/localLib/createTable.js` file.

#### Development:

To run the API locally:

    $ npm run dev

To run a local DynamoDB instance on port 8800:

    $ java -Djava.library.path=~/dynamodb/SynamoDBLocal_lib -jar ~/dynamodb/DynamoDBLocal.jar -sharedDb -port 8800

To create the necessary local tables:

    $ node ./localLib/createTable.js

To seed a local DynamoDB instance:

    $ NODE_ENV=development node ./localLib/seed.js

#### Production

To add a new JSON file to the production database (including uploading associated files to S3), run:

    $ NODE_ENV=production node putChallenge.js <challenge-number>

Where `<challenge-number>` is the numeric name of the JSON file, e.g.:

    $ NODE_ENV=production node putChallenge.js 6

To update a challenge, simply run the same command:

    $ NODE_ENV=production node putChallenge.js 6