const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const server = require('../../server');  // Adjust path accordingly to match your project structure
const { User } = require('../../models');  // Adjust path accordingly to match your project structure

chai.use(chaiHttp);

describe('Authentication API Routes', () => {
    let userMock;
    const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com'
    };

    beforeEach(() => {
        userMock = sinon.mock(User);
    });

    afterEach(() => {
        userMock.restore();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', (done) => {
            userMock
                .expects('findOne')
                .withArgs({ username: userData.username })
                .resolves(null);

            userMock
                .expects('create')
                .withArgs(userData)
                .resolves(userData);

            chai.request(server)
                .post('/api/auth/register')
                .send(userData)
                .end((err, res) => {
                    if (err) {
                        console.log("Error:", err);
                    }
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message', 'User registered successfully.');
                    userMock.verify();
                    done();
                });
        });

        it('should return 400 if username already exists', (done) => {
            userMock
                .expects('findOne')
                .withArgs({ username: userData.username })
                .resolves(userData);

            chai.request(server)
                .post('/api/auth/register')
                .send(userData)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message', 'Username already exists.');
                    userMock.verify();
                    done();
                });
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', (done) => {
            userMock
                .expects('findOne')
                .withArgs({ username: userData.username, password: userData.password })
                .resolves(userData);

            chai.request(server)
                .post('/api/auth/login')
                .send({
                    username: userData.username,
                    password: userData.password
                })
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).not.to.have.property('password');
                    userMock.verify();
                    done();
                });
        });

        it('should return 400 if username or password is invalid', (done) => {
            userMock
                .expects('findOne')
                .withArgs({ username: userData.username, password: userData.password })
                .resolves(null);

            chai.request(server)
                .post('/api/auth/login')
                .send({
                    username: userData.username,
                    password: userData.password
                })
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('message', 'Invalid username or password.');
                    userMock.verify();
                    done();
                });
        });
    });
});
