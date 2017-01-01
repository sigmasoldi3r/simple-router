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
* This is an atomic hanler.
* Those store simple data as the callback.
*/
class Route {

  constructor(regex, callback){
    this.callback = callback;
    this.regex = regex;
    this.children = [];
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
   this.__topWhen = null;
 }

 /**
  * Called when the router wants to handle an incoming connection.
  * When specify blocking routes.
  * That means that if the next callback is not a 'if' the regular expression
  * is not even tested.
  */
 when(regex, callback) {
   let route = new Route(regex, callback);
   this.__topWhen = route;
   this.__routes.push(route);
   return this;
 };

 /**
  * This will get the last when that has been added to the chain.
  */
 getTopWhen() {
   return this.__topWhen;
 }

 /**
  * Those are tested even if the previous regex was true.
  * Must be chained after a '.when(...)' call.
  */
 also (regex, callback) {
   let top = this.getTopWhen();
   if (top === null) throw new Exception("An 'also()' must be chained after a 'when()'! Saw .also(...) but no preceding .when(...)");
   top.children.push(new Route(regex, callback));
   return this;
 };

 /**
  * This is called if noone of the when routes has been matched.
  */
 final(handler) {
   this.__final = handler;
 };

 /**
  * This function returns the first matching '.when()' or the '.final()' if no
  * matching route found.
  */
  getMatchingRoute(url){
    for (let route of this.__routes){
      if (route.regex.test(url))
        return {callback: route.callback, regex: route.regex, children: route.children};
    }
    return {callback: this.__final, children: []};
 }

 /**
  * Call this when do you want to apply a route to an incoming URL.
  * Deprecation warning!
  * Now request & response has backwards compatibility with only response.
  * The next version will drop this backwards compatibility.
  */
  listen(url, request, response) {
    let route = this.getMatchingRoute(url);
    let match;
    if (typeof route.regex !== 'undefined'){
      match = url.match(route.regex);
    }
    if (typeof response === 'undefined'){
      route.callback(url, request, match);
      route.children.forEach((sub) => {
        if (url.match(sub.regex))
          sub.callback(url, request, match);
      });
    } else {
      route.callback(url, request, response, match);
      route.children.forEach((sub) => {
        if (url.match(sub.regex))
          sub.callback(url, request, response, match);
      });
    }
  }

};

//Expose the module.
module.exports = new Router();
