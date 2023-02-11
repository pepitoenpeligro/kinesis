import * as cdk from 'aws-cdk-lib';
import { StreamMode } from 'aws-cdk-lib/aws-kinesis';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InputStreamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const kinesis_stack = new cdk.aws_kinesis.Stream(this,'KinesisInputStream', {
      streamMode: this.node.tryGetContext('streamMode') || "PROVISIONED",
      retentionPeriod: cdk.Duration.hours(this.node.tryGetContext('retentionPeriod')) || 24,
      shardCount: this.node.tryGetContext('shardCount') || 1,
      streamName: this.node.tryGetContext('streamName') || "KinesisInputStream"
    })
    
  }
}
