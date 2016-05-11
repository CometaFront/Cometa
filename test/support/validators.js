'use strict';


var expect = require('chai').expect,
    validators = {
        user: user => {

            expect(user).to.be.an('object');
            expect(user.userId).to.be.a('string');
            expect(user.username).to.be.a('string');
            expect(user.avatar).to.be.a('string');

            expect(user.tally).to.be.an('object');
            expect(user.tally.asked).to.be.a('number');
            expect(user.tally.answered).to.be.a('number');

            if (user.dateOfBirth) {
                expect(user.dateOfBirth).to.be.a('number');
            }

            if (user.gender) {
                expect(user.gender).to.be.a('string');
            }
        },

        users: (users, options) => {

            expect(users).to.be.an('object');

            expect(users.before).to.be.a('string');
            expect(users.after).to.be.a('string');
            expect(users.data).to.be.an('array');
            expect(users.data.length).to.be.eql(options.expectedLength);

            users.data.forEach(user => {
                validators.user(user);
            });
        },

        question: question => {

            expect(question).to.be.an('object');

            expect(question.questionId).to.be.a('string');
            expect(question.question).to.be.a('string');

            expect(question.author).to.be.an('object');
            expect(question.author.username).to.be.a('string');
            expect(question.author.tally).to.be.an('object');
            expect(question.author.tally.answered).to.be.a('number');
            expect(question.author.tally.asked).to.be.a('number');

            expect(question.answers).to.be.an('object');
            expect(question.answers.yes).to.be.a('number');
            expect(question.answers.no).to.be.a('number');

            if (question.location) {
                expect(question.location).to.be.an('object');
                expect(question.location.lon).to.be.a('number');
                expect(question.location.lat).to.be.a('number');
            }
        },

        questions: questions => {

            expect(questions).to.be.an('object');

            expect(questions.before).to.be.a('string');
            expect(questions.after).to.be.a('string');
            expect(questions.data).to.be.an('array');
            expect(questions.data.length).to.be.eql(1);

            questions.data.forEach(question => {
                validators.question(question);
            });
        }
    };

module.exports = validators;
