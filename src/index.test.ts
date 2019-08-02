import init from './index';

test('store initializes with public API', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(Object.keys(state)).toContain('get');
  expect(Object.keys(state)).toContain('set');
  expect(Object.keys(state)).toContain('exclude');
  expect(Object.keys(state)).toContain('trigger');
  expect(Object.keys(state)).toContain('connect');
  expect(Object.keys(state)).toContain('disconnect');
  expect(Object.keys(state)).toContain('destroy');

  expect(state.n).toBe(1);
  expect(state.s).toBe('test');
  expect(state.b).toBe(true);
  expect(state.a).toEqual([1, 2, 4]);
  expect(state.c).toEqual([{a: 1, b: 2, c: 3}]);
  expect(state.o).toEqual({a: 1, b: 2, c: 3});
});

test('store can retrieve a value', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(state.get('n')).toBe(1);
});

test('store can retrieve state object', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(state.get('*')).toEqual({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });
});

test('store can retrieve state object by path', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(state.get('o.a')).toEqual(1);
});

test('passing an invalid path to get() returns null', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(state.get('a.b.c')).toBe(null);
});

test('store can retrieve filtered state object', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  expect(state.exclude(['a', 'c', 'o'])).toEqual({
    n: 1,
    s: 'test',
    b: true,
  });
});

test('store can update a value', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.set({test: 123})

  expect(state.test).toBe(123);
});

test('store rejects setting of properties not declared initially', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
  });

  state.set({test: 123})

  // Warning: [store -> set -> test] Property not found.
  expect(state.test).toBe(undefined);
});

test('store can react to state change', (done) => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.connect({
    test: ({test}) => {
      expect(test).toBe(123);
      done();
    }
  });

  state.set({test: 123});
});

test('context can be passed to connect', (done) => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  let obj = {
    finish: function() {
      done();
    },
    callback: function({test}) {
      expect(test).toBe(123);
      expect(typeof this.finish).toBe('function');
      this.finish();
    }
  }

  state.connect('test', obj.callback, obj);

  state.set({test: 123});
});

test('store can handle actions in response to triggers', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.connect({
    testTrigger: (foo, bar) => {
      expect(foo).toBe('fooValue');
      expect(bar).toBe('barValue');
      state.set({test: 123});
    },
    test: ({test}) => {
      expect(test).toBe(123);
    }
  });

  state.trigger('nonExistent');
  state.trigger('testTrigger', 'fooValue', 'barValue');
});

test('trigger can return the callback\'s value', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.connect({
    testTrigger: (foo, bar) => {
      expect(foo).toBe('fooValue');
      expect(bar).toBe('barValue');
      state.set({test: 123});

      return 'finalValue';
    },
    test: ({test}) => {
      expect(test).toBe(123);
    }
  });

  let result = state.trigger('testTrigger', 'fooValue', 'barValue');

  expect(result).toBe('finalValue');
});

test('connect can accept a string', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.connect('test', ({test}) => {
    expect(test).toBe(123);
  });

  state.set({test: 123});
});

test('connect can accept an array', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn = jest.fn();

  state.connect(['test', 'n'], testFn);

  state.set({test: 123});
  state.set({n: 96});
  state.set({b: false});

  expect(testFn).toHaveBeenCalledTimes(2);
});

test('connect can add multiple state listeners', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  state.connect({
    n: ({n}) => {
      expect(n).toBe(48);
    },
    test: ({test}) => {
      expect(test).toBe(123);
    }
  });

  state.set({
    test: 123,
    n: 48
  });
});

test('connect can add state listeners for all keys', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn = jest.fn();

  state.connect('*', testFn);

  state.set({test: 123, n: 48});
  state.set({s: 'test2'});

  expect(testFn).toHaveBeenCalledTimes(2);
});

test('listeners can be disconnected by number ID', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn = jest.fn();

  let id = state.connect('*', testFn);

  expect(typeof id).toBe('number');

  state.set({test: 123, n: 48});
  state.set({s: 'test2'});

  state.disconnect(id);

  state.set({test: 532, n: 543});

  expect(testFn).toHaveBeenCalledTimes(2);
});

test('listeners can be disconnected by key', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn = jest.fn();

  state.connect('s', testFn);

  state.set({s: 'test2'});
  state.set({s: 'test3'});
  state.set({s: 'test4'});

  state.disconnect('s');
  state.disconnect('n');

  state.set({s: 'test2'});

  expect(testFn).toHaveBeenCalledTimes(3);
});

