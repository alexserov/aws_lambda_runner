# base
FROM ubuntu:20.04

#use bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# set the github runner version
ARG DEBIAN_FRONTEND=noninteractive

# update the base packages and add a non-sudo user
RUN apt-get update -y && apt-get upgrade -y && useradd -m docker

# install python and the packages the your code depends on along with jq so we can parse JSON
# add additional packages as necessary
# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
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
    && cd /home/docker && mkdir actions-runner && cd actions-runner \
    && curl -O -L https://github.com/actions/runner/releases/download/${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION:1}.tar.gz \
    && tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION:1}.tar.gz

# install some additional dependencies
RUN chown -R docker ~docker && /home/docker/actions-runner/bin/installdependencies.sh
RUN mkdir -p /opt/runner/meta
RUN chown -R docker /opt/runner/meta

RUN apt-get install mc -y

# copy over the start.sh script
COPY start.sh start.sh

# make the script executable
RUN chmod +x start.sh

# since the config and run script for actions are not allowed to be run by root,
# set the user to "docker" so all subsequent commands are run as the docker user
USER docker

# set the entrypoint to the start.sh script
ENTRYPOINT ["./start.sh"]
