const APP_VERSION = '0.3.0';
const STORAGE_KEY = 'super-slimmer-confirmed-v1';

const SOURCE_FREE='https://www.slimmingworld.co.uk/blog/discover-slimming-world-free-foods/';
const SOURCE_SHOP='https://www.slimmingworld.co.uk/blog/savvy-shopping/';
const SOURCE_HE='https://www.slimmingworld.co.uk/blog/slimming-world-changes-2026/';
const SOURCE_RANGE='https://www.slimmingworld.co.uk/food-range/our-products';
const SOURCE_KETCHUP='https://www.slimmingworld.co.uk/recipes/classic-big-breakfast';
const SOURCE_SPEED='https://www.slimmingworld.co.uk/blog/slimming-world-speed-foods/';
const SOURCE_SPEED_LIST='https://swlads.co.uk/slimming-world-speed-foods/';
const SOURCE_FREE_LIST='https://swlads.co.uk/slimming-world-free-foods/';

const categories = [
  ['Loose & fresh','🍎','Fruit, vegetables, meat, fish, eggs and staples'],
  ['Tinned & jars','🥫','Beans, tomatoes, pulses, fish and jars'],
  ['Packets & cupboard','📦','Plain rice, pasta, noodles, cereals and dry goods'],
  ['Chilled','🧊','Yogurts, cheese, desserts and ready meals'],
  ['Frozen','❄️','Frozen meals, vegetables, chips and desserts'],
  ['Snacks & sweets','🍫','Crisps, chocolate, biscuits and snack bars'],
  ['Drinks','🥤','Soft drinks, juices and hot drinks'],
  ['Bakery','🍞','Bread, rolls, wraps and cakes'],
  ['Sauces & condiments','🍅','Sauces, dressings, spreads and condiments']
];

function free(url=SOURCE_FREE){return {status:'free',sourceUrl:url,sourceLabel:'Public Slimming World guidance'}}
function healthyExtra(){return {status:'healthy_extra',sourceUrl:SOURCE_HE,sourceLabel:'Public Slimming World 2026 guidance',note:'Healthy Extras use measured portions; check current member information for the exact allowance.'}}
function swips(value,url,note=''){return {status:'swips',value,sourceUrl:url,sourceLabel:'Public Slimming World guidance',note}}
function unknownSwips(){return {status:'unknown',sourceUrl:SOURCE_HE,sourceLabel:'Classification needs checking',note:'This type of food is commonly counted as Swips, but the exact product value is not inferred from calories.'}}
function f(id,name,category,brand,kcal,portion,emoji,type,plan){return {id,name,category,brand,kcal,portion,emoji,type,plan,source:'Built-in public-reference library'}}

