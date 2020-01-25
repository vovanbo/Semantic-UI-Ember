import Component from '@ember/component';
import Checkbox from '../mixins/checkbox';
import layout from '../templates/components/ui-checkbox';

export default Component.extend(Checkbox, {
  layout,
  type: 'checkbox',

  init() {
    this._super(...arguments);
    this.ignorableAttrs = this.ignorableAttrs || ['checked', 'label', 'disabled'];
  },

  // Internal wrapper for onchange, to pass through checked
  _onChange() {
    let checked = this.execute('is checked');
    return this.get('onChange')(checked, this);
  }
});
