// Import AWS SDK and create a new instance of DynamoDB Document Client
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const DynamoDbTableName = process.env.DynamoDB_Table_Name;
// Export an asynchronous function that accepts the context and req objects as parameters.
// It uses object destructuring to get the id from the request body.
module.exports = async function (context, { body: { id } }) {
  try {
    // Attempt to delete the item with the provided id from the Contact table in DynamoDB
    await dynamoDb.delete({ TableName: DynamoDbTableName, Key: { id } }).promise();
    // Return a success response with HTTP status code 200 and a message indicating which item was deleted
    context.res = { status: 200, body: `Successfully deleted item with id ${id}.` };
  } catch (error) {
    // If an error occurred, return an error response with HTTP status code 500 and an error message
    context.res = { status: 500, body: `Failed to delete item with id ${id}: ${error.message}` };
  }
};
