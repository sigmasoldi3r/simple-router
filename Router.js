 'use strict'
 /**
 * Simplistic Routing Module
 * NodeJS Regular expression routing.
 * ---
 * Argochamber Interactive 2016
 * by Pablo 'sigmasoldier' Blanco Celdrán
 */

 /**
  * This is an atomic hanler.
  * Those store simple data as the callback.
  */
 function Handler(regex, callback, passable){

   this.callback = callback;

   this.regex = regex;

   this.isPassable = () => {
     return passable;
   };

 }

 /**
  * The router module grants you a routing system using regexp.
  * Is like using if ... else if ... else with regexp.
  */
 function Router(){

   let routes = [];
   let final = () => {};

   /**
    * Called when the router wants to handle an incoming connection.
    * When specify blocking routes.
    * That means that if the next callback is not a 'if' the regular expression
    * is not even tested.
    */
   this.when = (regex, callback) => {
     routes.push(new Handler(regex, callback, false));
     return this;
   };

   /**
    * Those are tested even if the previous regex was true.
    */
   /*this.if = (regex, callback) => {
     routes.push(new Handler(regex, callback, true));
     return this;
   };*/

   /**
    * This is called if noone of the when routes has been matched.
    */
   this.final = (handler) => {
     final = handler;
   };

   /**
    * This function gets an iterator for the callback sequence.
    * This iterator.
    */
   function* getRoutesIterator(){
     //let exit = false;
     //let ai = 0;
     yield* [...routes];
     /*while (!exit){
       let it go xdddddd
     }*/
   }

   /**
    * Call this when do you want to apply a route to an incoming URL.
    */
   this.listen = (url, response) => {
     let exit = false;
     let iter = getRoutesIterator();
     let last = {done: false};
     while (!exit && !last.done){
       last = iter.next();
       if (!last.done){
         if (url.test(last.value.regex)){
           let match = last.value.regex.match(url);
           last.value.callback(url, response, match);
           exit = true;
         }
       }
     }
     if (!fired){
       final(response, url);
     }
   }

 };

 //Expose the module.
 module.exports = new Router();


module.exports = new Router();
