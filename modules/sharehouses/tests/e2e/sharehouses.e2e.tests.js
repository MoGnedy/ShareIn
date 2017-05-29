'use strict';

describe('Sharehouses E2E Tests:', function () {
  describe('Test Sharehouses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sharehouses');
      expect(element.all(by.repeater('sharehouse in sharehouses')).count()).toEqual(0);
    });
  });
});
