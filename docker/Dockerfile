# base
FROM ubuntu:20.04

#use bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Include global arg in this stage of the build
ARG FUNCTION_DIR="/function"
# Create function directory
RUN mkdir -p ${FUNCTION_DIR}

# set the github runner version
ARG DEBIAN_FRONTEND=noninteractive

# update the base packages
RUN apt-get update -y && apt-get upgrade -y

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        g++ \
        make \
        cmake \
        unzip \
        libcurl4-openssl-dev \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget \
        jq \
        libffi-dev \
        python3 \
        python3-venv \
        python3-dev \
        p7zip-full \
        autoconf \
        libtool \
        automake \
        mc \
    && rm -rf /var/lib/apt/lists/*

# Node
RUN curl -L https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN npm i -g npm@6
RUN npm cache clean --force
RUN npm set progress=false
RUN npm set loglevel=error
RUN npm set unsafe-perm=true
RUN npm set fetch-retries 5
RUN npm set audit false
RUN npm set fund false

# cd into the user directory, download and unzip the github actions runner
RUN RUNNER_VERSION=$(curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/actions/runner/releases/latest | jq -r .name) \
    && cd ${FUNCTION_DIR} && mkdir actions-runner && cd actions-runner \
    && curl -O -L https://github.com/actions/runner/releases/download/${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION:1}.tar.gz \
    && tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION:1}.tar.gz

# copy over the start.sh script
COPY app-slow/ ${FUNCTION_DIR}/

# install some additional dependencies
RUN mkdir -p /mnt/efs
RUN chmod -R 777 /mnt/efs

RUN cd ${FUNCTION_DIR} && cd ./ric-wrapper && npm install

COPY app-fast/ ${FUNCTION_DIR}/
# make the script executable
RUN cd ${FUNCTION_DIR} && chmod +x start.sh

WORKDIR ${FUNCTION_DIR}

# set the entrypoint to the start.sh script
ENTRYPOINT ["./start.sh"]
