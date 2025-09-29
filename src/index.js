function handleError(e) {
  console.log('woof!', 'error captured', e);
  return e;
}

export const budka = (logger = handleError) => {
  return function withSobaka (cb) {
    return cb.constructor.name === 'AsyncFunction'
    ? async function (...args) {
        cb(...args).catch(logger);
      }
    : function (...args) {
        try {
          cb(...args);
        } catch (e) {
          logger(e);
        }
      };
  }

}



  