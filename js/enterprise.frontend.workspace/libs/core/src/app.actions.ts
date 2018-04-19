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

/** Error Occured Event */
export class ErrorOccured {
  static readonly type = '[APP] ERROR OCCURED';
  /**
   *
   * @param payload Error Message
   */
  constructor(public payload: string) { }
}

/** TODO: Not Yet DONE */
export class SetUsername {
  static readonly type = '[APP] SET USERNAME';
  constructor(public payload: string) { }
}
