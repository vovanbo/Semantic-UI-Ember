// import jQuery from 'jquery';
// import resolver from './helpers/resolver';
// import { setResolver } from '@ember/test-helpers';
// import { start } from 'ember-qunit';

// setResolver(resolver);

// jQuery.fn.modal.settings.context = "#ember-testing";

// start();

import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