test('duplicate listeners are concatenated', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn = jest.fn();

  state.connect('s', testFn);
  state.connect({s: testFn})

  state.set({s: 'test2'});
  state.set({s: 'test3'});
  state.set({s: 'test4'});

  state.disconnect('s');

  state.set({s: 'test2'});

  expect(testFn).toHaveBeenCalledTimes(3);
});

test('duplicate listener keys with unique callbacks are not concatenated', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn1 = jest.fn();
  const testFn2 = jest.fn();

  state.connect('s', testFn1);
  state.connect({s: testFn2})

  state.set({s: 'test2'});
  state.set({s: 'test3'});
  state.set({s: 'test4'});

  state.disconnect('s');

  state.set({s: 'test2'});

  expect(testFn1).toHaveBeenCalledTimes(3);
  expect(testFn2).toHaveBeenCalledTimes(3);
});

test('listeners can be disconnected by a list of keys', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn1 = jest.fn();
  const testFn2 = jest.fn();

  state.connect({
    n: testFn1,
    test: testFn2
  });

  state.set({
    test: 123,
    n: 48
  });

  state.disconnect(['n', 'test']);

  state.set({
    test: 256,
    n: 512
  });

  expect(testFn1).toHaveBeenCalledTimes(1);
  expect(testFn2).toHaveBeenCalledTimes(1);
});

test('all listeners can be removed', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn1 = jest.fn();
  const testFn2 = jest.fn();

  state.connect({
    n: testFn1,
    test: testFn2
  });

  state.set({
    test: 123,
    n: 48
  });

  state.destroy();

  state.set({
    test: 256,
    n: 512
  });

  expect(testFn1).toHaveBeenCalledTimes(1);
  expect(testFn2).toHaveBeenCalledTimes(1);
});

test('store can detect value change', () => {
  const state = init({
    n: 1,
    s: 'test',
    b: true,
    a: [1, 2, 4],
    c: [{a: 1, b: 2, c: 3}],
    o: {a: 1, b: 2, c: 3},
    test: 789
  });

  const testFn1 = jest.fn();
  const testFn2 = jest.fn();
  const testFn3 = jest.fn();
  const testFn4 = jest.fn();
  const testFn5 = jest.fn();

  state.connect({
    n: testFn1,
    test: testFn2,
    o: testFn3,
    a: testFn4,
    c: testFn5
  });

  state.set({
    test: 123,
    n: 48,
    o: {a: 2, b: 3, c: 4},
    a: [9, 2, 4],
    c: [{a: 8, b: 2, c: 3}],
  });

  state.set({
    test: 123,
    n: 48,
    o: {a: 2, b: 3, c: 4},
    a: [9, 2, 4],
    c: [{a: 8, b: 2, c: 3}],
  });

  expect(testFn1).toHaveBeenCalledTimes(1);
  expect(testFn2).toHaveBeenCalledTimes(1);
  expect(testFn3).toHaveBeenCalledTimes(1);
  expect(testFn4).toHaveBeenCalledTimes(1);
  expect(testFn5).toHaveBeenCalledTimes(1);

  state.set({
    test: 124,
    n: 49
  });

  expect(testFn1).toHaveBeenCalledTimes(2);
  expect(testFn2).toHaveBeenCalledTimes(2);
  expect(testFn3).toHaveBeenCalledTimes(1);
  expect(testFn4).toHaveBeenCalledTimes(1);
  expect(testFn5).toHaveBeenCalledTimes(1);

  state.set({
    test: 124,
    n: 49,
    o: {a: 2, q: 3, c: 4},
    a: null,
    c: [{a: 8, d: 4, b: 2, c: 3}, {a: 2, e: 5, b: 3, c: 4}],
  });

  expect(testFn1).toHaveBeenCalledTimes(2);
  expect(testFn2).toHaveBeenCalledTimes(2);
  expect(testFn3).toHaveBeenCalledTimes(2);
  expect(testFn4).toHaveBeenCalledTimes(2);
  expect(testFn5).toHaveBeenCalledTimes(2);
});

test('ignores duplicate falsy values', () => {
  const state = init({
    n: null
  });

  const testFn1 = jest.fn();

  state.connect({
    n: testFn1,
  });

  state.set({
    n: null
  });

  expect(testFn1).toHaveBeenCalledTimes(0);
});

test('isEqual doesn\'t throw if null is passed to it', () => {
  const state = init({
    n: null
  });

  const testFn1 = jest.fn();

  state.connect({
    n: testFn1,
  });

  state.set({
    n: {a: 1, b: 2, c: 3}
  });

  expect(testFn1).toHaveBeenCalledTimes(1);
});