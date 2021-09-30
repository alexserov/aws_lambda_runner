#!/bin/bash

node --version
npm --version
id

ORGANIZATION=$ORGANIZATION
REG_TOKEN=$REG_TOKEN
# USER_ID

pushd
cd ./ric-wrapper
npx aws-lambda-ric index.handler
popd

# cd /mnt/efs
# mkdir actions-runner
# cp -a /home/docker/actions-runner/. /mnt/efs/actions-runner
# cd /mnt/efs/actions-runner

# ./run.sh --once & wait $!
