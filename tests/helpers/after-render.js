import { Promise } from 'rsvp';
import { run } from '@ember/runloop';

export default function afterRender(promise) {
  return promise.catch(() => {}).finally(() => {
    return new Promise(function (resolve) {
      run.scheduleOnce('afterRender', resolve);
    });
  });
}
