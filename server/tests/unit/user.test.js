const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const server = require('../../server');  // Adjust path accordingly
const { User, Group } = require('../../models');  // Adjust path accordingly

chai.use(chaiHttp);

describe('User and Group API Routes', () => {
    let userMock;
    let groupMock;
    
    const userData = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        roles: ['User'],
        groups: []
    };

    beforeEach(() => {
        userMock = sinon.mock(User);
        groupMock = sinon.mock(Group);
    });

    afterEach(() => {
        userMock.restore();
        groupMock.restore();
    });

    describe('GET /api/users', () => {
        it('should return all users', (done) => {
            userMock
                .expects('find')
                .withArgs({}, '-password')
                .resolves([userData]);

            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('username', userData.username);
                    userMock.verify();
                    done();
                });
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', (done) => {
            userMock
                .expects('findOne')
                .withArgs({ username: userData.username })
                .resolves(null);

            userMock
                .expects('create')
                .withArgs(sinon.match(userData))
                .resolves(userData);

            chai.request(server)
                .post('/api/users')
                .send(userData)
                .end((err, res) => {
                    expect(res.status).to.equal(200);  // Assuming 200 status code for user creation
                    expect(res.body).to.have.property('message', `User created successfully with role User.`);
                    userMock.verify();
                    done();
                });
        });
    });

    describe('DELETE /api/users/:userId', () => {
        it('should delete an existing user', (done) => {
            userMock
                .expects('findById')
                .withArgs(sinon.match.string)
                .resolves(userData);

            userMock
                .expects('findByIdAndDelete')
                .withArgs(sinon.match.string)
                .resolves({ message: 'User deleted successfully.' });

            chai.request(server)
                .delete(`/api/users/${userData._id}`)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message', 'User deleted successfully.');
                    userMock.verify();
                    done();
                });
        });
    });
});
