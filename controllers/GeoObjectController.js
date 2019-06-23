const GeoObject = require('../models/GeoObjectModel');

//Simple version, without validation or sanitation

let cachedGeoObjects = null;


let clearCache = function () {
    cachedGeoObjects = null;
};

exports.getAll = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    //Do cached
    if (cachedGeoObjects !== null) {
        res.send(cachedGeoObjects);
        return;
    } 
    
  
    GeoObject.find().exec(function (err, products) {
    
        var transformedProducts = products.map(function (product) {
            return product.toJSON();
        });

        
        var json = JSON.stringify(transformedProducts)
        cachedGeoObjects = json;
        res.send(json);
        

    });
     
};

exports.getOne = function (req, res) {
   
    res.setHeader('Content-Type', 'application/json');
   
    GeoObject.findById(req.params['id']).exec(function (err, product) {
        return res.json(product);
    });
};

exports.findNear = function (req, res) {
    res.setHeader('Content-Type', 'application/json');


    let latitude = req.params['lat'];
    let longitude = req.params['lat'];
    // Max distance to search
    let maxDistance = 1000;
    if(req.params['distance'] !== 'undefined'){
        maxDistance = req.params['distance']
    }

    GeoObject.find({
        location: {
            $near: {
                $maxDistance: maxDistance,
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            }
        }
    }).exec(function (err, product) {
        return res.json(product);
    });
};

exports.addOne = function (req, res) {
    clearCache();
  
    res.setHeader('Content-Type', 'application/json');

    const geoObject = new GeoObject();
    geoObject.name = req.body.name;
    geoObject.age = req.body.age;

    geoObject.save(function (err) {
        console.error(err);
        if (err) {
            let errorResponse = {
                error: "Cannot add geo object",
                errorDetail: err.toString()
            };
            res.json(errorResponse);
        } else return res.json(geoObject);
    });   
};

exports.deleteOne = function (req, res) {
    clearCache();

    res.setHeader('Content-Type', 'application/json');
    GeoObject.findByIdAndDelete(req.params['id'], function (err) {
        console.error(err);
        if (err) {
            let errorResponse = {
                error: "Cannot delete geo object",
                errorDetail: err.toString()
            };
            res.json(errorResponse);
        } else return res.json({ status: 'OK' });
    });



};

exports.getGeoObjectByType = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    GeoObject.find({ 'type': req.params['type'] }).exec(function (err, products) {

        var transformedProducts = products.map(function (product) {
            return product.toJSON();
        });


        var json = JSON.stringify(transformedProducts);
        res.send(json);
    });
};


//Restore
exports.restoreProducts = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    clearCache();

    GeoObject.deleteMany({}, function (err) {
        if (err) {
            res.sendStatus(500).end();
            return;
        }
        restoreProductsTwo(req, res);
    });//Remove All
};

function restoreProductsTwo(req, res) {
    console.log('Product two');
    req.body.forEach(function (productModel) {
        productModel._id = productModel.id;
        delete productModel.id;

        //console.log(productModel);
        var product = new GeoObject(productModel);
        product.save(function (err) {
            if (err) {
                console.error(err);
                let errorResponse = {
                    error: "Cannot add product",
                    errorDetail: err.toString()
                };
                res.json(errorResponse);
            }
        });
    });

    res.sendStatus(200).end();
} 



