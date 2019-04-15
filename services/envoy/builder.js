'use strict';

const _ = require('lodash');

module.exports = {
    name: 'envoy',
    config: {
        version: 'latest',
        supported: ['latest'],
        configFile: 'envoy.yaml',
    },
    parent: '_service',
    builder: (parent, config) => class LandoEnvoy extends parent {
        constructor(id, options = {}) {
            options = _.merge({}, config, options);
            const envoy = {
                image: 'envoyproxy/envoy-dev:latest',
                command: '/usr/local/bin/envoy -c /etc/envoy/envoy.yaml --service-cluster front-proxy --log-level debug',
                // Internal ports
                expose: ['9901', '10000'],
                ports: [
                    '9901',
                    '10000',
                ],
                volumes: [
                    // Mount the users config file.
                    `${options.root}/${options.configFile}:/etc/envoy/envoy.yaml`,
                ],
            };

            // Send it downstream
            super(id, options, {services: _.set({}, options.name, envoy)});
        };
    },
};
