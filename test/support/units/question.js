'use strict';


global.test.createdQuestions = [];
let tools = require('../tools'),
    question = require('../factories/question'),
    validate = require('../validators'),
    createQuestions = (quantity, done, inputQuestion, expectedStatusCode) => {

        let questionIndex = 0,
            createQuestion = () => {

                let fakeQuestion = question.build();
                fakeQuestion.location.lon = parseInt(fakeQuestion.location.lon);
                fakeQuestion.location.lat = parseInt(fakeQuestion.location.lat);

                tools.request({
                        method: 'POST',
                        path: '/questions',
                        body: fakeQuestion,
                        session: global.test.createdUsers[0],
                        expectedStatusCode: expectedStatusCode || 200
                    })
                    .then(question => {
                        global.test.createdQuestions.push(question);

                        questionIndex += 1;
                        if (questionIndex < quantity) {
                            return createQuestion();
                        }

                        done();
                    }).catch(done);
            };

        createQuestion();
    };

module.exports = () => {

    describe('Status: 200', () => {

        it('Create (two)', done => {
            createQuestions(2, done);
        });

        it('Delete', done => {

            let request = tools.request({
                method: 'DELETE',
                path: '/questions/' + global.test.createdQuestions[1].questionId,
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Answer (yes)', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/answer',
                body: {
                    value: 'yes'
                },
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Answer (no)', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/answer',
                body: {
                    value: 'no',
                    location: {
                        lon: -91,
                        lat: 63
                    }
                },
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Hilarious (yes)', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/hilarious',
                body: {
                    value: 'yes',
                    location: {
                        lon: 23,
                        lat: 32
                    }
                },
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Hilarious (no)', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/hilarious',
                body: {
                    value: 'no',
                    location: {
                        lon: -91,
                        lat: 63
                    }
                },
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('All questions', done => {

            let request = tools.request({
                method: 'GET',
                path: '/questions',
                session: global.test.createdUsers[0]
            });

            request.then(questions => {
                validate.questions(questions);
                done();
            }).catch(done);
        });

        it('Report', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/report',
                body: {
                    location: {
                        lon: 23,
                        lat: 32
                    }
                },
                session: global.test.createdUsers[0]
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('All questions (by user)', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/stefan/questions',
                session: global.test.createdUsers[0]
            });

            request.then(questions => {
                validate.questions(questions);
                done();
            }).catch(done);
        });
    });

    describe('Status: 401', () => {

    });

    describe('Status: 403', () => {

        it('Create with invalid session', done => {

            let request = tools.request({
                method: 'PUT',
                path: '/questions',
                body: {},
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Set hilarity with invalid session', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/hilarious',
                body: {
                    value: 'yes',
                    location: {
                        lon: 23,
                        lat: 32
                    }
                },
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Read with invalid session', done => {

            let request = tools.request({
                method: 'GET',
                path: '/questions/' + global.test.createdQuestions[0].questionId,
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Report with invalid session', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[0].questionId + '/report',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('All questions (by user) with invalid session', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/' + global.test.createdUsers[0].username + '/questions',
                session: global.test.createdUsers[1],
                expectedStatusCode: 403
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });

    describe('Status: 404', () => {

        it('Delete a non-existing question', done => {

            let request = tools.request({
                method: 'DELETE',
                path: '/questions/' + global.test.createdQuestions[1].questionId,
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Set hilarity on non-existing question', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[1].questionId + '/hilarious',
                body: {
                    value: 'yes',
                    location: {
                        lon: 23,
                        lat: 32
                    }
                },
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('Report a non-existing question', done => {

            let request = tools.request({
                method: 'POST',
                path: '/questions/' + global.test.createdQuestions[1].questionId + '/report',
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

        it('All questions (by non-existing user)', done => {

            let request = tools.request({
                method: 'GET',
                path: '/users/i.am.evenflow/questions',
                session: global.test.createdUsers[0],
                expectedStatusCode: 404
            });

            request.then(() => {
                done();
            }).catch(done);
        });

    });
};
