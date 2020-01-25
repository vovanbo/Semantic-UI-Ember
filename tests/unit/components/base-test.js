import Component from '@ember/component';
import BaseMixin from 'semantic-ui-ember/mixins/base';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

let baseComponent = Component.extend(BaseMixin, {
  module: 'test',

  initSemanticModule() {
    // Do nothing
  },
  didInitSemantic() {
    // Do nothing
  },
  execute(command) {
    if (command === "internal") {
      return {};
    }
  }
});

module('Unit | Component | base component', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('component:base-component', baseComponent);
  });

  test('it renders and has right properties', async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{base-component class="base-component" title="semantic ui ember" tabindex=5 autofocus=true}}`);

    assert.equal(this.element.querySelector('.base-component').getAttribute('title'), "semantic ui ember");
    assert.equal(this.element.querySelector('.base-component').getAttribute('tabindex'), "5");
    assert.equal(this.element.querySelector('.base-component').getAttribute('autofocus'), "autofocus");
  });
});
