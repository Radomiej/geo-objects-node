'use strict';
const express = require('express');
const router = express.Router();
const geoObjectController = require('../controllers/GeoObjectController');

/* GET geo objects listing. */
router.get('/', geoObjectController.getAll);

router.get('/byId/:id', geoObjectController.getOne);

/* GET near geo objects. */
router.get('/near/:lat/:lon/:distance', geoObjectController.findNear);

/* POST products listing. */
router.post('/', geoObjectController.addOne);

/* PUT products listing. */
router.put('/', geoObjectController.addOne);

/* DELETE products listing. */
router.delete('/:id', geoObjectController.deleteOne);

/* PUT products listing. */
router.put('/restore', geoObjectController.restoreProducts);


module.exports = router;
