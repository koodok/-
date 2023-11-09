'use strict';

var _ = require('lodash');
var glob = require('glob');


// Process specified wildcard glob patterns or filenames against a
// callback, excluding and uniquing files in the result set.
var processPatterns = function(patterns, fn) {
  // Filepaths to return.
  var result = [];
  // Iterate over flattened patterns array.
  _.flattenDeep(patterns).forEach(function(pattern) {
    // If the first character is ! it should be omitted
    var exclusion = pattern.indexOf('!') === 0;
    // If the pattern is an exclusion, remove the !
    if (exclusion) { pattern = pattern.slice(1); }
    // Find all matching files for this pattern.
    var matches = fn(pattern);
    if (exclusion) {
      // If an exclusion, remove matching files.
      result = _.difference(result, matches);
    } else {
      // Otherwise add matching files.
      result = _.union(result, matches);
    }
  });
  return result;
};

var matches = function(patterns, options) {
  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }

  return processPatterns(patterns, function(pattern) {
    // Find all matching files for this pattern.
    return glob.sync(pattern, options);
  });
};

module.exports = matches;