const speedNames=[
 'Apple','Apricots','Blackberries','Blackcurrants','Clementines','Cranberries','Damsons','Gooseberries','Grapefruit','Guava','Lemon','Lime','Loganberries','Mandarins','Melon','Nectarines','Oranges','Papaya','Passion fruit','Peaches','Pears','Plums','Pomelo','Raspberries','Redcurrants','Rhubarb','Satsumas','Star fruit','Strawberries','Tangerines','Ugli fruit','Whitecurrants',
 'Acorn squash','Alfalfa sprouts','Artichokes','Asparagus','Aubergine','Baby sweetcorn','Bamboo shoots','Bean sprouts','Beetroot','Broccoli','Brussels sprouts','Butternut squash','Cabbage','Capers','Carrots','Cauliflower','Celeriac','Celery','Chard','Chicory','Chillies','Chinese leaf','Courgettes','Cucumber','Endive','Fennel','Green beans','Garlic','Gherkins','Kale','Leeks','Lettuce','Mangetout','Marrow','Mushrooms','Mustard & cress','Okra','Onions','Pak choi','Peppers','Pumpkin','Radicchio','Radishes','Rocket','Runner beans','Samphire','Shallots','Spaghetti squash','Spinach','Spring greens','Spring onions','Sugar snap peas','Swede','Tomatillos','Tomatoes','Turnip','Water chestnuts','Watercress'
];
const freeNames=[
 'Banana','Blueberries','Cherries','Figs','Grapes','Kiwi fruit','Mango','Pineapple','Potatoes, plain','Sweet potatoes, plain','Parsnips, plain','Sweetcorn, plain','Peas, plain',
 'Eggs','Chicken breast, skinless','Turkey breast, skinless','Lean beef, visible fat removed','Lean pork, visible fat removed','Lean ham, visible fat removed','Cod, plain','Haddock, plain','Salmon, plain','Tuna in spring water, drained','Prawns, plain','Crab, plain',
 'Dried pasta, plain','Rice, plain','Noodles, plain','Couscous, plain','Beans, plain','Lentils, plain','Chickpeas, plain','Kidney beans, plain','Baked beans in tomato sauce','Fat-free natural yogurt','Fat-free natural fromage frais','Quark, plain','Low-fat cottage cheese, plain',
 'Passata, no added oil','Tomato purée, no added oil','Soy sauce','Vinegar','Herbs and spices','Stock cubes / broth','Sugar-free squash','Low-calorie fizzy drinks','Black coffee','Tea without milk or sugar','Mineral water'
];
function genericCategory(name){const n=name.toLowerCase();if(/yogurt|fromage|quark|cottage cheese/.test(n))return 'Chilled';if(/passata|purée|soy sauce|vinegar|herbs|stock/.test(n))return 'Sauces & condiments';if(/pasta|rice|noodles|couscous/.test(n))return 'Packets & cupboard';if(/beans|lentils|chickpeas|tuna/.test(n))return 'Tinned & jars';if(/squash|fizzy|coffee|tea|water/.test(n))return 'Drinks';return 'Loose & fresh'}
function genericEmoji(name){const n=name.toLowerCase();if(/fish|cod|haddock|salmon|tuna|prawn|crab/.test(n))return '🐟';if(/chicken|turkey|beef|pork|ham/.test(n))return '🍗';if(/egg/.test(n))return '🥚';if(/pasta|noodle/.test(n))return '🍝';if(/rice|couscous/.test(n))return '🍚';if(/bean|lentil|chickpea/.test(n))return '🫘';if(/yogurt|fromage|quark|cottage/.test(n))return '🥣';if(/squash|fizzy|water|coffee|tea/.test(n))return '🥤';return '🥬'}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
const expandedSpeedFoods=speedNames.map(name=>f('speed-'+slug(name),name,'Loose & fresh','Generic',null,'plain / whole food',genericEmoji(name),'speed',{status:'speed',sourceUrl:SOURCE_SPEED_LIST,sourceLabel:'Current independent 2026 Speed list',note:'Cross-check against current member materials for plan-critical use.'}));
const expandedFreeFoods=freeNames.map(name=>f('free-'+slug(name),name,genericCategory(name),'Generic',null,'plain / as described',genericEmoji(name),'free',{status:'free',sourceUrl:SOURCE_FREE_LIST,sourceLabel:'Current independent 2026 Free Food list',note:'Plain/unprocessed form only unless the description says otherwise.'}));

const starterFoods=[
 ...expandedSpeedFoods,...expandedFreeFoods,
 f('bakery-wholemeal','Wholemeal bread','Bakery','Generic',247,'measured portion','🍞','bread',healthyExtra()),
 f('sauce-ketchup','Tomato ketchup','Sauces & condiments','Generic',112,'1 level tbsp','🍅','sauce',swips(1,SOURCE_KETCHUP,'Official recipe states 1 Swip per level tbsp.')),
 f('snack-crisps','Potato crisps, ready salted','Snacks & sweets','Generic',530,'check pack/portion','🥔','snack',unknownSwips()),
 f('snack-chocolate','Milk chocolate','Snacks & sweets','Generic',535,'check pack/portion','🍫','snack',unknownSwips()),
 f('drink-cola','Cola, regular','Drinks','Generic',42,'check serving','🥤','drink',unknownSwips())
].filter((p,i,a)=>a.findIndex(x=>x.name.toLowerCase()===p.name.toLowerCase())===i);

