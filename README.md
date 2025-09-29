# Sobaka JS

🐕🐕🐕
A tiny wrapper that keeps errors from breaking into your app. Woof!

## Usage

```js
import { budka } from 'sobaka';

const yourCustomLogger = (e) => {
  console.error(e);
};

const withSobaka = budka(yourCustomLogger);

const someFunctionThatCanEmitError = function () {
  throw new Error('boom');
};

const guarded = withSobaka(someFunctionThatCanEmitError);

// now call your wrapped function, and it will be safe
guarded();
```

--
happy coding !
