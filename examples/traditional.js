'use strict'
/*
 * This example demonstrates the traditional way using whens.
 */

//Assume that we've previously loaded router with global.Router = require('Router');
Router.when("/hello", (req, res, match) => {

  res.end(`Hey mister! Method: ${req.method}`);

}).when("/lol", ['GET'], (req, res, match) => {

  res.end("Lol & Get!");

}).when("/lol", ['PUT'], (req, res, match) => {

  res.end("Lol & Put...");

}).finally((req, res) => {

  res.end("Ok, dunno what ya mean with diz.");

});
