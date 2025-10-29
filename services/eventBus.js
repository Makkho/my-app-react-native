// Simple in-memory event bus for small cross-screen notifications
const _subs = Object.create(null);

export const on = (event, handler) => {
  if (!_subs[event]) _subs[event] = [];
  _subs[event].push(handler);
  return () => {
    _subs[event] = _subs[event].filter(h => h !== handler);
  };
};

export const emit = (event, payload) => {
  const list = _subs[event] ? [..._subs[event]] : [];
  list.forEach(h => {
    try {
      h(payload);
    } catch (e) {
      // swallow handler errors
      console.warn('event handler error', e);
    }
  });
};

export default { on, emit };
