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

    it('should not login non-registered user', function () {
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
            })
    });

    it('should add new role', function () {
        chai.request(server)
            .post('/role/create')
            .send({ value: 'new-role' })
            .end((err, res) => {
                res.should.have.status(201);
            })

    })

    it('should assign role to user', () => {
        return Role.findOne(testRole)
            .then(assignedRole => {
                console.log(testUser.username);
                return User.findOne({ username: testUser.username })
                    .then(user => {
                        chai.request(server)
                            .post(`/user/assign/${user._id.toString()}/${assignedRole._id.toString()}`)
                            .end((err, res) => {
                                const { data, message } = res.body
                                const { username, role } = data;
                                res.should.have.status(201);
                                username.should.equals(testUser.username);
                                chai.expect(role).to.include.members([assignedRole.value]);
                                message.should.equals('Role has been updated');
                            })
                    })
            })
    })

    it('should not assign role to user', () => {
        return Role.findOne(testRole)
            .then(assignedRole => {
                return User.findOne({ username: testUser.username })
                    .then(user => {
                        chai.request(server)
                            .post(`/user/assign/${user._id.toString()}/${assignedRole._id.toString()}`)
                            .end((err, res) => {
                                res.should.have.status(500);
                                chai.expect(res.error.text).to.includes('Role already been assigned');
                            })
                    })
            })
    })

    it('should delete role', () => {
        return Role.findOne(testRole)
            .then(result => {
                chai.request(server)
                    .delete(`/role/${result._id.toString()}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.equals('Role has been deleted');
                    })
            })

    })

    it('should delete user', () => {
        return User.findOne({ username: testUser.username })
            .then(result => {
                chai.request(server)
                    .delete(`/user/${result._id.toString()}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.equals('User has been deleted');
                    })
            })

    })

    /* TODO
     * Each API route should have its own unit test as well.
     * Edge cases like intentional error triggering case needs to be add.
     */
});


