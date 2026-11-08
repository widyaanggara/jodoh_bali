// A real background browser tab; no synthetic visibilitychange event.
export async function switchAwayAndReturn({ send, evaluate, until }, inspectWhileHidden = async () => {}) {
  const target = await (await fetch("http://127.0.0.1:9327/json/new?about:blank", { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => ws.addEventListener("open", resolve, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id) { const callback = pending.get(message.id); pending.delete(message.id); if (message.error) callback.reject(Error(message.error.message)); else callback.resolve(message.result); } });
  const other = (method, params = {}) => new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); ws.send(JSON.stringify({ id: next, method, params })); });
  try {
    await other("Page.enable"); await other("Page.bringToFront");
    await until("document.hidden");
    if (!(await evaluate("document.visibilityState==='hidden'"))) throw Error("Tab did not become hidden");
    await inspectWhileHidden();
  } finally {
    await send("Page.bringToFront"); await until("!document.hidden");
    await other("Page.close").catch(() => {}); ws.close();
  }
}
