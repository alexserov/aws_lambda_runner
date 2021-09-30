#!/bin/sh

#####PREREQISITES#####
# PACKAGES
# - docker
# - awscli
# VARIABLES
# AWS_ACCOUNT_ID
# AWS_REGION

#globals
REPO_NAME=devextreme-lambda

#helpers
log() {
    CHALK_PURPLE='\033[0;35m'
    CHALK_NC='\033[0m' # No Color
    echo ${CHALK_PURPLE}[$(date +"%T")] $1${CHALK_NC}
}
err() {
    CHALK_PURPLE='\033[0;31m'
    CHALK_NC='\033[0m' # No Color
    echo ${CHALK_PURPLE}[$(date +"%T")] ERR: $1${CHALK_NC}
}
checkEnv() {
    if [ -z $(eval "echo \"\$$1\"") ]; then
        ERROR_NOENV=true
        err "$1 not set"
    fi
}

#validation
checkEnv AWS_ACCOUNT_ID
checkEnv AWS_REGION
if [ $ERROR_NOENV ]; then exit 1; fi

if [ $(aws configure list | awk 'NR==4 {print $2}') = "<not" ]; then
    err "AWS not configured; run 'sudo aws configuge'"
fi

#action
if [ -z $(pidof dockerd) ]; then
    KILL_DAEMON=true
    log "Starting Docker..."
    dockerd --dns 8.8.8.8 --max-concurrent-uploads 1 > dockerd.log 2>&1 &
    while (! docker stats --no-stream > /dev/null 2>&1 ); do
        sleep 1
    done
    sleep 1
    log "Docker started"
fi

unset all_proxy

log "Building image"
docker build -t ${REPO_NAME} ./../docker
log "Logging in"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
log "Checking repository"
aws ecr create-repository --repository-name ${REPO_NAME} --image-scanning-configuration scanOnPush=true --region ${AWS_REGION}
log "Pushing image"
docker tag ${REPO_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:latest
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}:latest

if [ $KILL_DAEMON ]; then
    kill $(pidof dockerd)
    log "Docker killed"
fi
