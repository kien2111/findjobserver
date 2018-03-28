var express = require('express');
var route = express.Router();
var controller = require('../controller/imageController');
route.get('*',controller.serveImage);
module.exports = route;