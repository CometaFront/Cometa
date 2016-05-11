'use strict';


let tools = require('../tools'),
    expect = require('chai').expect;

module.exports = () => {

    it('Should return a timestamp', done => {

        tools.request({ method: 'GET', path: '/time' }).then(response => {
            expect(response).to.be.an('object');
            expect(response.time).to.be.a('number');
            done();
        }).catch(done);
    });
};
