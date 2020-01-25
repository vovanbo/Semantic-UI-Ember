import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({
  actions: {
    clear: function() {
      jQuery('.cookie.nag').nag('clear');
      jQuery('.cookie.nag').nag('show');
    }
  }
});
