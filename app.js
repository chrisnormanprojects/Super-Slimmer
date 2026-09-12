const APP_VERSION = '0.1.0';
const STORAGE_KEY = 'super-slimmer-confirmed-v1';
const categories = [
  ['Loose & fresh','🍎','Fruit, vegetables, meat, fish, eggs and staples'],
  ['Tinned & jars','🥫','Beans, tomatoes, soups, fish, fruit and jars'],
  ['Packets & cupboard','📦','Rice, pasta, noodles, cereals and dry mixes'],
  ['Chilled','🧊','Yogurts, cheese, desserts and ready meals'],
  ['Frozen','❄️','Frozen meals, vegetables, chips and desserts'],
  ['Snacks & sweets','🍫','Crisps, chocolate, biscuits and snack bars'],
  ['Drinks','🥤','Soft drinks, juices and hot drinks'],
  ['Bakery','🍞','Bread, rolls, wraps and cakes'],
  ['Sauces & condiments','🍅','Sauces, dressings, spreads and condiments']
];

// Small offline starter set. These are generic foods, not copied proprietary values.
const starterFoods = [
  f('fresh-apple','Apple','Loose & fresh','Generic',52,'100g','🍎','fruit'),
  f('fresh-banana','Banana','Loose & fresh','Generic',89,'100g','🍌','fruit'),
  f('fresh-strawberry','Strawberries','Loose & fresh','Generic',32,'100g','🍓','fruit'),
  f('fresh-potato','Potatoes, raw','Loose & fresh','Generic',77,'100g','🥔','staple'),
  f('fresh-carrot','Carrots, raw','Loose & fresh','Generic',41,'100g','🥕','vegetable'),
  f('fresh-broccoli','Broccoli','Loose & fresh','Generic',34,'100g','🥦','vegetable'),
  f('fresh-egg','Egg, whole','Loose & fresh','Generic',143,'100g','🥚','staple'),
  f('fresh-chicken','Chicken breast, skinless','Loose & fresh','Generic',120,'100g','🍗','lean-protein'),
  f('fresh-cod','Cod, raw','Loose & fresh','Generic',82,'100g','🐟','lean-protein'),
  f('dry-pasta','Dried pasta','Packets & cupboard','Generic',350,'100g','🍝','staple'),
  f('dry-rice','Long grain rice, dry','Packets & cupboard','Generic',360,'100g','🍚','staple'),
  f('tin-tomato','Chopped tomatoes, canned','Tinned & jars','Generic',24,'100g','🥫','vegetable'),
  f('tin-beans','Baked beans in tomato sauce','Tinned & jars','Generic',78,'100g','🥫','plant-protein'),
  f('tin-tuna','Tuna in spring water, drained','Tinned & jars','Generic',116,'100g','🥫','lean-protein'),
  f('chilled-yogurt','Fat-free natural yogurt','Chilled','Generic',56,'100g','🥣','dairy'),
  f('bakery-wholemeal','Wholemeal bread','Bakery','Generic',247,'100g','🍞','bread'),
  f('sauce-ketchup','Tomato ketchup','Sauces & condiments','Generic',112,'100g','🍅','sauce'),
  f('snack-crisps','Potato crisps, ready salted','Snacks & sweets','Generic',530,'100g','🥔','snack'),
  f('snack-chocolate','Milk chocolate','Snacks & sweets','Generic',535,'100g','🍫','snack'),
  f('drink-cola','Cola, regular','Drinks','Generic',42,'100ml','🥤','drink')
];

