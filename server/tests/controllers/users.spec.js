var should = require('should');
var request = require('supertest');
var expect = require('chai').expect;
var User = require('../../models/user');
var mongoose = require('mongoose');

if (mongoose.connection.db) {
	mongoose.connection.close();
}

describe('USERS CONTROLLER', function() {
	var server;
	beforeEach(function(done) {
		delete require.cache[require.resolve('../../app')];
		server = require('../../app');
		done();
	});

	afterEach(function(done) {
		if (mongoose.connection.db) {
			User.remove({}, function(err) {
				if (err) throw err;
			});
		}
		server.close(done);
	});

	//POST CREATE USER TESTS

	it('should create a new user', function(done) {
		var userDetails = {
			username: 'testing_user',
			email: 'testing@example.com',
			pwdString: 'somePasswordString'
		};

		request(server)
		.post('/api/users')
		.set('Accept', 'application/json')
		.send(userDetails)
		.expect(200)
		.end(function(err, res) {
			expect(res.body.user).to.be.a('object');
			done();
		});
	});

	it('should not create user with bad credentials', function(done) {
		var userDetails = {
			email: "IhateUsernames@gmail.com",
			pwdString: "no"
		};

		request(server)
		.post('/api/users')
		.set('Accept', 'application/json')
		.send(userDetails)
		.expect('Content-Type', /json/)
		.expect(400)
		.end(function(err, res) {
			if (err) throw err;
			expect(res.body.message).to.equal('failed');
			done();
		});
	});

	it('should not create a user without a pwdString', function(done) {
		var userDetails = {
			username: 'test',
			email: 'test@test.test'
		};

		request(server)
		.post('/api/users')
		.set('Accept', 'application/json')
		.send(userDetails)
		.expect('Content-Type', /json/)
		.expect(400)
		.end(function(err, res) {
			if (err) throw err;
			expect(res.body.message).to.equal('Missing Required Data');
			done();
		});
	});

	// SINGLE USER RESOURCE TESTS

	it('should return a user object', function testGetUser(done) {
		//Create user
		var userDetails = {
			username: 'testing_user',
			email: 'testing@example.com',
			pwdString: 'somePasswordString'
		};

		request(server)
		.post('/api/users')
		.set('Accept', 'application/json')
		.send(userDetails)
		.expect(200)
		.end(function(err, res) {
			if (err) throw err;

			//Get user
			request(server)
			.get('/api/users/' + res.body.user._id)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) throw err;
				expect(res.body.username).to.equal(userDetails.username);
				expect(res.body.email).to.equal(userDetails.email);
				expect(res.body.passwordHash).to.equal(undefined);
				done();
			});
		});
	});

	it('should return 404 if no user found', function testUser404(done) {
		//GET user
		request(server)
		.get('/api/users/notarealuser')
		.expect(404)
		.end(function(err, res) {
			if (err) throw err;
			done();
		});
	});

	it('should remove user record from database', function testRemoveUser(done) {
		//Create user
		var userDetails = {
			username: "coolio",
			email: "cool@cool.cool",
			pwdString: 'coolcool'
		};

		request(server)
		.post('/api/users')
		.set('Accept', 'application/json')
		.send(userDetails)
		.expect(200)
		.end(function(err, res) {
			if (err) throw err;

			request(server)
			.delete('/api/users/' + res.body.user._id)
			.expect(200)
			.end(function(err, res) {
				done();
			});
		});
	});
});
