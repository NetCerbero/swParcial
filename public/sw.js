var cacheName = "diagramador-sw";
var filesToCache = [
	'/',
	'/room',
	'/diagramador',
	'/login',
	'./css/style.css',
	'./assets/application-eb96851b106371a3a4f85b0516295deff823392baf83697c9b56f8809448eab0.css',
	'assets/app.js',
	'jscolor/jscolor.js',
	'fonts/font-awesome/css/font-awesome.min.css',
	'assets/canvas-background-382ddae37df2afda79a647cf643277cc012d079c989b71853f3b9c6f2908c167.png',
	'assets/key-0f0ed284afcf94f728410e720ca9ac84107d90a676864c780b0a3ddd70d8e58b.png',
	'assets/table_relationship-50286182fcbd7f9cd9dc4f2b496a9152552d43285cb97dcab3f88f08f16734b2.png',
	'assets/notnull-a34e5e8bb4c0ac6157b22a1eb4c4cc75e05b55b62cf81e9814d87dab335aef7e.png',
	'assets/ai-5ad4475567db2451cc26ce4e7f53c0bd7c07ba5593377ce938eefe47da2c93cc.png',
	'dbdesigner_logo_bw.png',
	'./socket.io/socket.io.js',
	'assets/comparacion.js',
	'https://code.jquery.com/jquery-3.3.1.slim.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
	'https://www.gstatic.com/firebasejs/5.5.8/firebase.js'
];
self.addEventListener('install',(e)=>{
	console.log("[ServiceWorker] Install");
	e.waitUntil(
		caches.open(cacheName)
			.then(cache=>{
				console.log("[ServiceWorker] Caching app shell");
				return cache.addAll(filesToCache);
			})
			.catch( err => console.log(err))
	);
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});