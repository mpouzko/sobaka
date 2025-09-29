function handleError(e) {
  console.log('woof!', 'error captured', e.message);
  return e;
}

export function withSobaka(cb, ctx) {
  return cb.constructor.name === 'AsyncFunction'
    ? async function (...args) {
        cb.apply(ctx || this, args).catch(handleError);
      }
    : function (...args) {
        try {
          cb.apply(ctx || this, args);
        } catch (e) {
          handleError(e);
        }
      };
}
