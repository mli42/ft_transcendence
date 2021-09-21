// Inject in Vue, context and store.

function getArrayMsg(messages: string | string[]): string[] {
  return (typeof messages == "string") ? [messages] : messages;
}

function defaultCatch(context: any): Function {
  return function (err: any): void {
    context.$mytoast.err(`${err?.response?.data?.message}`);
  }
}

function genToast(callback: Function): Function {
  return function (messages: string | string[]): void {
    const msgArr: string[] = getArrayMsg(messages);

    for (const msg of msgArr) {
      callback({ message: msg });
    }
  };
}

const basicMsg: Function = (payload: any) => payload.message;
const unexpectedMsg: Function = (payload: any) => `Unexpected error: ${payload.message}`;

const dismissAct: Object = {
  text: 'OK',
  onClick: (e: any, toastObject: any) => {
    toastObject.goAway(0);
  },
};

const errOpt: Object = {
  type: 'error',
  duration: 6000,
  action: [dismissAct],
  className: ['errToast'],
};

const succOpt: Object = {
  type: 'success',
  duration: 4000,
  action: [dismissAct],
};

const infoOpt: Object = {
  type: 'info',
  duration: 4000,
  action: [dismissAct],
};

const oneSecOpt: Object = {
  type: 'info',
  duration: 1000,
};

export default (context: any, inject: Function) => {
  const toast: any = context.$toast;
  toast.register('errMsg', basicMsg, errOpt);
  toast.register('succMsg', basicMsg, succOpt);
  toast.register('infoMsg', basicMsg, infoOpt);
  toast.register('oneSec', basicMsg, oneSecOpt);
  toast.register('unexpectedMsg', unexpectedMsg, infoOpt);

  inject('mytoast', {
    getArrayMsg,
    defaultCatch: defaultCatch(context),
    err: genToast(toast.global.errMsg),
    succ: genToast(toast.global.succMsg),
    info: genToast(toast.global.infoMsg),
    oneSec: genToast(toast.global.oneSec),
    unexpected: genToast(toast.global.unexpectedMsg),
  });
};
