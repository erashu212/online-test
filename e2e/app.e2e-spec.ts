import { OnlineInterviewAppPage } from './app.po';

describe('online-interview-app App', () => {
  let page: OnlineInterviewAppPage;

  beforeEach(() => {
    page = new OnlineInterviewAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
