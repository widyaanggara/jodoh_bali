// Test-only process preload. Never package in release.
const original=globalThis.fetch;
globalThis.fetch=async(input,options)=>{
 const u=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
 if(u.hostname==='identitytoolkit.googleapis.com'){
  if(u.pathname==='/v1/accounts:lookup')return original('http://127.0.0.1:9097/identitytoolkit.googleapis.com/v1/accounts:lookup?key=emulator',options);
  if(u.pathname==='/v1/projects')return Response.json({projectId:'daily-logs-a1442'});
  throw Error('Unexpected external auth request blocked');
 }
 if(u.hostname==='firestore.googleapis.com'&&u.pathname.startsWith('/v1/projects/daily-logs-a1442/'))return original('http://127.0.0.1:8189'+u.pathname+u.search,options);
 if(u.protocol==='http:'&&['127.0.0.1','localhost'].includes(u.hostname))return original(input,options);
 throw Error('External network blocked by isolated harness');
};
