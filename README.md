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

    $ npm run seed-dev

