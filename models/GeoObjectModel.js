const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const polygonSchema = new mongoose.Schema({
    type: {type: String, enum: ['Polygon'], required: true},
    coordinates: {type: [[[Number]]], required: true}
});

const pointSchema = new mongoose.Schema({
    type: {type: String, enum: ['Point'], required: true},
    coordinates: {type: [Number], required: true}
});

let GeoObjectSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: false},
    type: {type: String, required: true},
    location: {type: pointSchema, required: true}
}, {collection: 'geo_object'});
GeoObjectSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret._class;
    }
});

GeoObjectSchema.index({ location: "2dsphere" });

// Export the models
module.exports = mongoose.model('GeoObject', GeoObjectSchema);