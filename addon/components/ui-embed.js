import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-embed';

export default Component.extend(Base, {
  layout,
  module: 'embed',
  classNames: ['ui', 'embed'],
  attributeBindings: ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url'],

  init() {
    this._super(...arguments);
    this.ignorableAttrs = this.ignorableAttrs || ['data-icon', 'data-id', 'data-placeholder', 'data-source', 'data-url'];
  },
});
