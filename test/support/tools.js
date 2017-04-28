'use strict';


let apiURL = process.env.URL_API,
    async = require('async'),
    mongodb = require('mongodb'),
    config = require('../../app/core/config'),
    request = require('./request')(apiURL),
    tools = {

        db: {
            setup: () => {

                return new Promise((yes, no) => {

                    mongodb.MongoClient.connect(config.mongo.url, (err, connection) => {
                        if (err) {
                            return no('Error on DB connection');
                        }

                        console.log();
                        console.log('  ✓ Connected to database.');
                        tools.dbConnection = connection;
                        yes(tools.db.dropDatabase);
                    });
                });
            },

            dropDatabase: () => {

                return new Promise((yes, no) => {
                    let retryCount = 0;

                    function dropDb() {
                        tools.dbConnection.dropDatabase(error => {
                            if (error && error.code === 12586) {

                                retryCount += 1;

                                if (retryCount < 10) {
                                    console.info('Waiting 1 second for mongodb background processes to finish');
                                    return setTimeout(dropDb, 1000);
                                }
                            } else if (error) {
                                return no(error);
                            }

                            console.log('  ✓ Dropped database.');
                            yes(tools.db.buildIndexes);
                        });
                    }

                    dropDb();
                });
            },

            buildIndexes: () => {

                return new Promise ((yes, no) => {
                    let dbIndexes = require('./dbIndexes.json');
                    async.each(dbIndexes, (record, eachCallback) => {

                        tools.dbConnection.collection(record.collection, (err, collection) => {
                            record.indexes.forEach(index => {
                                var field = {},
                                    unique = {
                                        unique: index.unique || false
                                    };

                                if (Array.isArray(index.field)) {
                                    index.field.forEach(innerField => {
                                        field[innerField] = index.type || 1;
                                    });
                                } else {
                                    field[index.field] = index.type || 1;
                                }

                                collection.createIndex(field, unique);
                            });

                            setTimeout(() => {
                                eachCallback();
                            }, 1000);
                        });

                    }, err => {
                        if (err) {
                            return no(err);
                        }

                        console.log('  ✓ Rebuilt indexes.');
                        console.log();
                        process.nextTick(() => {
                            yes();
                        });
                    });
                });
            },

            readRecord: (query, collection) => {

                return new Promise ((yes, no) => {
                    tools.dbConnection.collection(collection, (err, collection) => {
                        collection.find(query).toArray((error, data) => {
                            if (error) {
                                return no(error);
                            }

                            yes(data);
                        });
                    });
                });
            },

            objectId: id => new mongodb.ObjectID(id)
        },

        request: request
    };

module.exports = tools;
