const express = require('express');
const { httpGetAllPlanets } = require('./plantes.controller');
const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;