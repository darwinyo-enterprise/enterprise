import { IConfirmConfig } from '@covalent/core';
import { Subject } from 'rxjs';

/** Register Linear Loading Overlay Command */
export class RegisterLinearLoadingOverlay {
  static readonly type = '[APP] REGISTER LINEAR LOADING OVERLAY';
  constructor() { }
}

/** Register Linear Loading Overlay Command */
export class ProgressLinearLoadingOverlay {
  static readonly type = '[APP] PROGRESS LINEAR LOADING OVERLAY';
  /** Progress Value => 10%, 20%, so on... */
  constructor(public payload: number) { }
}

/** Resolve Loading Overlay Command */
export class ResolveLinearLoadingOverlay {
  static readonly type = '[APP] RESOLVE LINEAR LOADING OVERLAY';
  constructor() { }
}

/** Register Loading Overlay Command */
export class RegisterLoadingOverlay {
  static readonly type = '[APP] REGISTER LOADING OVERLAY';
  constructor() { }
}

/** Resolve Loading Overlay Command */
export class ResolveLoadingOverlay {
  static readonly type = '[APP] RESOLVE LOADING OVERLAY';
  constructor() { }
}

export class Confirm {
  static readonly type = '[APP] CONFIRM';
  constructor(public payload: IConfirmConfig, public handler: Subject<boolean>) { }
}
export class Confirmed {
  static readonly type = '[APP] CONFIRMED';
  constructor(public payload: boolean) { }
}

/** Error Occured Event */
export class ErrorOccured {
  static readonly type = '[APP] ERROR OCCURED';
  /**
   *
   * @param payload Error Message
   */
  constructor(public payload: string) { }
}

export class Alert {
  static readonly type = '[APP] ALERT';
  constructor(public payload: string) { }
}

/** Login command */
export class Login {
  static readonly type = '[APP] LOGIN';
  constructor() { }
}
/** Logged Event */
export class Logged {
  static readonly type = '[APP] LOGGED';
  constructor() { }
}
/** Logged Out Event */
export class LoggedOut {
  static readonly type = '[APP] LOGGED';
  constructor() { }
}
/** Logout Command */
export class Logout {
  static readonly type = '[APP] LOGOUT';
  constructor() { }
}

/** subscribe user login and logout */
export class SubscribeUser {
  static readonly type = '[APP] SUBSCRIBE USER';
  constructor() { }
}