function f(id,name,category,brand,kcal,portion,emoji,type){return {id,name,category,brand,kcal,portion,emoji,type,source:'Built-in generic reference'}}
function roundHalf(n){return Math.round(n*2)/2}
function estimatePoints(kcal){return Number.isFinite(kcal) ? roundHalf(kcal/20) : null}
function stored(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}}
function saveStored(v){localStorage.setItem(STORAGE_KEY,JSON.stringify(v)); renderSavedCount()}
function escapeHTML(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function normalizeProduct(p){
  const kcal = Number(p?.nutriments?.['energy-kcal_100g']);
  const cats=(p.categories||'').split(',').map(x=>x.trim()).filter(Boolean);
  return {
    id:'off-'+(p.code||crypto.randomUUID()), code:p.code||'', name:p.product_name_en||p.product_name||p.generic_name_en||p.generic_name||'Unnamed product',
    brand:p.brands||'Unknown brand', category:mapCategory(cats.join(' ')), kcal:Number.isFinite(kcal)?kcal:null,
    portion:p.serving_size||'per 100g', image:p.image_front_small_url||p.image_front_url||'', source:'Open Food Facts', type:'packaged', quantity:p.quantity||''
  };
}
function mapCategory(text=''){
  const s=text.toLowerCase();
  if(/drink|beverage|juice|cola|coffee|tea/.test(s))return 'Drinks';
  if(/chocolate|confection|sweet|crisp|snack|biscuit|cookie/.test(s))return 'Snacks & sweets';
  if(/bread|bakery|cake|roll|wrap/.test(s))return 'Bakery';
  if(/sauce|condiment|ketchup|mayonnaise|dressing|spread/.test(s))return 'Sauces & condiments';
  if(/frozen|ice cream/.test(s))return 'Frozen';
  if(/yogurt|yoghurt|cheese|chilled|dessert/.test(s))return 'Chilled';
  if(/can|canned|tinned|jar|preserved/.test(s))return 'Tinned & jars';
  return 'Packets & cupboard';
}
function isCommonStaple(p){return ['fruit','vegetable','lean-protein','plant-protein','staple'].includes(p.type)}
function valueFor(p){
  const mine=stored()[p.id] || (p.code && stored()['barcode-'+p.code]);
  if(mine && mine.value!=='' && Number.isFinite(Number(mine.value))) return {value:Number(mine.value),label:'confirmed',portion:mine.portion||p.portion,note:mine.note||''};
  return {value:estimatePoints(p.kcal),label:'estimate',portion:p.portion,note:''};
}
function cardHTML(p){
  const v=valueFor(p); const confirmed=v.label==='confirmed';
  const img=p.image?`<img class="foodImg" src="${escapeHTML(p.image)}" alt="" loading="lazy">`:`<div class="foodImg placeholder">${p.emoji||'🍽️'}</div>`;
  return `<article class="foodCard" data-id="${escapeHTML(p.id)}">
    <div class="foodTop">${img}<div class="foodMain"><div class="foodName">${escapeHTML(p.name)}</div><div class="brand">${escapeHTML(p.brand||'')} ${p.quantity?'• '+escapeHTML(p.quantity):''}</div>
    <div class="badges"><span class="badge">${escapeHTML(p.category)}</span>${isCommonStaple(p)?'<span class="badge good">common staple</span>':''}<span class="badge ${confirmed?'confirmed':'warn'}">${confirmed?'✓ My confirmed value':'≈ calorie estimate'}</span></div></div>
    <div class="pointsBox"><span class="pointsNum">${v.value===null?'—':v.value}</span><span class="pointsLabel">${confirmed?'saved':'est.'} points</span></div></div>
    <div class="foodMeta"><div class="metaCell"><b>${p.kcal??'—'}</b><span>kcal / 100g${p.portion==='100ml'?' or ml':''}</span></div><div class="metaCell"><b>${escapeHTML(v.portion||'—')}</b><span>value portion</span></div><div class="metaCell"><b>${escapeHTML(p.source)}</b><span>product data</span></div></div>
    <div class="foodActions">${p.code?`<button class="smallBtn copyBarcode" data-code="${escapeHTML(p.code)}">Barcode ${escapeHTML(p.code)}</button>`:''}<button class="smallBtn editValue" data-id="${escapeHTML(p.id)}">${confirmed?'Edit value':'Add confirmed value'}</button></div>
  </article>`
}

const results=document.querySelector('#results'), resultsTitle=document.querySelector('#resultsTitle'), resultMeta=document.querySelector('#resultMeta');
let currentProducts=[...starterFoods];
function renderProducts(list,title='Results',meta=''){
  currentProducts=list; resultsTitle.textContent=title; resultMeta.textContent=meta;
  results.innerHTML=list.length?list.map(cardHTML).join(''):'<div class="empty">No foods found. Try another search or barcode.</div>';
}
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)}

