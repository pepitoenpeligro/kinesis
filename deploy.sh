#!/bin/bash

BASE_DIR=`pwd`

CDK_ACCOUNT=030507416442
CDK_REGION='eu-west-1'
CDK_STAGE='dev'

CDK_ACTIONS=('deploy' 'destroy')
CDK_SELECTED_ACTION=1


cd $BASE_DIR/InputStream
CDK_CONTEXT_JSON=`jq '.context' cdk.json`
echo $CDK_CONTEXT_JSON
yes | cdk ${CDK_ACTIONS[CDK_SELECTED_ACTION]} &
p1=$!


cd $BASE_DIR/OutputStream
CDK_CONTEXT_JSON=`jq '.context' cdk.json` 
echo $CDK_CONTEXT_JSON 
yes | cdk ${CDK_ACTIONS[CDK_SELECTED_ACTION]} &
p2=$!

cd $BASE_DIR

# wait < <(jobs -p)

deploying=true
while $deploying 
do
    if ps $p1 > /dev/null ; then
        echo -n "p1 runs "
    else 
        echo -n "p1 ended"
    fi
    if ps $p2 > /dev/null ; then
        echo -n "p2 runs "
    else 
        echo -n "p2 ended"
    fi

    echo ''
    sleep 1

    if ! ps $p1 > /dev/null && ! ps $p2 > /dev/null;
    then
        echo "Finished to deploy InputStream and OutputStream"
        deploying=false
    fi
done


# cd $BASE_DIR/Analytics
# CDK_CONTEXT_JSON=`jq '.context' cdk.json`
# echo $CDK_CONTEXT_JSON
# yes | cdk ${CDK_ACTIONS[CDK_SELECTED_ACTION]} &
# p3=$!

# echo "Finished to deploy Analytics stack"