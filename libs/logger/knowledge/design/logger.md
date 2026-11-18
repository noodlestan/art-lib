# Design: Logger

The published API of `@art-lib/logger`. Install with `npm install @art-lib/logger`.

## Public API

The package exports `createLogger` and these types:

```ts
export declare function createLogger(options?: LoggerOptions): LoggerAPI;

export type LoggerOptions = {
  writer?: LogWriter;
};

export type MessageLevel = 'debug' | 'info' | 'warning' | 'error';

export type Message = {
  level: MessageLevel;
  text: string;
  ts: number;
};

export type OutputMode = 'quiet' | 'normal' | 'verbose';

export type LogWriter = (message: Message) => void;

export type LoggerAPI = {
  log(message: Message): void;
  setOutputMode(mode: OutputMode): void;
};
```

`createLogger` accepts an optional writer callback. The callback receives the complete message; the default writer sends its text to the matching console method.

## Buffering

The logger starts without an output mode. It buffers messages until `setOutputMode` is called, then flushes them in order. The selected mode filters both buffered and later messages:

| Mode      | Messages written          |
| --------- | ------------------------- |
| `quiet`   | `warning` and `error`     |
| `normal`  | Everything except `debug` |
| `verbose` | All messages              |

Changing the mode affects subsequent messages; already-written messages are not replayed.

## Usage

```ts
import { createLogger } from '@art-lib/logger';

const logger = createLogger({
  writer: message => process.stdout.write(`${message.level}: ${message.text}\n`),
});

logger.log({ level: 'info', text: 'Starting up', ts: Date.now() }); // buffered
logger.setOutputMode('normal'); // flushes the buffered message
logger.log({ level: 'warning', text: 'Cache directory missing', ts: Date.now() });
```

The writer can also forward messages to a logging service or another output destination.
