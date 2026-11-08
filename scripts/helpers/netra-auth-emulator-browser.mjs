// Explicit loopback-only test support. Never imported by application code.
import assert from "node:assert/strict";
export async function createBrowserEmulatorAccount() {
  const auth = "http://127.0.0.1:9097";
  async function action(name, body) {
    const response = await fetch(auth + "/identitytoolkit.googleapis.com/v1/accounts:" + name + "?key=emulator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    assert.equal(response.status, 200, "Auth Emulator must be running on localhost:9097"); return response.json();
  }
  const email = "rekha-test-" + crypto.randomUUID() + "@example.invalid", password = crypto.randomUUID();
  const user = await action("signUp", { email, password, returnSecureToken: true });
  return { email, password, cleanup: () => action("delete", { idToken: user.idToken }),
    async intercept(event, send) {
      const url = new URL(event.request.url);
      if (!["identitytoolkit.googleapis.com", "securetoken.googleapis.com"].includes(url.hostname)) return false;
      const response = await fetch(auth + "/" + url.hostname + url.pathname + url.search, { method: event.request.method, headers: { "Content-Type": event.request.headers["Content-Type"] ?? event.request.headers["content-type"] ?? "application/json" }, ...(event.request.postData ? { body: event.request.postData } : {}) });
      await send("Fetch.fulfillRequest", { requestId: event.requestId, responseCode: response.status, responseHeaders: [{ name: "Content-Type", value: "application/json" }, { name: "Access-Control-Allow-Origin", value: "*" }, { name: "Access-Control-Allow-Headers", value: "*" }, { name: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" }], body: Buffer.from(await response.text()).toString("base64") });
      return true;
    }
  };
}
