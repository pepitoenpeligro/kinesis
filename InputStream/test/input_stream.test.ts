import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as InputStream from '../lib/input_stream-stack';
import { StreamMode } from 'aws-cdk-lib/aws-kinesis';
import _cdkJsonRaw from '../cdk.json'
import { PrincipalWithConditions } from 'aws-cdk-lib/aws-iam';
// interface ICdkJson {
//     app: string;
//     context: {
//       [key: string]: boolean;
//     };
//   }
// const _cdkJson: ICdkJson = _cdkJsonRaw;

// example test. To run these tests, uncomment this file along with the
// example resource in lib/input_stream-stack.ts

beforeEach(() => {
    jest.resetModules();
});

test('Kinesis Input Stream Created', () => {
    const app = new cdk.App();



    // WHEN
    const stack = new InputStream.InputStreamStack(app, 'KinesisInputStreamTest');
    // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::Kinesis::Stream', {
        StreamModeDetails: { StreamMode : StreamMode.PROVISIONED },
        RetentionPeriodHours: cdk.Duration.days(1).toHours(),
        ShardCount: 1
    });

    template.resourceCountIs("AWS::Kinesis::Stream", 1);

});
