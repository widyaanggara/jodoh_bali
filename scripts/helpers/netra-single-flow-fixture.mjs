// Test-only hook fixture. Never imported by app code or exposed as product input.
import { loadNetraModule } from "../../tests/helpers/load-netra-typescript.mjs";
const { evaluatePalmQuality } = loadNetraModule("lib/netra-hasta/image-quality.ts");
export function syntheticPalmCaptureExpression(qualityMode = "normal") {
  const quality = evaluatePalmQuality({ handCount: 1, roiValid: true, palmLargeEnough: true,
    imageMetrics: { brightness: 140, contrast: 40, sharpness: qualityMode === "normal" ? 10 : 6.5, darkPixelRatio: 0, brightPixelRatio: 0 },
    stability: { stable: true, sampleCount: 12, durationMs: 1000, centroidDeviation: 0, scaleDeviationRatio: 0 } });
  return `(()=>{
    const width=240,height=340,canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const context=canvas.getContext('2d');context.fillStyle='#c9c0ac';context.fillRect(0,0,width,height);context.strokeStyle='#524b40';context.lineWidth=5;
    for(let n=0;n<5;n++){context.beginPath();context.moveTo(30,40+n*52);context.bezierCurveTo(60,30+n*52,160,80+n*52,210,45+n*52);context.stroke();}
    const pixels=context.getImageData(0,0,width,height),image=()=>({width,height,data:new Uint8ClampedArray(pixels.data)});
    const capture={original:image(),grayscale:image(),enhanced:image(),capturedAt:Date.now(),handedness:null,rotationDegrees:0,
      qualityMode:${JSON.stringify(qualityMode)},qualityWarnings:${JSON.stringify(qualityMode === "normal" ? [] : ["Synthetic sharpness 6.5 / target 7"])}};
    pixels.data.fill(0);canvas.width=0;canvas.height=0;
    window.__fixtureBuffers=[capture.original.data,capture.grayscale.data,capture.enhanced.data];
    let fiber=document.querySelector('main')[Object.keys(document.querySelector('main')).find(k=>k.startsWith('__reactFiber'))];
    while(fiber.return)fiber=fiber.return;
    const find=node=>{if(node.memoizedProps?.productMode===true&&node.memoizedProps?.onPalmSummaryChange)return node;for(let c=node.child;c;c=c.sibling){const found=find(c);if(found)return found;}return null;};
    const client=find(fiber.stateNode.current);if(!client)throw Error('Camera client missing');
    const artifacts={capture,capturedQualityMetrics:{...${JSON.stringify(quality)},capturedAt:capture.capturedAt}};
    client.memoizedState.queue.dispatch(true);client.memoizedState.next.next.queue.dispatch(artifacts);
    for(let hook=client.memoizedState;hook;hook=hook.next){if(hook.memoizedState?.current?.capture===null&&'capturedQualityMetrics'in hook.memoizedState.current)hook.memoizedState.current=artifacts;}
    return {width,height,captureId:capture.capturedAt};
  })()`;
}
