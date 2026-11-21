const C='panam-v1',ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
const keep=(r,res)=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;};
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!font)return; /* anything else, like analytics later, is never cached */
  e.respondWith(font
    ? caches.match(r).then(m=>m||fetch(r).then(res=>keep(r,res)))
    : fetch(r).then(res=>res.ok?keep(r,res):res).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
