interface RunnerInstance {
    '.credentials': {
        'scheme': string,
        'data': {
            'clientId': string,
            'authorizationUrl': string,
            'requireFipsCryptography': string
        }
    },
    '.credentials_rsaparams': {
        'd': string,
        'dp': string,
        'dq': string,
        'exponent': string,
        'inverseQ': string,
        'modulus': string,
        'p': string,
        'q': string
    },
    '.env': {},
    '.path': string,
    '.runner': {
        'agentId': number,
        'agentName': string,
        'poolId': number,
        'poolName': string,
        'serverUrl': string,
        'gitHubUrl': string,
        'workFolder': string
    }
}

export default RunnerInstance;
