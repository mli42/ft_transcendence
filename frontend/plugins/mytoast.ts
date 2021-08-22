// Inject in Vue, context and store.

function getArrayMsg(messages: string | string[]): string[] {
  return (typeof messages == "string") ? [messages] : messages;
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

export default (context: any, inject: Function) => {
  const toast: any = context.$toast;
  toast.register('errMsg', basicMsg, errOpt);
  toast.register('succMsg', basicMsg, succOpt);
  toast.register('infoMsg', basicMsg, infoOpt);

  inject('mytoast', {
    getArrayMsg,
    err: genToast(toast.global.errMsg),
    succ: genToast(toast.global.succMsg),
    info: genToast(toast.global.infoMsg),
  });
};
