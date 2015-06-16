// wiki.js
// Perform a search on Wikipedia and print out the URL of the searched page.
'use strict';

var Nightmare = require('nightmare');

// Check for a search parameter, otherwise, display a help for the user.
// if (process.argv.length < 3) {
//   console.log('Usage: node wiki.js PARAM');
//   return;
// }

new Nightmare()
  .goto('http://gosset.wharton.upenn.edu/mortality/form.html')
  // .type('#searchInput', process.argv[2])
  .click('input[value="Calculate Life Expectancy"]')
  .wait()
  .evaluate(function() {
      var p = document.getElementsByTagName('p')[0].innerHTML;
      var re = /(.*to\s+)(.*)(\s+year.*)/;
	  return p.replace(re, "$2");
  }, function(value) {
  	console.log(value);
  })
  .run(function(err, nightmare) {
    if (err) {
      console.log(err);
    }
});