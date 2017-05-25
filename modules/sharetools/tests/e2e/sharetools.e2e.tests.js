'use strict';

describe('Sharetools E2E Tests:', function () {
  describe('Test Sharetools page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sharetools');
      expect(element.all(by.repeater('sharetool in sharetools')).count()).toEqual(0);
    });
  });
});
