#!/bin/bash

BASE_DIR=`pwd`

CDK_ACCOUNT=030507416442
CDK_REGION='eu-west-1'
CDK_STAGE='dev'

cd $BASE_DIR/InputStream
CDK_CONTEXT_JSON=`jq '.context' cdk.json`
echo $CDK_CONTEXT_JSON
yes | cdk destroy &
p1=$!


cd $BASE_DIR/OutputStream
CDK_CONTEXT_JSON=`jq '.context' cdk.json` 
echo $CDK_CONTEXT_JSON 
yes | cdk destroy &
p2=$!

cd $BASE_DIR

# wait < <(jobs -p)


while true 
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
        echo "FINISHED"
        exit 0
    fi
    
done



# CDK_ACCOUNT=030507416442 CDK_REGION='eu-west-1' CDK_STAGE='dev' CDK_CONTEXT_JSON=`jq '.context' cdk.json` cdk apply