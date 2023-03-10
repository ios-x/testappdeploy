const AWS = require('aws-sdk');

// Create a new instance of DynamoDB Document Client
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const DynamoDbTableName = process.env.DynamoDB_Table_Name;

module.exports = async function (context, req) {
  try {
    // Define params object for scanning all items in DynamoDB table and retrieving them
    const params = { TableName: DynamoDbTableName };

    // Use the scan method of DynamoDB DocumentClient to retrieve all items from the database
    const result = await dynamoDb.scan(params).promise();

    context.res = {
      status: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    // Return an error response with HTTP status code 500, if an error occurs while retrieving data
    context.res = {
      status: 500,
      body: `Error retrieving data: ${error.message}`
    };
  }
};
