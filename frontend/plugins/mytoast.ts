// Inject in Vue, context and store.

function getArrayMsg(messages: string | string[]): string[] {
  return (typeof messages == "string") ? [messages] : messages;
}

function errToast({ $toast }: any): Function {
  return function (messages: string | string[]): void {
    const errArr = getArrayMsg(messages);

    for (const errMsg of errArr) {
      $toast.global.errMsg({ message: errMsg });
    }
  };
}

function succToast({ $toast }: any): Function {
  return function (messages: string | string[]): void {
    const succArr = getArrayMsg(messages);
    for (const succMsg of succArr) {
      $toast.global.succMsg({ message: succMsg });
    }
  };
}

function infoToast({ $toast }: any): Function {
  return function (messages: string | string[]): void {
    const infoArr = getArrayMsg(messages);
    for (const infoMsg of infoArr) {
      $toast.global.infoMsg({ message: infoMsg });
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
  context.$toast.register('errMsg', basicMsg, errOpt);
  context.$toast.register('succMsg', basicMsg, succOpt);
  context.$toast.register('infoMsg', basicMsg, infoOpt);

  inject('mytoast', {
    getArrayMsg,
    err: errToast(context),
    succ: succToast(context),
    info: infoToast(context),
  });
};
