/** Pull one chunk at a time and release upstream work when the reader leaves. */
export function textStream(source: AsyncIterable<string>, abort: AbortController, suffix = "") {
  const iterator = source[Symbol.asyncIterator]();
  const encoder = new TextEncoder();
  let finished = false;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const result = await iterator.next();
        if (finished) return;
        if (!result.done) {
          controller.enqueue(encoder.encode(result.value));
          return;
        }
        if (suffix && !finished) controller.enqueue(encoder.encode(suffix));
        finished = true;
        controller.close();
      } catch (error) {
        finished = true;
        abort.abort(error);
        controller.error(error);
      }
    },
    async cancel(reason) {
      finished = true;
      abort.abort(reason);
      await iterator.return?.();
    },
  });
}
