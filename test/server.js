'use strict'
/*
 * Test purposes server.
 */
const Router = require('../Router.js');
const http = require('http');

class A {
  static test(req, m) {
    return {
      data: {
        "Frodio": "Hermo",
        "Rape":"BIOLONXELLO"
      }
    };
  }

  static prom(req, m){
    return new Promise((r, j) => {
      r({
        data: `<h1>Ello Dimitri</h1>
        <hr/>
        Adrigà`,
        head: {'Content-Type': 'text/html'}
      });
    });
  }

  static nFound(req, m) {
    return {
      data: `<h1>So ya xpecting yer index?</h1>`,
      head: {
        'Content-Type': 'text/html'
      },
      code: 333
    }
  }

}
Router.$("/hello", ['GET'], A.test);
Router.$("/found", A.nFound);
Router.$("/rape", ['GET'], A.prom);

Router.when("/yolo/(.+)", ['GET'], (req, res, m) => {
  res.end(`Ya gotcha said under GET: ${m[1]}`);
}).when("/yolo/(.+)", ['PUT'], (req, res, m) => {
  res.end(`So ya PUT this? ${m[1]}`);
}).finally((req, res) => {
  res.end("What do you see?");
})

http.createServer((a, b) => Router.listen(a, b)).listen(80);
