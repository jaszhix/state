declare namespace State {
  type StateCallback = (state?: Partial<Data>) => void;
  type TriggerCallback = (...args: any[]) => any;
  type Callback = StateCallback | TriggerCallback;
  interface ActionsObject {
      [key: string]: Callback;
  }
  type ConnectActions = string | string[] | ActionsObject;

  interface API extends Object {
    get(key: string): any;
    set(object: Partial<Data>, cb?: (() => void) | boolean, force?: boolean): Data | void;
    setMergeKeys(keys: string[]): State.API;
    exclude(excludeKeys: string[]): Partial<Data>;
    trigger(key: string, ...args: any[]): any;
    connect(actions: ConnectActions, callback?: Callback, context?: object | undefined): number;
    disconnect(key: DisconnectKey): void;
  }

  interface Data extends API {
    [x: string]: any;
  }

  interface Listener {
      keys: string[];
      id: number;
      callback: Callback;
  }

  type DisconnectKey = string | Array<string> | number;

  /**
   * init
   * Initializes a store instance. It uses private scoping to prevent
   * its context from leaking.
   *
   * @param {object} [state={}]
   * @param {array} [listeners=[]] - Not intended to be set manually, but can be overriden.
   * See _connect.
   * @returns Initial state object with the public API.
   */
  function init(state: Partial<Data>, listeners?: Listener[], mergeKeys?: string[], connections?: number): Data;
}

export as namespace State;

export = State;