function roundHalf(n){return Math.round(n*2)/2}
function estimatePoints(kcal){return Number.isFinite(kcal) ? roundHalf(kcal/20) : null}
function stored(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}}
function saveStored(v){localStorage.setItem(STORAGE_KEY,JSON.stringify(v)); renderSavedCount()}
function escapeHTML(s=''){return String(s).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}

function normalizeProduct(p){
  const kcal=Number(p?.nutriments?.['energy-kcal_100g']);
  const cats=(p.categories||'').split(',').map(x=>x.trim()).filter(Boolean);
  const brand=p.brands||'Unknown brand';
  const isSW=/^slimming world$/i.test(brand.trim())||/(^|,)\s*slimming world\s*(,|$)/i.test(brand);
  return {id:'off-'+(p.code||crypto.randomUUID()),code:p.code||'',name:p.product_name_en||p.product_name||p.generic_name_en||p.generic_name||'Unnamed product',brand,category:mapCategory(cats.join(' ')),kcal:Number.isFinite(kcal)?kcal:null,portion:p.serving_size||'per 100g',image:p.image_front_small_url||p.image_front_url||'',source:'Open Food Facts',type:'packaged',quantity:p.quantity||'',plan:isSW?{status:'free',sourceUrl:SOURCE_RANGE,sourceLabel:'Slimming World food-range statement',note:'Slimming World states its own food range is guaranteed totally Free. Check packaging/current range if this is an old listing.'}:{status:'unknown'}};
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
function savedFor(p){return stored()[p.id] || (p.code && stored()['barcode-'+p.code]) || null}
function normalizeSaved(s){if(!s)return null;if(!s.status&&s.value!==''&&Number.isFinite(Number(s.value)))return {...s,status:'swips',value:Number(s.value)};return s}
function classificationFor(p){
  const mine=normalizeSaved(savedFor(p));
  if(mine?.status)return {status:mine.status,value:mine.value===''?null:Number(mine.value),portion:mine.portion||p.portion,note:mine.note||'',confirmed:true,sourceLabel:'My saved classification'};
  return {...(p.plan||{status:'unknown'}),portion:p.portion,confirmed:false};
}
function statusText(c){if(c.status==='free')return 'FREE';if(c.status==='speed')return 'SPEED FREE';if(c.status==='healthy_extra')return 'HEALTHY EXTRA';if(c.status==='swips')return Number.isFinite(c.value)?`${c.value} SWIPS`:'SWIPS';return 'NEEDS CHECKING'}
function statusClass(c){return ({free:'free',speed:'speed',healthy_extra:'healthy',swips:'swips',unknown:'unknown'})[c.status]||'unknown'}
function statusSub(c){if(c.confirmed)return 'my saved classification';if(c.status==='free'||c.status==='speed')return 'public guidance';if(c.status==='healthy_extra')return 'measured portion';if(c.status==='swips')return 'public value';return 'no verified SW value'}

function cardHTML(p){
  const c=classificationFor(p),mine=c.confirmed,estimate=estimatePoints(p.kcal);
  const img=p.image?`<img class="foodImg" src="${escapeHTML(p.image)}" alt="" loading="lazy">`:`<div class="foodImg placeholder">${p.emoji||'🍽️'}</div>`;
  const evidence=(!mine&&p.plan?.sourceUrl)?`<a class="evidenceLink" href="${escapeHTML(p.plan.sourceUrl)}" target="_blank" rel="noreferrer">Why this classification?</a>`:'';
  return `<article class="foodCard" data-id="${escapeHTML(p.id)}"><div class="foodTop">${img}<div class="foodMain"><div class="foodName">${escapeHTML(p.name)}</div><div class="brand">${escapeHTML(p.brand||'')} ${p.quantity?'• '+escapeHTML(p.quantity):''}</div><div class="badges"><span class="badge">${escapeHTML(p.category)}</span>${mine?'<span class="badge confirmed">✓ personally confirmed</span>':''}${p.source==='Open Food Facts'?'<span class="badge">live product data</span>':''}</div></div><div class="planBox ${statusClass(c)}"><span class="planMain">${escapeHTML(statusText(c))}</span><span class="planSub">${escapeHTML(statusSub(c))}</span></div></div><div class="foodMeta"><div class="metaCell"><b>${p.kcal??'—'}</b><span>kcal / 100g${p.portion==='100ml'?' or ml':''}</span></div><div class="metaCell"><b>${escapeHTML(c.portion||'—')}</b><span>classification portion</span></div><div class="metaCell"><b>${estimate===null?'—':estimate}</b><span>calorie fallback only</span></div></div>${(c.note||p.plan?.note)?`<div class="planNote">${escapeHTML(c.note||p.plan.note)}</div>`:''}<div class="foodActions">${evidence}${p.code?`<button class="smallBtn copyBarcode" data-code="${escapeHTML(p.code)}">Barcode ${escapeHTML(p.code)}</button>`:''}<button class="smallBtn editValue" data-id="${escapeHTML(p.id)}">${mine?'Edit classification':'Confirm classification'}</button></div></article>`;
}

const results=document.querySelector('#results'),resultsTitle=document.querySelector('#resultsTitle'),resultMeta=document.querySelector('#resultMeta');
let currentProducts=[...starterFoods];
function renderProducts(list,title='Results',meta=''){currentProducts=list;resultsTitle.textContent=title;resultMeta.textContent=meta;results.innerHTML=list.length?list.map(cardHTML).join(''):'<div class="empty">No foods found. Try another search or barcode.</div>'}
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900)}

