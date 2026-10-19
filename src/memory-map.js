export const MAP_OPTIONS = Object.freeze({minZoom:1,maxZoom:11,scrollWheelZoom:false,bounceAtZoomLimits:false});
export function groupPoints(points, distance = 46) {
  const groups = [];
  for (const point of points) {
    const group = groups.find(g => Math.hypot(g.x-point.x,g.y-point.y)<distance);
    if (group) group.items.push(point);
    else groups.push({x:point.x,y:point.y,items:[point]});
  }
  return groups;
}
function startMemoryMap() {
  const element=document.querySelector('[data-memory-map]');
  if (!element) return;
  const tileStatus=document.querySelector('[data-tile-status]');
  if (!window.L) {tileStatus.hidden=false;tileStatus.textContent='The interactive map could not start. All stories are available below.';return;}
  const L=window.L;
  const cards=[...document.querySelectorAll('[data-memory]')];
  const filters=[...document.querySelectorAll('[data-category-filter]')];
  const counter=document.querySelector('#memory-count');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backdrop=element.querySelector('svg');backdrop.remove();element.replaceChildren();
  const map=L.map(element,{...MAP_OPTIONS,zoomAnimation:!reduced,fadeAnimation:!reduced,markerZoomAnimation:!reduced,worldCopyJump:true}).setView([25,-20],2);
  // One-finger swipes can scroll the page on touch devices; pinch and buttons zoom.
  if (window.matchMedia('(pointer: coarse)').matches) map.dragging.disable();
  element.addEventListener('touchstart',event=>{if(event.touches.length>1)map.dragging.enable();else map.dragging.disable();},{passive:true});
  L.svgOverlay(backdrop,[[-85.05112878,-180],[85.05112878,180]],{interactive:false,attribution:'<a href="https://www.naturalearthdata.com/">Natural Earth</a>'}).addTo(map);
  const tiles=L.tileLayer(element.dataset.tileUrl,{maxZoom:11,minZoom:1,noWrap:false,updateWhenIdle:true,keepBuffer:0,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
  tiles.on('tileerror',()=>{tileStatus.hidden=false;});
  const layer=L.layerGroup().addTo(map);
  let category='all';
  const shown=()=>cards.filter(card=>category==='all'||card.dataset.category===category);
  const coordinates=card=>[Number(card.dataset.lat),Number(card.dataset.lon)];
  function updateCount() {
    const entries=shown();
    const inView=entries.filter(card=>map.getBounds().contains(coordinates(card))).length;
    counter.textContent=entries.length+(entries.length===1?' story':' stories')+' · '+inView+' in this map view. All matching stories are listed below.';
  }
  function openStory(card) {
    for(const item of cards)item.classList.toggle('is-selected',item===card);
    card.querySelector('details').open=true;
    card.focus({preventScroll:true});card.scrollIntoView({block:'nearest',behavior:'instant'});
  }
  function popup(cardsInPin) {
    const content=document.createElement('div');
    for(const card of cardsInPin) {
      const copy=card.cloneNode(true);copy.removeAttribute('id');copy.removeAttribute('tabindex');copy.removeAttribute('data-memory');copy.hidden=false;copy.className='memory-popup';
      // Dates, category and full story stay readable in the popup as well as the list.
      copy.querySelector('details').open=true;
      const jump=document.createElement('button');jump.type='button';jump.textContent='Read in the list';jump.addEventListener('click',()=>openStory(card));copy.append(jump);content.append(copy);
    }
    return content;
  }
  function draw() {
    const points=shown().map(card=>({...map.latLngToContainerPoint(coordinates(card)),card}));
    layer.clearLayers();
    for(const group of groupPoints(points)) {
      const members=group.items.map(item=>item.card);
      const kinds=new Set(members.map(card=>card.dataset.category));
      const categoryClass=kinds.size===1?' category-'+members[0].dataset.category:'';
      const label=members.length===1?members[0].querySelector('h2').textContent+', '+members[0].querySelector('.memory-place').textContent:members.length+' nearby stories. Open to browse them.';
      const marker=L.marker(coordinates(members[0]),{title:label,alt:label,keyboard:true,icon:L.divIcon({className:'memory-leaflet-pin'+categoryClass,html:'<span class="pin-dot" aria-hidden="true">'+(members.length>1?members.length:'')+'</span>',iconSize:[44,44],iconAnchor:[22,22]})}).addTo(layer);
      marker.bindPopup(()=>popup(members),{maxHeight:300,maxWidth:300,minWidth:200,autoPan:!reduced});
    }
    updateCount();
  }
  for(const button of filters)button.addEventListener('click',()=>{
    category=button.dataset.categoryFilter;map.closePopup();
    for(const filter of filters)filter.setAttribute('aria-pressed',String(filter===button));
    for(const card of cards){card.hidden=category!=='all'&&card.dataset.category!==category;card.classList.remove('is-selected');}
    document.querySelector('[data-memory-empty]').hidden=shown().length>0;draw();
  });
  for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{
    map.closePopup();
    if(button.dataset.view==='world')map.setView([20,0],map.getMinZoom(),{animate:!reduced});
    else if(shown().length)map.fitBounds(L.latLngBounds(shown().map(coordinates)),{padding:[45,45],maxZoom:11,animate:!reduced});
  });
  // These are actions rather than persistent toggle states once a user pans the map.
  for(const button of document.querySelectorAll('[data-view]'))button.removeAttribute('aria-pressed');
  map.on('zoomend',draw);map.on('moveend',updateCount);
  new ResizeObserver(()=>{map.invalidateSize();draw();}).observe(element);
  document.querySelector('[data-map-controls]').hidden=false;
  draw();
}
if(typeof document!=='undefined') {
  if(document.readyState==='complete') startMemoryMap();
  else window.addEventListener('load',startMemoryMap,{once:true});
}
