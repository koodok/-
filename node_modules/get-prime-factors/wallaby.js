const babel = require('babel');

module.exports = function (wallaby) {
  return {
    env: {
      type: 'node'
    },
    files: [
      'src/**/*.js',
      'dist/**/*.js'
    ],
    tests: [
      'test/*Spec.js'
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: babel,
        stage: 0
      })
    },
    testFramework: 'mocha'
  };
};