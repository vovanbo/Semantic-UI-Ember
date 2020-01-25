import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({
  actions: {
    toggle: function(id) {
      jQuery(`#${id}`).sidebar('toggle');
    }
  }
});
