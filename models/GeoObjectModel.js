const mongoose = require('mongoose');
const mexp = require('mongoose-elasticsearch-xp');
const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({host: 'localhost:9200'});

const Schema = mongoose.Schema;

const polygonSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required: false},
    type: {type: String, enum: ['Polygon'], required: true},
    coordinates: {type: [[[Number]]], required: true}
});

const pointSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required: false},
    type: {type: String, enum: ['Point'], required: true},
    coordinates: {type: [Number], required: true, es_type: 'geo_point'}
});

let GeoObjectSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: false},
    type: {type: String, required: true, es_indexed: true},
    location: {type: pointSchema, required: true, es_indexed: true}
}, {collection: 'geo_object'});
GeoObjectSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret._class;
    }
});

GeoObjectSchema.index({location: "2dsphere"});

// Add support for elastic-search
GeoObjectSchema.plugin(mexp, {
    client: esClient
});

// Export the models
const geoObjectSchema = mongoose.model('GeoObject', GeoObjectSchema);
module.exports = geoObjectSchema;

//Synchronize with ES
geoObjectSchema.on('es-bulk-sent', function () {
    console.log('buffer sent');
});

geoObjectSchema.on('es-bulk-data', function (doc) {
    console.log('Adding ' + doc);
});

geoObjectSchema.on('es-bulk-error', function (err) {
    console.error(err);
});

geoObjectSchema
    .esSynchronize()
    .then(function () {
        console.log('end.');
    });