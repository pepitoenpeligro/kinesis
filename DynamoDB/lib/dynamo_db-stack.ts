import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import {
	RestApi,
	EndpointType,
	Cors,
	AuthorizationType,
	IdentitySource,
	LambdaIntegration,
	RequestAuthorizer,
  MockIntegration,
  IResource,
  PassthroughBehavior
} from 'aws-cdk-lib/aws-apigateway';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DynamoDbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const dynamoTable = new cdk.aws_dynamodb.Table(this, 'Locations', {
      partitionKey: {
        name:'userId', 
        type: cdk.aws_dynamodb.AttributeType.STRING
      },
      tableName: 'locations',
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });


    const restApi = new cdk.aws_apigateway.RestApi(this, 'ApiDynamoRestApi', {
      endpointTypes: [EndpointType.REGIONAL],
			defaultCorsPreflightOptions: {
				allowOrigins: Cors.ALL_ORIGINS,
			},
    });
    
    const resource = restApi.root.addResource('{id}')

    const integrationRole = new cdk.aws_iam.Role(this, 'IntegrationRole', {
      assumedBy: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
    })

    dynamoTable.grantReadWriteData(integrationRole)



    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, 'lambdas', 'package.json'),
      environment: {
        PRIMARY_KEY: 'userId',
        TABLE_NAME: dynamoTable.tableName,
      },
      runtime: Runtime.NODEJS_16_X,
    }

    const createOneLambda = new NodejsFunction(this, 'createItemFunction', {
      entry: join(__dirname, 'lambdas', 'create.ts'),
      ...nodeJsFunctionProps,
      
    });

    const createOneIntegration = new LambdaIntegration(createOneLambda);


    dynamoTable.grantReadWriteData(createOneLambda);


    const items = restApi.root.addResource('items');


    items.addMethod('POST', createOneIntegration);



    
  }
}
