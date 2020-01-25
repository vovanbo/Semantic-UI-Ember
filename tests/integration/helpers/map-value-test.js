import { later } from '@ember/runloop';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll } from '@ember/test-helpers';
import afterRender from 'dummy/tests/helpers/after-render';
import hbs from 'htmlbars-inline-precompile';
import { all, defer } from 'rsvp';

module('Integration | Helper | map value', function(hooks) {
  setupRenderingTest(hooks);

  test('renders value passed in on non-promise', async function(assert) {
    this.set('value', 42);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.equal(find('.item').getAttribute('data-value'), '42');
    assert.equal(find('.item').textContent.trim(), 'Forty Two');
  });

  test('when unresolved renders is passed in, null is rendered', async function(assert) {
    let deferred = defer();

    this.set('value', deferred.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.equal(find('.item').getAttribute('data-value'), undefined);
    assert.equal(find('.item').textContent.trim(), 'Forty Two');

    deferred.resolve('LIFE');

    return afterRender(deferred.promise).then(() => {
      assert.equal(find('.item').getAttribute('data-value').trim(), 'LIFE', 'data value is updated to correct value');
    });
  });

  test('when unresolved renders is passed in, null is rendered', async function(assert) {
    let deferred1 = defer();
    let deferred2 = defer();
    let deferred3 = defer();

    this.set('value', deferred3.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.equal(find('.item').getAttribute('data-value'), undefined);
    assert.equal(find('.item').textContent.trim(), 'Forty Two');

    deferred1.resolve('number 1');

    later(deferred2, 'resolve', 'number 2', 200);
    later(deferred3, 'resolve', 'number 3', 500);

    this.set('value', deferred2.promise);
    this.set('value', deferred3.promise);

    return afterRender(all([deferred2.promise, deferred3.promise])).then(() => {
      assert.equal(find('.item').getAttribute('data-value').trim(), 'number 3', 'data value is updated to correct value');
    });
  });

  test('renders null until the promise is rejected', async function(assert) {
    let deferred = defer();

    this.set('value', deferred.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.equal(find('.item').getAttribute('data-value'), undefined);

    deferred.reject(new Error('oops'));

    return afterRender(deferred.promise).then(() => {
      assert.equal(find('.item').getAttribute('data-value'), undefined, 'value of re-render does not reveal reason for rejection');
    });
  });

  test('changing the promise changes the eventually rendered value', async function(assert) {
    let deferred1 = defer();
    let deferred2 = defer();

    this.set('value', deferred1.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    const deferred1Text = 'hi';
    const deferred2Text = 'bye';

    deferred1.resolve(deferred1Text);

    return afterRender(deferred1.promise).then(() => {
      deferred2.resolve(deferred2Text);
      this.set('value', deferred2.promise);
      return afterRender(deferred2.promise);
    }).then(() => {
      assert.equal(find('.item').getAttribute('data-value'), deferred2Text, 'value updates when the promise changes');
    });
  });

  test('switching from promise to non-promise correctly ignores promise resolution', async function(assert) {
    let deferred = defer();

    this.set('value', deferred.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    this.set('value', 'iAmConstant');
    assert.equal(find('.item').getAttribute('data-value'), 'iAmConstant');
    deferred.resolve('promiseFinished');

    return afterRender(deferred.promise).then(() => {
      assert.equal(find('.item').getAttribute('data-value'), 'iAmConstant', 'ignores a promise that has been replaced');
    });
  });

  test('promises that get wrapped by RSVP.Promise.resolve still work correctly', async function(assert) {
    let deferred = defer();
    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferred.promise
    });

    this.set('value', proxy);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);
    deferred.resolve('hasAValue');
    return afterRender(deferred.promise).then(() => {
      assert.equal(find('.item').getAttribute('data-value'), 'hasAValue');
    });
  });

  test('renders previously fullfilled promise right away', async function(assert) {
    const text = 'yass!';

    let deferred = defer();
    deferred.resolve(text);

    this.set('value', deferred.promise);
    this.set('mapper', function(value) { return value; });
    this.set('text', 'Forty Two');

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.equal(findAll('.item').length, 1);
    assert.equal(find('.item').getAttribute('data-value'), text);

    return afterRender(deferred.promise).then(() => {
      assert.equal(find('.item').getAttribute('data-value'), text, 're-renders when the promise is resolved');
    });
  });
});
