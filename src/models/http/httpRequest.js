'use strict';

var Q = require('q'),
    url = require('url');

function createTestRequest () {
    return {
        requestFrom: '',
        method: 'GET',
        path: '/',
        query: {},
        headers: {},
        body: ''
    };
}

function transform (request) {
    var parts = url.parse(request.url, true);
    return {
        requestFrom: request.socket.remoteAddress + ':' + request.socket.remotePort,
        method: request.method,
        path: parts.pathname,
        query: parts.query,
        headers: request.headers,
        body: request.body
    };
}

function createFrom (request) {
    var deferred = Q.defer();
    request.body = '';
    request.setEncoding('utf8');
    request.on('data', function (chunk) { request.body += chunk; });
    request.on('end', function () { deferred.resolve(transform(request)); });
    return deferred.promise;
}

module.exports = {
    createTestRequest: createTestRequest,
    createFrom: createFrom
};