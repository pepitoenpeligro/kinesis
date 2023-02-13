import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_kinesisanalyticsv2 as kinesisanalyticsv2 } from 'aws-cdk-lib';



export class AnalyticsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const streamToAnalyticsRole = new cdk.aws_iam.Role(this, 'streamToAnalyticsRole', {
      assumedBy: new cdk.aws_iam.ServicePrincipal('kinesisanalytics.amazonaws.com')
    });

    streamToAnalyticsRole.addToPolicy(new cdk.aws_iam.PolicyStatement({
      resources: [
        cdk.Fn.importValue("inputStreamArn")
        // "arn:aws:kinesis:eu-west-1:030507416442:stream/FlujoDatos"
      ],
      actions: ['kinesis:*', 'lambda:*'] 
    }));

    const thresholdDetector = new cdk.aws_kinesisanalytics.CfnApplication(this, "KinesisAnalyticsApplication", {
      applicationName: 'abnormality-detector',
      applicationCode: "",
      inputs: [
        {
          namePrefix: "SOURCE_SQL_STREAM",
          kinesisStreamsInput: {
            resourceArn: cdk.Fn.importValue("inputStreamArn"),
            roleArn: streamToAnalyticsRole.roleArn
          },
          inputParallelism: { count: 1 },
          inputSchema: {
            recordFormat: {
              recordFormatType: "JSON",
              mappingParameters: { jsonMappingParameters: { recordRowPath: "$" } }
            },
            recordEncoding: "UTF-8",
            recordColumns: [
              {
                name: "transactionId",
                mapping: "$.transactionId",
                sqlType: "VARCHAR(64)"
              },
              {
                  name: "name",
                  mapping: "$.name",
                  sqlType: "VARCHAR(64)"
              },
              {
                  name: "age",
                  mapping: "$.age",
                  sqlType: "INTEGER"
              },
              {
                  name: "address",
                  mapping: "$.address",
                  sqlType: "VARCHAR(256)"
              },
              {
                  name: "city",
                  mapping: "$.city",
                  sqlType: "VARCHAR(32)"
              },
              {
                  name: "state",
                  mapping: "$.state",
                  sqlType: "VARCHAR(32)"
              },
              {
                  name: "transaction",
                  mapping: "$.transaction",
                  sqlType: "INTEGER"
              },
              {
                  name: "bankId",
                  mapping: "$.bankId",
                  sqlType: "VARCHAR(32)"
              },
              {
                  name: "createdAt",
                  mapping: "$.createdAt",
                  sqlType: "VARCHAR(32)"
              }
            ]
          }
        }
      ]
    })
    // thresholdDetector.node.addDependency(streamToAnalyticsRole);










































    // // const sqlApplicationConfigurationProperty: kinesisanalyticsv2.CfnApplication.SqlApplicationConfigurationProperty = {
    // const sqlApplicationConfigurationProperty: kinesisanalyticsv2.CfnApplicationProps = {
    //   inputs: [{
    //     inputSchema: {
    //       recordColumns: [{
    //         name: 'name',
    //         sqlType: 'sqlType',
    
    //         // the properties below are optional
    //         mapping: 'mapping',
    //       }],
    //       recordFormat: {
    //         recordFormatType: 'recordFormatType',
    
    //         // the properties below are optional
    //         mappingParameters: {
    //           csvMappingParameters: {
    //             recordColumnDelimiter: 'recordColumnDelimiter',
    //             recordRowDelimiter: 'recordRowDelimiter',
    //           },
    //           jsonMappingParameters: {
    //             recordRowPath: 'recordRowPath',
    //           },
    //         },
    //       },
    
    //       // the properties below are optional
    //       recordEncoding: 'recordEncoding',
    //     },
    //     namePrefix: 'namePrefix',
    
    //     // // the properties below are optional
    //     // inputParallelism: {
    //     //   count: 123,
    //     // },
    //     // inputProcessingConfiguration: {
    //     //   inputLambdaProcessor: {
    //     //     resourceArn: 'resourceArn',
    //     //   },
    //     // },
        
    //     // kinesisStreamsInput: {
    //     //   resourceArn: 'resourceArn',
    //     // },
    //   }],
    // };

  
    const applicationConfigurationProperty: kinesisanalyticsv2.CfnApplication.ApplicationConfigurationProperty = {
      environmentProperties: {
        propertyGroups: [{
          propertyGroupId: 'propertyGroupId',
          propertyMap: {
            propertyMapKey: 'propertyMap',
          },
        }],
      },
      sqlApplicationConfiguration: {
        inputs: [{
          inputSchema: {
            recordColumns: [{
              name: 'name',
              sqlType: 'sqlType',
    
              // the properties below are optional
              mapping: 'mapping',
            }],
            recordFormat: {
              recordFormatType: 'recordFormatType',
    
              // the properties below are optional
              mappingParameters: {
                csvMappingParameters: {
                  recordColumnDelimiter: 'recordColumnDelimiter',
                  recordRowDelimiter: 'recordRowDelimiter',
                },
                jsonMappingParameters: {
                  recordRowPath: 'recordRowPath',
                },
              },
            },
    
            // the properties below are optional
            recordEncoding: 'recordEncoding',
          },
          namePrefix: 'lapp',
    
          inputProcessingConfiguration: {
            inputLambdaProcessor: {
              resourceArn: 'resourceArn',
            },
          },
          kinesisFirehoseInput: {
            resourceArn: 'resourceArn',
          },
          kinesisStreamsInput: {
            resourceArn: 'resourceArn',
          },
        }],
      },

      
    };


    

    // new kinesisanalyticsv2.CfnApplication(this,'elid', applicationConfigurationProperty );
    // const appSQL =  new cdk.aws_kinesisanalyticsv2.CfnApplication(this, 'id',  );
  }
}
