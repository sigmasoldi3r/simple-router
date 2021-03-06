'use strict'
/**
* Simplistic Routing Module
* NodeJS Regular expression routing.
* ---
* Argochamber Interactive 2016
* by Pablo 'sigmasoldier' Blanco Celdrán
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

/**
 * Standard chaining Route.
 * The callback is called as is.
 */
class Route {

  constructor(regex, allow, callback){
    this.allowedMethods = allow;
    this.callback = callback;
    if (typeof regex === "string") {
      this.regex = RegExp(`^${regex}$`);
    } else if (regex instanceof RegExp){
      this.regex = regex;
    } else {
      throw new Error("The route must be a regular expression or a string!");
    }
  }

  fire(req, res) {
    const m = req.url.match(this.regex);
    this.callback(req, res, m);
  }

}

/**
 * This is used when you want to hook up a class method or an external function
 * with this (Basically the hook guesses what to return in the response using
 * what the function/method returns).
 */
class Hook extends Route {

  constructor(regex, allow, callback){
    super(regex, allow, callback);
  }

  /**
   * Processes a return from a hook.
   * @param {Object} r Response.
   * @param {Request} req
   * @param {Response} res
   */
  static processReturn(r, req, res){
    if (typeof r === 'object'){
      let code = r.code || 200;
      let head = r.head || {'Content-Type': 'plain/text'};
      let data = r.data;
      let type = typeof data;
      if (type === 'undefined') {
        res.writeHead(code, head);
        res.end();
      } else if (type === 'object') {
        head['Content-Type'] = 'application/json';
        res.writeHead(code, head);
        res.write(JSON.stringify(data));
        res.end();
      } else {
        res.writeHead(code, head);
        res.write(data);
        res.end();
      }
    } else {
      res.end(r);
    }
  }

  /**
   * Fires the hook.
   * @param {Request} req
   * @param {Response} res
   */
  fire(req, res) {
    const m = req.url.match(this.regex);
    const r = this.callback(req, m);
    if (r instanceof Promise) {
      r.then((data) => {
        Hook.processReturn(data, req, res);
      });
    } else {
      Hook.processReturn(r, req, res);
    }
  }

}

/**
 * The router module grants you a routing system using regexp.
 * Is like using if ... else if ... else with regexp.
 */
class Router {

 constructor(){
   this.__routes = [];
   this.__final = () => {};
 }

 /**
  * Called when the router wants to handle an incoming connection.
  * If a route is matched, the callback is fired. As this simple.
  * @param {RegExp} regex
  * @param {Array} optMode Optional
  * @param {Function} callback
  */
 when(regex, optMode, callback) {
   if (typeof callback === 'undefined') {
     let route = new Route(regex, [], optMode);
     this.__routes.push(route);
     return this;
   } else {
     let route = new Route(regex, optMode, callback);
     this.__routes.push(route);
     return this;
   }
 };

 /**
  * This will register a new hook.
  * @param {RegExp} regex
  * @param {Array} optMode Optional
  * @param {Function} callback
  */
 hook(regex, optMode, callback) {
   if (typeof callback === 'undefined') {
     let route = new Hook(regex, [], optMode);
     this.__routes.push(route);
     return this;
   } else {
     let route = new Hook(regex, optMode, callback);
     this.__routes.push(route);
     return this;
   }
 };

 /**
  * Syntactic sugar for Router.hook(...);
  * @param {RegExp} r
  * @param {Array} o Optional
  * @param {Function} c
  */
 $(r, o, c){
   this.hook(r, o, c);
 }

 /**
  * This is called if noone of the when routes has been matched.
  * @param {Function} handler
  */
 finally(handler) {
   this.__final = handler;
 };

 /**
  * Sugar for finally.
  * @param {Function} handler
  */
 final(handler){
   this.finally(handler);
 }


 /**
  * This applies all the registered routes to the incoming request.
  * @param {Request} req
  * @param {Response} res
  */
  listen(req, res) {
    let m = false;
    this.__routes.forEach((r) => {
      if (!m) {
        let test = r.regex.test(req.url);
        let noSize = r.allowedMethods.length === 0;
        if (test && noSize){
          m = true;
          r.fire(req, res);
        } else if (test && r.allowedMethods.some((m) => m === req.method)) {
          m = true;
          r.fire(req, res);
        }
      }
    });
    if (!m) {
      this.__final(req, res);
    }
  }

};

//Expose the module.
module.exports = new Router();
