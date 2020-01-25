import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({
  actions: {
    transition: function() {
      jQuery('img').transition('horizontal flip', '500ms');
    }
  }
});
