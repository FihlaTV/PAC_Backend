var should = require('should');
var request = require('supertest');
var app = require('../mainTest');

describe('API', function () {

    var req, res;

    describe('/api/v2/note/save POST', function () {

        it('Save notes', (done) => {
            request(app)
                .post('/api/v2/note/save')
                .set('access-token', global.user1.apiaccesstoken)
                .send({
                    chatId: "3-" + global.room1._id,
                    note: "test"
                })
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('note');
                    res.body.data.note.should.have.property('_id');

                    done();
                });

        });
    });

    describe('/api/v2/note/list GET', function () {

        it('Load notes', (done) => {
            request(app)
                .get('/api/v2/note/list/' + "3-" + global.room1._id)
                .set('access-token', global.user1.apiaccesstoken)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;

                    res.body.should.have.property('data');
                    res.body.data.should.have.property('note');
                    res.body.data.note.should.have.property('_id');

                    done();
                });

        });
    });

});