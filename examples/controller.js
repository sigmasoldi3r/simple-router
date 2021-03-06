'use strict'
/*
 * Example of how to use the Router with a controller class.
 */

//Assume that we've previously loaded router with global.Router = require('Router');
class Controller {

  //Example of hooking inside an instance.
  constructor(name) {
    this.name = name;
    Router.$("/supah", this.heyHow);
  }

  //You may also use object's instances, if wanted.
  heyHow(req, match) {
    return {
      code: 200,
      data: `I'm a supah controller named '${this.name}'`,
      head: {
        'Content-Type': 'text/html'
      }
    };
  }

  //@route("/wellcome") Equivalent.
  static wellcome(req, match){
    return "Wellcome to the server!";
  }

}
Router.$("/wellcome", Controller.wellcome);
//This is static routing.
