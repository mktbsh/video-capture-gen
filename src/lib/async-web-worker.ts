type AsyncWebWorker<Input, Output> = {
  cleanup: VoidFunction;
  refresh: VoidFunction;
  execute: (
    data: Input,
    options?: StructuredSerializeOptions
  ) => Promise<Output>;
};

export function asyncWebWorker<Input = unknown, Output = unknown>(
  initWorkerFn: () => Worker,
  reuse: boolean = true,
): AsyncWebWorker<Input, Output> {
  let worker: Worker = initWorkerFn();

  const shouldDestroy = !reuse;

  function destroy() {
    worker.terminate();
  }

  function refresh() {
    destroy();
    worker = initWorkerFn();
  }

  async function execute(
    data: Input,
    options?: StructuredSerializeOptions
  ): Promise<Output> {
    const promise = new Promise<Output>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<Output>) => {
        resolve(e.data);
        shouldDestroy && destroy();
      };
      worker.onerror = (e) => {
        reject(e.error);
        shouldDestroy && destroy();
      };
    });
    worker.postMessage(data, options);
    return await promise;
  }

  return {
    cleanup: destroy,
    execute,
    refresh
  };
}
