let expect = chai.expect;
describe('Dummy test', () => {
  return it('should crash', () => {
    return expect(true).to.be.false;
  });
});
