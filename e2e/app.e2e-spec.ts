import { browser, by, element } from 'protractor';
import { Runner, Options, Validator, SeleniumWebDriverAdapter, RegressionSlopeValidator } from '@angular/benchpress';

import { AppPage } from './app.po';

let page: AppPage;
const runner = new Runner([
  // use protractor as Webdriver client
  SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
  // use RegressionSlopeValidator to validate samples
  { provide: Validator, useExisting: RegressionSlopeValidator },
  // use 10 samples to calculate slope regression
  { provide: RegressionSlopeValidator.SAMPLE_SIZE, useValue: 12 },
  // use the script metric to calculate slope regression
  { provide: RegressionSlopeValidator.METRIC, useValue: 'scriptTime' },
  { provide: Options.FORCE_GC, useValue: true }
]);

beforeEach(() => {
  page = new AppPage();
  page.navigateTo();
  browser.ignoreSynchronization = true;
});

describe('benchpress test', () => {
  it('should be slower', done => {
    runner.sample({
      id: 'test - with click',
      execute: () => element(by.css('app-root h1')).click()
    })
      .then(done, done.fail);
  });

  it('should be faster', done => {
    runner.sample({
      id: 'test - without click',
      execute: () => element(by.css('app-root h1'))
    })
      .then(done, done.fail);
  });
});