async function searchFoods(q){
  q=q.trim(); if(!q){renderProducts(starterFoods,'Popular basics','offline starter library');return}
  const local=starterFoods.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  renderProducts(local,`Searching “${q}”`,'checking live UK products…');
  try{
    let products=[];
    if(/^\d{8,14}$/.test(q)){
      const url=`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(q)}.json?fields=code,product_name,product_name_en,generic_name,generic_name_en,brands,quantity,serving_size,categories,image_front_small_url,image_front_url,nutriments`;
      const r=await fetch(url); const j=await r.json(); if(j.status===1&&j.product)products=[normalizeProduct(j.product)];
    }else{
      // OFF currently documents full-text search through its legacy endpoint; no API key is required for reads.
      const params=new URLSearchParams({search_terms:q,search_simple:'1',action:'process',json:'1',page_size:'24',countries_tags:'en:united-kingdom',fields:'code,product_name,product_name_en,generic_name,generic_name_en,brands,quantity,serving_size,categories,image_front_small_url,image_front_url,nutriments'});
      let r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`); let j=await r.json(); products=(j.products||[]).map(normalizeProduct).filter(p=>p.name!=='Unnamed product');
      if(!products.length){
        params.delete('countries_tags'); r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`); j=await r.json(); products=(j.products||[]).map(normalizeProduct).filter(p=>p.name!=='Unnamed product');
      }
    }
    const merged=[...local,...products.filter(p=>!local.some(l=>l.id===p.id))];
    renderProducts(merged,`Results for “${q}”`,`${products.length} live packaged • ${local.length} built-in`);
  }catch(err){
    renderProducts(local,`Results for “${q}”`,local.length?'live lookup unavailable • showing built-in matches':'live lookup unavailable'); toast('Live food lookup unavailable');
  }
}

document.querySelector('#searchBtn').onclick=()=>searchFoods(document.querySelector('#searchInput').value);
document.querySelector('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')searchFoods(e.currentTarget.value)});

document.querySelectorAll('.categoryQuick').forEach(b=>b.onclick=()=>showCategory(b.dataset.category));
function showCategory(cat){switchView('searchView'); const list=starterFoods.filter(p=>p.category===cat); renderProducts(list,cat,`${list.length} built-in foods • search to find branded products`); document.querySelector('#searchInput').value=''}

const grid=document.querySelector('#categoryGrid');
grid.innerHTML=categories.map(([n,i,d])=>`<button class="categoryCard" data-cat="${escapeHTML(n)}"><div class="categoryIcon">${i}</div><b>${escapeHTML(n)}</b><span>${escapeHTML(d)}</span></button>`).join('');
grid.onclick=e=>{const b=e.target.closest('[data-cat]');if(b)showCategory(b.dataset.cat)};

function switchView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.navBtn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='savedView')renderSaved()}
document.querySelectorAll('.navBtn').forEach(b=>b.onclick=()=>switchView(b.dataset.view));

