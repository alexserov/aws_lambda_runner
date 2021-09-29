#!/bin/bash

node --version
npm --version

ORGANIZATION=$ORGANIZATION
REG_TOKEN=$REG_TOKEN

cd /home/docker/actions-runner

./run.sh --once & wait $!
