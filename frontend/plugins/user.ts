// Inject in Vue, context and store.

import Vue from 'vue';

function shortName(username: string, max_length: number = 10): string {
  if (username.length <= max_length)
    return username;
  return username.substr(0, max_length - 3) + "...";
};

export default (context: any, inject: Function) => {
  inject('user', {
    shortName,
  });
};
