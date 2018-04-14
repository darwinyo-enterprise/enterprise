/** Register Loading Overlay Command */
export class RegisterLoadingOverlay {
  static readonly type = '[APP] REGISTER LOADING OVERLAY';
  constructor() {}
}

/** Resolve Loading Overlay Command */
export class ResolveLoadingOverlay {
  static readonly type = '[APP] RESOLVE LOADING OVERLAY';
  constructor() {}
}

/** Error Occured Event */
export class ErrorOccured {
  static readonly type = '[APP] ERROR OCCURED';
  /**
   *
   * @param payload Error Message
   */
  constructor(public payload: string) {}
}

/** TODO: Not Yet DONE */
export class SetUsername {
  static readonly type = '[APP] SET USERNAME';
  constructor(public payload: string) {}
}
