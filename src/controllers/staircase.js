'use strict';

const helpers = require('../helpers/utils');
const StaircaseLight = require('../modules/staircase-lighting/src/index');
const staircaseConfigJSONLocation = helpers.getFullPath('../models/staircase.json');
const staircaseConfigJSON = helpers.readJSONSync(staircaseConfigJSONLocation);
const staircaseLight = new StaircaseLight({
  animationMode: staircaseConfigJSON.animationMode || 'stairByStair',
  color: staircaseConfigJSON.color || '#ffffff',
  direction: staircaseConfigJSON.direction || 'bottomToTop',
  workMode: staircaseConfigJSON.workMode || 'off'
});

helpers.saveStaircaseConfiguration(staircaseConfigJSONLocation, staircaseLight);

const staircaseController = function () {
  const get = function (req, res) {
    res.json(helpers.readJSONSync(staircaseConfigJSONLocation));
  };

  const post = function (req, res) {
    let parameters = req.body && req.body.message;
    let animationMode;
    let workMode;

    console.log(new Date(), parameters);

    if (typeof parameters === 'string') {
      parameters = JSON.parse(parameters);
    }
    
    if (parameters.animationMode) {
      animationMode = parameters.animationMode.trim();
      staircaseLight.animationMode = animationMode;
    }

    if (parameters.color) {
      staircaseLight.color = parameters.color.trim();
    }

    if (parameters.direction) {
      staircaseLight.direction = helpers.RegularFormToCamelCase(parameters.direction);
    }

    if (parameters.workMode) {
      workMode = parameters.workMode.trim();

      staircaseLight.workMode = workMode;
    }

    staircaseLight.start();

    helpers.saveStaircaseConfiguration(staircaseConfigJSONLocation, staircaseLight, function (responce) {
      res.json({
        message: responce.status
      });
    });
  };

  return {
    get: get,
    post: post
  }
};

module.exports = staircaseController;
