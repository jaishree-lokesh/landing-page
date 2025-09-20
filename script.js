// ---------------- Smooth Scroll ----------------
document.querySelectorAll('nav a').forEach(link=>{
  link.addEventListener('click', function(e){
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});
function scrollToContact(){ document.getElementById('contact').scrollIntoView({behavior:'smooth'}); }

// ---------------- Contact Form + Popup ----------------
const quotes = [
  "Mapping the world, one pixel at a time.",
  "Explore. Analyze. Discover.",
  "Satellite data today, insights tomorrow.",
  "The earth tells its story through data."
];
document.getElementById('contactForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const message=document.getElementById('message').value.trim();
  if(!name||!email||!message){ alert('Please fill in all fields!'); return; }
  const randomQuote=quotes[Math.floor(Math.random()*quotes.length)];
  const popup=document.createElement('div');
  popup.className='popup';
  popup.innerHTML=`<h3>Message Sent Successfully!</h3><p>${randomQuote}</p>`;
  document.body.appendChild(popup);
  setTimeout(()=>{popup.classList.add('show');},100);
  setTimeout(()=>{popup.classList.remove('show'); setTimeout(()=>popup.remove(),500);},4000);
  this.reset();
});

// ---------------- Feature Cards Animation ----------------
const cards=document.querySelectorAll('.card');
const observer=new IntersectionObserver(entries=>{ entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); } }); },{threshold:0.2});
cards.forEach(card=>observer.observe(card));

// ---------------- Galaxy Background ----------------
const canvas=document.getElementById('galaxy');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
window.addEventListener('resize', ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; initStars(); });
class Star{ constructor(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height; this.size=Math.random()*2+0.5; this.speedX=Math.random()*0.2-0.1; this.speedY=Math.random()*0.2-0.1; this.color='rgba(255,255,255,'+Math.random()+')'; }
update(){ this.x+=this.speedX; this.y+=this.speedY; if(this.x<0||this.x>canvas.width)this.speedX*=-1; if(this.y<0||this.y>canvas.height)this.speedY*=-1; }
draw(){ ctx.fillStyle=this.color; ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill(); } }
let starsArray=[];
function initStars(){ starsArray=[]; for(let i=0;i<150;i++){ starsArray.push(new Star()); } }
function animateStars(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=0;i<starsArray.length;i++){ for(let j=i;j<starsArray.length;j++){ let dx=starsArray[i].x-starsArray[j].x; let dy=starsArray[i].y-starsArray[j].y; let dist=Math.sqrt(dx*dx+dy*dy); if(dist<100){ ctx.strokeStyle='rgba(0,255,255,'+(1-dist/100)*0.2+')'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(starsArray[i].x, starsArray[i].y); ctx.lineTo(starsArray[j].x, starsArray[j].y); ctx.stroke(); } } } starsArray.forEach(s=>{ s.update(); s.draw(); }); requestAnimationFrame(animateStars); }
document.addEventListener('mousemove', e=>{ let mx=(e.clientX-canvas.width/2)*0.0005; let my=(e.clientY-canvas.height/2)*0.0005; starsArray.forEach(s=>{ s.x+=mx; s.y+=my; }); });
initStars(); animateStars();

// ---------------- Three.js 3D Earth ----------------
const container = document.getElementById('earth-container');
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
camera.position.z = 3.5;
let renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Textures
const loader = new THREE.TextureLoader();
const earthTexture = loader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const cloudTexture = loader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png');

// Earth & Clouds
const earthGeo = new THREE.SphereGeometry(1,64,64);
const earthMat = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeo, earthMat);
scene.add(earth);
const cloudGeo = new THREE.SphereGeometry(1.02,64,64);
const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent:true, opacity:0.4 });
const clouds = new THREE.Mesh(cloudGeo, cloudMat);
scene.add(clouds);

// Lights
scene.add(new THREE.AmbientLight(0xffffff,0.7));
const dirLight=new THREE.DirectionalLight(0xffffff,0.6);
dirLight.position.set(5,5,5); scene.add(dirLight);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 5;

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animate Earth
function animateEarth(){
  requestAnimationFrame(animateEarth);
  earth.rotation.y += 0.001;
  clouds.rotation.y += 0.0012;
  controls.update();
  renderer.render(scene,camera);
}
animateEarth();
