import Application from '../../app';
import config from '../../config/environment';
import { run } from '@ember/runloop';
import { assign } from '@ember/polyfills';

export default function startApp(attrs) {
  let attributes = assign({}, config.APP);
  attributes.autoboot = false;
  attributes = assign(attributes, attrs);

  run(() => {
    const application = Application.create(attributes);
    // application.setupForTesting();
    // application.injectTestHelpers();
    return application;
  });
}
