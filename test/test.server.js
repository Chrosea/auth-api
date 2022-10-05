const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const mongoose = require("mongoose");

const server = require('../server');

var User = require("../models/User");
const Role = require('../models/Role');


chai.use(chaiHttp);

describe('auth API', function () {
    const testUser = {
        'username': 'Jotaro Kujo',
        'password': 'tester'
    }

    const testRole = { value: 'new-role' }

    this.afterAll(function (done) {
        User.findOneAndRemove({ username: testUser.username })
            .catch(function () {
                console.warn(' collection may not exists!');
            })
        Role.findOneAndRemove({ value: testRole.value })
            .catch(function () {
                console.warn(' collection may not exists!');
            })
        done();
    });

    it('should Register user, login user', function (done) {
        chai.request(server)
            .post('/signup')
            .send(testUser)
            .end((err, res) => {
                res.should.have.status(201);
                chai.request(server)
                    .post('/login')
                    .send(testUser)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('data');
                        res.body.should.have.property('accessToken');
                        res.body.data.username.should.equal('Jotaro Kujo');
                        done();
                    })
            })
    });

    it('should not login non-registered user', function (done) {
        const testUser2 = {
            'username': 'Dio Brando',
            'password': 'hacker'
        }

        chai.request(server)
            .post('/login')
            .send(testUser2)
            .end((err, res) => {
                res.should.have.status(403);
                chai.expect(res.error.text).to.includes('Error: Username does not exist');
                done();
            })
    });

    it('should add new role', function (done) {
        chai.request(server)
            .post('/role/create')
            .send({ value: 'new-role' })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            })

    })

    /* TODO
     * Each API route should have its own unit test as well.
     * Edge cases like intentional error triggering case needs to be add.
     */
});


