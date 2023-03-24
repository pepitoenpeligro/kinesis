#!/bin/bash

BASE_DIR=`pwd`

CDK_ACCOUNT=030507416442
CDK_REGION='eu-west-1'
CDK_STAGE='dev'

CDK_ACTIONS=('deploy' 'destroy')
CDK_SELECTED_ACTION=0

cd $BASE_DIR/Cognito
CDK_CONTEXT_JSON=`jq '.context' cdk.json`
echo $CDK_CONTEXT_JSON
# yes | cdk ${CDK_ACTIONS[CDK_SELECTED_ACTION]} &
# p1=$!
cdk ${CDK_ACTIONS[CDK_SELECTED_ACTION]} 

