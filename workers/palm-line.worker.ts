import {
  extractPalmLineRuntime,
  wipePalmLineRuntime,
  type PalmLineRuntimeResult,
} from "@/lib/netra-hasta/palm-line-runtime";
import {
  detachPalmLineBaselineVariant,
  type PalmLineWorkerRequest,
  type PalmLineWorkerResponse,
} from "@/lib/netra-hasta/palm-line-live";

type PalmLineWorkerScope = {
  onmessage: ((event: MessageEvent<PalmLineWorkerRequest>) => void) | null;
  postMessage: (message: PalmLineWorkerResponse, transfer: Transferable[]) => void;
};

const workerScope = self as unknown as PalmLineWorkerScope;

workerScope.onmessage = ({ data: request }) => {
  let baselineExtraction: PalmLineRuntimeResult | null = null;
  try {
    const source = {
      width: request.width,
      height: request.height,
      data: request.data,
    };
    baselineExtraction = extractPalmLineRuntime(source);
    const baseline = detachPalmLineBaselineVariant(baselineExtraction);
    wipePalmLineRuntime(baselineExtraction);
    baselineExtraction = null;

    const response: PalmLineWorkerResponse = {
      requestId: request.requestId,
      captureId: request.captureId,
      baseline,
    };
    request.data.fill(0);
    const transferable = [baseline.overlay.data.buffer];
    workerScope.postMessage(response, transferable);
  } catch {
    if (baselineExtraction) wipePalmLineRuntime(baselineExtraction);
    request.data.fill(0);
    throw new Error("Ekstraksi kandidat lipatan gagal dijalankan oleh browser.");
  }
};
