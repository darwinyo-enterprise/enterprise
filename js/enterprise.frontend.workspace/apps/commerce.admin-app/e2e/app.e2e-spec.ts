import { AppPage } from './app.po';

describe('commerce.admin-app App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.text()).toContain('Welcome');
  });
  describe('Manufacturer Scenario', () => {
    describe('create new manufacturer scenario', () => {

    })
    describe('edit existing manufacturer scenario', () => {

    })
    describe('delete manufacturer scenario', () => {

    })
    describe('display list manufacturer scenario', () => {

    })
  })

});
