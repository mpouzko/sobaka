function handleError(e) {
  console.log('woof!', 'error captured', e);
  return e;
}

export function withSobaka(cb, errorHandler = handleError) {
  return cb.constructor.name === 'AsyncFunction'
    ? async function (...args) {
        cb(...args).catch(errorHandler);
      }
    : function (...args) {
        try {
          cb(...args);
        } catch (e) {
          errorHandler(e);
        }
      };
}
