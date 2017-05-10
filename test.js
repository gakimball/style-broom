/* eslint-env mocha */

'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const styleBroom = require('.');

describe('styleBroom', () => {
  let output;

  before(done => {
    fs.readFile(path.join(__dirname, 'fixtures/test.html'), (err, contents) => {
      if (err) {
        done(err);
      } else {
        output = styleBroom(contents.toString());
        done();
      }
    });
  });

  it('keeps used CSS classes', () => {
    expect(output).to.contain('.used-root');
  });

  it('removes unused CSS classes', () => {
    expect(output).to.not.contain('.unused');
  });

  it('keeps used CSS classes nested inside rules', () => {
    expect(output).to.contain('.used-nested');
  });

  it('removes empty media queries', () => {
    expect(output).to.not.contain('@media screen');
  });
});
