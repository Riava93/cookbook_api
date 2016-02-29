var request = require('supertest');
var should = require('should');
var mongoose = require('mongoose');

describe('ROOT ROUTE TESTS', function() {
	var server;

	beforeEach(function(done) {
		delete require.cache[require.resolve('../../app')];
		server = require('../../app');
		done();
	});

	afterEach(function(done) {
		server.close(done);
	});

	it('should return a 200 status code at root', function testRootRoute(done) {
		request(server)
		.get('/')
		.expect(200, done);
	});
});
