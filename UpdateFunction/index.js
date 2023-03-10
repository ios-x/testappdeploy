const AWS = require('aws-sdk'); // Import the AWS SDK.
const dynamodb = new AWS.DynamoDB.DocumentClient(); // Create a new instance of the DynamoDB DocumentClient.
const DynamoDbTableName = process.env.DynamoDB_Table_Name;

module.exports = async function (context, { body: { id, name, address } }) {
  if (!id || (!name && !address)) { // Check if id and name or address are provided in the request body.
    context.res = { // Return a bad request response if necessary data is missing.
      status: 400,
      body: 'Please provide valid id and data to update',
    };
    return;
  }

  const params = {
    TableName: DynamoDbTableName, // Specifies the table name in DynamoDB.
    Key: { id }, // Specifies the key to update based on the id passed in the request body.
    UpdateExpression: 'SET #n = :n, #a = :a', // Specifies the attributes to update.
    ExpressionAttributeNames: { // Specifies the substitution variables used in the "UpdateExpression" attribute.
      '#n': 'name',
      '#a': 'address',
    },
    ExpressionAttributeValues: { // Specifies the values to use for substitution in the "UpdateExpression" attribute.
      ':n': name || null,
      ':a': address || null,
    },
    ReturnValues: 'UPDATED_NEW', // Specifies that the response should include the updated item.
  };

  try { // Attempts to execute code within the try block.
    const result = await dynamodb.update(params).promise(); // Calls the update method of the DynamoDB DocumentClient.
    context.res = { // Returns a success response with the updated attributes.
      status: 200,
      body: result.Attributes,
    };
  } catch (error) { // Catches and handles any errors thrown by the try block.
    context.res = { // Returns an error response with details about the cause of the error.
      status: 500,
      body: `Could not update contact: ${error.message}`,
    };
  }
};