async function searchFoods(q){
  q=q.trim(); if(!q){renderProducts(starterFoods,'Popular basics','public-reference starter library');return}
  const local=starterFoods.filter(p=>`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  renderProducts(local,`Searching “${q}”`,'checking live UK products…');
  try{
    let products=[];
    if(/^\d{8,14}$/.test(q)){
      const url=`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(q)}.json?fields=code,product_name,product_name_en,generic_name,generic_name_en,brands,quantity,serving_size,categories,image_front_small_url,image_front_url,nutriments`;
      const r=await fetch(url); const j=await r.json(); if(j.status===1&&j.product)products=[normalizeProduct(j.product)];
    }else{
      const params=new URLSearchParams({search_terms:q,search_simple:'1',action:'process',json:'1',page_size:'24',countries_tags:'en:united-kingdom',fields:'code,product_name,product_name_en,generic_name,generic_name_en,brands,quantity,serving_size,categories,image_front_small_url,image_front_url,nutriments'});
      let r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`); let j=await r.json(); products=(j.products||[]).map(normalizeProduct).filter(p=>p.name!=='Unnamed product');
      if(!products.length){params.delete('countries_tags'); r=await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`); j=await r.json(); products=(j.products||[]).map(normalizeProduct).filter(p=>p.name!=='Unnamed product')}
    }
    const merged=[...local,...products.filter(p=>!local.some(l=>l.id===p.id))];
    renderProducts(merged,`Results for “${q}”`,`${products.length} live packaged • ${local.length} public-reference`);
  }catch{renderProducts(local,`Results for “${q}”`,local.length?'live lookup unavailable • showing built-in matches':'live lookup unavailable');toast('Live food lookup unavailable')}
}

document.querySelector('#searchBtn').onclick=()=>searchFoods(document.querySelector('#searchInput').value);
document.querySelector('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')searchFoods(e.currentTarget.value)});
document.querySelectorAll('.categoryQuick').forEach(b=>b.onclick=()=>showCategory(b.dataset.category));
function showCategory(cat){switchView('searchView'); const list=starterFoods.filter(p=>p.category===cat); renderProducts(list,cat,`${list.length} public-reference foods • search for branded products`); document.querySelector('#searchInput').value=''}
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
function savedProductFromStore(id){return stored()[id]?.product||null}
function openEditor(p){
  editing=p; const s=normalizeSaved(stored()[p.id])||{}, inferred=p.plan||{status:'unknown'};
  document.querySelector('#dialogProduct').innerHTML=`<h2>${escapeHTML(p.name)}</h2><p class="small">${escapeHTML(p.brand||'')} • ${escapeHTML(p.category||'')}</p>`;
  document.querySelector('#classificationStatus').value=s.status||inferred.status||'unknown';
  document.querySelector('#confirmedValue').value=s.value??(inferred.status==='swips'&&Number.isFinite(inferred.value)?inferred.value:'');
  document.querySelector('#confirmedPortion').value=s.portion||p.portion||''; document.querySelector('#confirmedNote').value=s.note||'';
  toggleSwipField(); document.querySelector('#deleteSavedBtn').classList.toggle('hidden',!stored()[p.id]); editDialog.showModal();
}
function toggleSwipField(){const show=document.querySelector('#classificationStatus').value==='swips';document.querySelector('#swipValueLabel').classList.toggle('hidden',!show)}
document.querySelector('#classificationStatus').onchange=toggleSwipField;
document.querySelector('#saveConfirmedBtn').onclick=()=>{
  const status=document.querySelector('#classificationStatus').value, raw=document.querySelector('#confirmedValue').value;
  if(status==='swips'&&(raw===''||!Number.isFinite(Number(raw)))){toast('Enter the Swip value');return}
  const s=stored(); s[editing.id]={status,value:status==='swips'?Number(raw):'',portion:document.querySelector('#confirmedPortion').value.trim(),note:document.querySelector('#confirmedNote').value.trim(),savedAt:new Date().toISOString(),product:editing}; saveStored(s); editDialog.close();
  if(document.querySelector('#searchView').classList.contains('active'))renderProducts(currentProducts,resultsTitle.textContent,resultMeta.textContent);else renderSaved();toast('Classification saved')
};
document.querySelector('#deleteSavedBtn').onclick=()=>{const s=stored();delete s[editing.id];saveStored(s);editDialog.close();renderSaved();toast('Removed')};
function renderSavedCount(){document.querySelector('#savedCount').textContent=`${Object.keys(stored()).length} saved`}
function renderSaved(){const arr=Object.values(stored()).map(s=>s.product).filter(Boolean);currentProducts=arr;document.querySelector('#savedResults').innerHTML=arr.length?arr.map(cardHTML).join(''):'<div class="empty">No confirmed foods yet. Search for a food, then tap “Confirm classification”.</div>';renderSavedCount()}
document.querySelector('#savedResults').onclick=e=>{const b=e.target.closest('.editValue');if(b){const p=savedProductFromStore(b.dataset.id);if(p)openEditor(p)}};

document.querySelector('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Super Slimmer',version:APP_VERSION,exportedAt:new Date().toISOString(),foods:stored()},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`super-slimmer-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)};
document.querySelector('#importInput').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const j=JSON.parse(await file.text());if(!j.foods||typeof j.foods!=='object')throw 0;saveStored(j.foods);renderSaved();toast('Backup imported')}catch{toast('That backup file is not valid')}};
document.querySelector('#calcCalories').oninput=e=>{const n=Number(e.target.value);document.querySelector('#calcPoints').textContent=e.target.value===''?'—':roundHalf(n/20)};

let stream=null,scanTimer=null;
document.querySelector('#scanBtn').onclick=async()=>{
 if(!('BarcodeDetector'in window)){toast('Camera barcode scanning is not supported here — type the barcode instead');return}
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});document.querySelector('#scanVideo').srcObject=stream;document.querySelector('#scanDialog').showModal();const detector=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']});scanTimer=setInterval(async()=>{try{const codes=await detector.detect(document.querySelector('#scanVideo'));if(codes[0]?.rawValue){document.querySelector('#searchInput').value=codes[0].rawValue;closeScanner();searchFoods(codes[0].rawValue)}}catch{}},500)}catch{toast('Camera permission was not available')}
};
function closeScanner(){clearInterval(scanTimer);stream?.getTracks().forEach(t=>t.stop());document.querySelector('#scanDialog').close()}
document.querySelector('#closeScan').onclick=closeScanner;document.querySelector('#closeEdit').onclick=()=>editDialog.close();
let deferredPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.querySelector('#installBtn').classList.remove('hidden')});document.querySelector('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.querySelector('#installBtn').classList.add('hidden')};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
renderProducts(starterFoods,'Popular basics','public-reference starter library');renderSavedCount();