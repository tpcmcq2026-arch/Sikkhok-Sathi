// শিক্ষক সাথী — Service Worker
// প্রতিবার আপডেটে নিচের নম্বরটা একটা বাড়াও (v1 → v2 → v3 ...)
const VER='v86',CACHE='shikkhok-sathi-'+VER;
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await Promise.all(LOCAL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})));await Promise.all(CDN.map(u=>fetch(u,{mode:'cors'}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})))})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('shikkhok-sathi-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // নিজের ফাইল: আগে ইন্টারনেট থেকে নতুনটা আনে, না পেলে সেভ করা কপি
 if(u.origin===location.origin){e.respondWith((async()=>{try{const f=await fetch(r,{cache:'no-store'});if(f.ok){const c=await caches.open(CACHE);c.put(r,f.clone())}return f}catch(x){const m=await caches.match(r,{ignoreSearch:true});return m||(r.mode==='navigate'?caches.match('index.html'):Response.error())}})());return}
 // বাইরের লাইব্রেরি (PNG/PDF বানানোর): সেভ করা থাকলে সেটাই
 if(CDN.includes(r.url)){e.respondWith((async()=>{const m=await caches.match(r);if(m)return m;try{const f=await fetch(r);if(f.ok){const c=await caches.open(CACHE);c.put(r,f.clone())}return f}catch(x){return Response.error()}})())}
});
