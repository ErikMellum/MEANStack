describe("Integration/E2E Testing", function() {

  // start at root before every test is run
  beforeEach(function() {
    browser().navigateTo('/');
  });

  // test default route
  it('should jump to the /home path when / is accessed', function() {
    browser().navigateTo('#/');
    expect(browser().location().path()).toBe("/home");
    input('email').enter('invalid@test.com');
    input('password').enter('wrong password');
  });

  it('ensures user can view the about', function() {
    browser().navigateTo('#/about');
    expect(browser().location().path()).toBe("/about");
  });

  it('should send you to home when you go to the wrong route', function() {
    browser().navigateTo('#/wrongroute');
    expect(browser().location().path()).toBe("/home");
  });

});