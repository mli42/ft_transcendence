// Inject in Vue, context and store.
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

export default (context: any, inject: Function) => {
  TimeAgo.addDefaultLocale(en);
  const timeAgo: TimeAgo = new TimeAgo('en-US');

  inject('timeAgo', timeAgo);
};