let editing=null; const editDialog=document.querySelector('#editDialog');
document.addEventListener('click',e=>{
  const edit=e.target.closest('.editValue'); if(edit){editing=currentProducts.find(p=>p.id===edit.dataset.id)||starterFoods.find(p=>p.id===edit.dataset.id)||savedProductFromStore(edit.dataset.id); if(editing)openEditor(editing)}
  const cb=e.target.closest('.copyBarcode'); if(cb){navigator.clipboard?.writeText(cb.dataset.code);toast('Barcode copied')}
});
function savedProductFromStore(id){const s=stored()[id];return s?.product||null}
function openEditor(p){
  editing=p; const s=stored()[p.id]||{}; document.querySelector('#dialogProduct').innerHTML=`<h2>${escapeHTML(p.name)}</h2><p class="small">${escapeHTML(p.brand||'')} • ${escapeHTML(p.category||'')}</p>`;
  document.querySelector('#confirmedValue').value=s.value??''; document.querySelector('#confirmedPortion').value=s.portion||p.portion||''; document.querySelector('#confirmedNote').value=s.note||'';
  document.querySelector('#deleteSavedBtn').classList.toggle('hidden',!stored()[p.id]); editDialog.showModal();
}
document.querySelector('#saveConfirmedBtn').onclick=()=>{
  const raw=document.querySelector('#confirmedValue').value; if(raw===''){toast('Enter a confirmed value');return}
  const s=stored(); s[editing.id]={value:Number(raw),portion:document.querySelector('#confirmedPortion').value.trim(),note:document.querySelector('#confirmedNote').value.trim(),savedAt:new Date().toISOString(),product:editing}; saveStored(s); editDialog.close();
  if(document.querySelector('#searchView').classList.contains('active'))renderProducts(currentProducts,resultsTitle.textContent,resultMeta.textContent); else renderSaved(); toast('Confirmed value saved');
};
document.querySelector('#deleteSavedBtn').onclick=()=>{const s=stored();delete s[editing.id];saveStored(s);editDialog.close();renderSaved();toast('Removed')};

function renderSavedCount(){document.querySelector('#savedCount').textContent=`${Object.keys(stored()).length} saved`}
function renderSaved(){const arr=Object.entries(stored()).map(([id,s])=>s.product).filter(Boolean); currentProducts=arr; document.querySelector('#savedResults').innerHTML=arr.length?arr.map(cardHTML).join(''):'<div class="empty">No confirmed foods yet. Search for a food, then tap “Add confirmed value”.</div>';renderSavedCount()}

// Saved view has separate cards container, so delegate editing there too.
document.querySelector('#savedResults').onclick=e=>{const b=e.target.closest('.editValue');if(b){const p=savedProductFromStore(b.dataset.id);if(p)openEditor(p)}};

document.querySelector('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Super Slimmer',version:APP_VERSION,exportedAt:new Date().toISOString(),foods:stored()},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`super-slimmer-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)};
document.querySelector('#importInput').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const j=JSON.parse(await file.text());if(!j.foods||typeof j.foods!=='object')throw 0;saveStored(j.foods);renderSaved();toast('Backup imported')}catch{toast('That backup file is not valid')}};

document.querySelector('#calcCalories').oninput=e=>{const n=Number(e.target.value);document.querySelector('#calcPoints').textContent=e.target.value===''?'—':roundHalf(n/20)};

// Barcode scanner where the browser exposes the BarcodeDetector API.
let scanStream=null,scanTimer=null;
async function startScanner(){
  const dialog=document.querySelector('#scanDialog'),status=document.querySelector('#scanStatus'),video=document.querySelector('#scanVideo'); dialog.showModal();
  if(!('BarcodeDetector' in window)){status.textContent='This browser does not expose direct barcode detection. Type the barcode into Search instead.';return}
  try{
    scanStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}}); video.srcObject=scanStream; const det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']}); status.textContent='Point the camera at the product barcode.';
    const tick=async()=>{if(!dialog.open)return;try{const codes=await det.detect(video);if(codes[0]?.rawValue){document.querySelector('#searchInput').value=codes[0].rawValue;stopScanner();dialog.close();searchFoods(codes[0].rawValue);return}}catch{}scanTimer=requestAnimationFrame(tick)};tick();
  }catch{status.textContent='Camera access was unavailable. You can type the barcode into Search.'}
}
function stopScanner(){if(scanTimer)cancelAnimationFrame(scanTimer);scanStream?.getTracks().forEach(t=>t.stop());scanStream=null}
document.querySelector('#scanBtn').onclick=startScanner; document.querySelector('#scanClose').onclick=()=>{stopScanner();document.querySelector('#scanDialog').close()};document.querySelector('#scanDialog').addEventListener('close',stopScanner);

let deferredPrompt; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.querySelector('#installBtn').classList.remove('hidden')});document.querySelector('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.querySelector('#installBtn').classList.add('hidden')};
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
renderProducts(starterFoods,'Popular basics','offline starter library');renderSavedCount();
