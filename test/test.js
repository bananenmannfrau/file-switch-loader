const assert = require('assert');
const path = require('path');
const loader = require('../index');

const getModuleRequireFromTemplate = module =>
  `module.exports = require("-!${module}");`;

describe('file-switcher-loader', () => {
  describe('pitch method', () => {
    it('should not rewrite for node_modules', () => {
      const resourcePath = 'node_modules/crazyModule';
      const requestedResource = 'crazyModule';
      const thisContext = {resourcePath};

      assert.equal(
        loader.pitch.apply(thisContext, [requestedResource, '', {}]),
        getModuleRequireFromTemplate(requestedResource),
      );
    });
    it('should not rewrite if no version was specified', () => {
      const resourcePath = 'crazyModule';
      const requestedResource = 'crazyModule';
      const query = {};
      const thisContext = {resourcePath, query: {}};

      assert.equal(
        loader.pitch.apply(thisContext, [requestedResource, '', {}]),
        getModuleRequireFromTemplate(requestedResource),
      );
    });
    describe('data object', () => {
      it('should have an empty newPath if no file for rewrite is found', () => {
        const resourcePath = path.resolve('./test/testFile.js');
        const requestedResource = 'testFile.js';
        const thisContext = {resourcePath, query: {}};
        const data = {};

        loader.pitch.call(thisContext, requestedResource, '', data);

        assert.equal(data.newPath, undefined);
      });
      it('should have a newPath set if a file for rewrite is found', () => {
        const resourcePath = path.resolve('./test/testFile.js');
        const requestedResource = 'testFile.js';
        const thisContext = {resourcePath, query: {version: 2}};
        const data = {};

        loader.pitch.call(thisContext, requestedResource, '', data);

        assert.equal(data.newPath, path.resolve('./test/testFile.2.js'));
      });
    });
  });
});