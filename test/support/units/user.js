'use strict';

global.test.createdUsers = [];
let tools = require('../tools'),
    user = require('../factories/user'),
    validate = require('../validators'),
    loginUser = user => {

        return new Promise ((yes, no) => {

            tools.request({
                method: 'POST',
                path: '/users/auth',
                body: user
            }).then(yes).catch(no);
        });
    };

let fbToken = 'CAACEdEose0cBAOOPqT4juNGO3SiG8bbLtwhEhGsDhdZBBfH3fZBZBedeeasUsHuQpJOJiUOVoTsnKwoZAg9IJetjyyPlRufBaAGm19OSUOG9SeuCZBn5JRksKaQsp5LTB9347rNx5ZCPmJ7Y5UF1V4rcOiqt0tNih5CTpbkaA920fEUa2lGYUDqyJaFe40QqP3NWuNqf1udQZDZD',
    expiredToken = 'CAACEdEose0cBANoGk6Ax88Qf7vjKkZB5v3Arq7APsFtnet4ZAK2p9MYWJhPvHdXdCQ7fK6RBIlsTcCrxir70AMzk1tVIZCef6hfRsdhCh7ZCMqc06lDePbQ6OtCFpy8MIMOrJyXR6tDrmI66C0VMlPs0gDUMiojsyeZCiDfk9j6z137OAZC33MFgr7ayFKnZAFuZBMNpEG5PxAZDZD',
    fbFloro = 'CAACEdEose0cBANxUEzOGZCjhAlmTr29Rnpw2r4PU6dvElLj77FZCthvJaV8SHARvAmeXImPdUXm7y7A6T9JydHOm3O10tq6uZAqBvCZBRUNzpDpfaHlyRXA7zgzZBNfelxOKqhlYSQ1MTMKHXeCqfAn58z9T4l5vQuu15sDZBfpSxLE3l6npZBvDfQnnxmKD1jDJYWi1eepE1ffEpj5nQAk',
    fbTest = 'CAACEdEose0cBAOzW1ZBbyjvhvG2pcWoNHMZC5CZALGKshNbMDBn4X301B06ZCXb3oUJt08kcHmAnNJIZBpY4b6V6AaIzrOfXTbZCHNtW0aZAQiROphq2xtxdi36LhgQtRv3YgHu5ZCZBxfUKMpKR7PHuPg2DPOyTvMz9gUfDmdCPJyatDK8Cb2uoKFKUgLF78AyZC89mE0IQBSEPghfZC2hliNH';

module.exports = () => {

    describe('Status: 200', () => {

        it('Login (Me)', done => {

            loginUser({ email: 'people@senti.do', username: 'stefan', facebookToken: fbToken })
                .then(user => {
                    global.test.createdUsers.push(user);
                    done();
                })
                .catch(done);
        });

        it('Login (Floro)', done => {

            loginUser({ email: 'floro@senti.do', username: 'floro', facebookToken: fbFloro })
                .then(user => {
                    global.test.createdUsers.push(user);
                    done();
                })
                .catch(done);
        });

        it('Logout (Me)', done => {

            var request = tools.request({
                    method: 'DELETE',
                    path: '/users/auth',
                    session: global.test.createdUsers[0]
                });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Login (Me)', done => {

            loginUser({ facebookToken: fbToken })
                .then(user => {
                    global.test.createdUsers[0] = user;
                    done();
                })
                .catch(done);
        });

        it('Read (/users/me)', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/me',
                session: global.test.createdUsers[0]
            });

            request.then(user => {
                validate.user(user);
                done();
            }).catch(done);
        });

        it('Update', done => {

            let request = tools.request({
                method: 'PUT',
                path: '/users',
                session: global.test.createdUsers[0],
                body: {
                    dateOfBirth: null,
                    gender: 'female'
                }
            });

            request.then(user => {
                validate.user(user);
                done();
            }).catch(done);
        });

        it('Read (/users/{username})', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/floro',
                session: global.test.createdUsers[0]
            });

            request.then(user => {
                validate.user(user);
                done();
            }).catch(done);
        });

        it('Read settings', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/me/settings',
                session: global.test.createdUsers[0]
            });

            request.then(settings => {
                global.test.userSettings = settings;
                done();
            }).catch(done);
        });

        it('Update settings', done => {

            global.test.userSettings.notifications.email = false;
            global.test.userSettings.notifications.push = false;
            let request = tools.request({
                method: 'PUT',
                path: '/users/me/settings',
                body: global.test.userSettings,
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });

    describe('Status: 400', () => {

        it('Create account without email', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    username: 'peter',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account without username', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'another@senti.do',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account without token', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'another@senti.do',
                    username: 'peter'
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account with duplicate email', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    username: 'peter',
                    email: 'people@senti.do',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account with duplicate username', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'another@senti.do',
                    username: 'stefan',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account with wrong email format', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'wrong.email.format',
                    username: 'any.random.username',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Create account with wrong username format', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'another@senti.do',
                    username: 'bad',
                    facebookToken: fbTest
                },
                expectedStatusCode: 400
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });

    describe('Status: 403', () => {

        before(done => {
            // Second user. Needed for the second test to pass.
            let request = tools.request({
                method: 'DELETE',
                path: '/users/auth',
                session: global.test.createdUsers[1]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Login with invalid invalid token', done => {

            let request = tools.request({
                method: 'POST',
                path: '/users/auth',
                body: {
                    email: 'another@senti.do',
                    username: 'any.random.username',
                    facebookToken: expiredToken
                },
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Logout with invalid session', done => {
            let request = tools.request({
                method: 'DELETE',
                path: '/users/auth',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Read with invalid session (/users/me)', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/me',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Read with invalid session (/users/{username})', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/' + global.test.createdUsers[0].username,
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Update with invalid session', done => {

            let request = tools.request({
                method: 'PUT',
                path: '/users',
                session: global.test.createdUsers[1],
                body: {
                    about: 'I am the architect, as easy as that.',
                    website: null,
                    dateOfBirth: null,
                    name: {
                        first: null,
                        last: 'Aichholzer'
                    }
                },
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Delete with invalid session', done => {

            let request = tools.request({
                method: 'DELETE',
                path: '/users',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Read settings with invalid session', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/me/settings',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Update settings with invalid session', done => {

            let request = tools.request({
                method: 'PUT',
                path: '/users/me/settings',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });

    describe('Status: 404', () => {

        it('Read a non-existing user', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/you',
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Read another user\'s settings', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/' + global.test.createdUsers[1].username + '/settings',
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Update another user\'s settings', done => {

            let request = tools.request({
                method: 'PUT',
                path: '/users/' + global.test.createdUsers[1].username + '/settings',
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });
};
