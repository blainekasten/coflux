/*
 * jest isn't great about grabbing all files for code cov.
 * This file makes sure jest knows about every js file in
 * the repo, so it can properly get code covereage info
 */

const glob = require('glob');

const jsFiles = glob.sync('src/**.js');

jsFiles.forEach(file => {
  // don't load test files
  if (file.search('__tests__') !== -1) {
    return;
  }

  require(`${process.cwd()}/${file}`);
});

