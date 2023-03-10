// Import AWS SDK and UUID module
const AWS = require('aws-sdk');
const uuid = require('uuid');

// Create a new instance of DynamoDB Document Client
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const DynamoDbTableName = process.env.DynamoDB_Table_Name;

// Export an asynchronous function that accepts the context and req objects
module.exports = async function (context, req) {
  // Extract name and address from the request body
  const { name, address } = req.body;

  // If name or address is not provided, return a 400 error response
  if (!name || !address) {
    context.res = {
      status: 400,
      body: 'Please provide name and an address',
    };
    return;
  }

  // Define params object for adding a new item to DynamoDB
  const params = {
    TableName: DynamoDbTableName,
    Item: {
      id: uuid.v4(), // Generate a random UUID as the primary key
      name,
      address,
    },
  };

  try {
    // Use the put method of DynamoDB DocumentClient to add the item to the database
    await dynamoDb.put(params).promise();

    // Return a success response with HTTP status code 200
    context.res = {
      status: 200,
      body: 'The contact was added to your DynamoDB database',
    };
  } catch (error) {
    // Return an error response with HTTP status code 500
    context.res = {
      status: 500,
      body: `Could not create contact: ${error.message}`,
    };
  }
};
