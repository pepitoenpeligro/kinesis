#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { OutputStreamStack } from '../lib/output_stream-stack';

const app = new cdk.App();
const kinesisDataStreamOutputInstanceA = new OutputStreamStack(app, 'OutputStreamStack', {
  env: {
    account: process.env.CDK_ACCOUNT,
    region: process.env.CDK_REGION
  },
});


