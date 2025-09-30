# Sobaka JS

🐕🐕🐕
A tiny wrapper that keeps errors from breaking into your app. Woof!

## Usage

```js
import { withSobaka } from 'sobaka';

const yourCustomLogger = (e) => {
  console.error(e);
};

const someFunctionThatCanEmitError = function () {
  throw new Error('boom');
};

const guarded = withSobaka(someFunctionThatCanEmitError, yourCustomLogger);

// now call your wrapped function, and it will be safe
guarded();
```

--
happy coding !
