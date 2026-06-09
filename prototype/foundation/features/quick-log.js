/* 005-quick-log — <dt-quick-log>
 * Text → care events (LLM parse in prod; keyword parse in proto), with confirmation.
 * Self-contained custom element placed in the Care screen. Writes S.care, then calls global renderCare(). */
class DtQuickLog extends HTMLElement {
  parse(text){
    const t=(text||'').toLowerCase(), ev=[];
    if(/гуля|прогул|walk/.test(t)){const m=t.match(/(\d+)\s*(хв|min)/);ev.push('🚶 Прогулянка'+(m?' '+m[1]+' хв':''));}
    if(/ліки|глист|дегельм|таблет/.test(t)) ev.push('🪱 Ліки / дегельмінтизація');
    if(/їв|їс|корм|годув|food/.test(t)) ev.push('🍽 Годування');
    if(/мий|купа|грум|bath/.test(t)) ev.push('🛁 Грумінг');
    if(/трен|команд|trick/.test(t)) ev.push('🦴 Тренування');
    if(!ev.length) ev.push('📝 Подія догляду');
    return ev;
  }
  connectedCallback(){
    this.innerHTML=`<div class="qlog"><input class="ql-in" placeholder="напр., погуляли 30 хв, дав ліки" aria-label="Швидкий лог дня"><button class="ql-run">Розпізнати</button></div>
      <div class="logres"></div>`;
    this.input=this.querySelector('.ql-in');
    this.res=this.querySelector('.logres');
    this.querySelector('.ql-run').addEventListener('click',()=>this.run());
    this.input.addEventListener('keydown',e=>{if(e.key==='Enter')this.run();});
    this.res.addEventListener('click',e=>{
      if(e.target.closest('[data-act=confirm]')){this.confirm();return;}
      if(e.target.closest('[data-act=cancel]'))this.res.classList.remove('show');
    });
  }
  applyVariant(){ this.style.display = getVariant('quick_log')==='variant' ? '' : 'none'; }  // A/B: control = без поля
  run(){
    const text=(this.input.value||'').trim(); if(!text)return;
    const ev=this.parse(text); this._n=ev.length;
    this.res.innerHTML=`Розпізнано:<div class="chips">${ev.map(e=>`<span class="chip2">${e}</span>`).join('')}</div>
      <div class="conf"><button class="m-go" data-act="confirm">Підтвердити</button>
      <button class="m-alt" data-act="cancel">Скасувати</button></div>`;
    this.res.classList.add('show'); trackEvent('ai_log_parsed',{n:ev.length});
  }
  confirm(){
    this.res.classList.remove('show'); this.input.value='';
    if(!S.care)S.care=defaultCare(); S.care.unshift({emoji:'✅',title:'Залоговано (швидкий лог)',status:'ok',note:'щойно'});
    save(); renderCare(); trackEvent('ai_log_confirmed',{n:this._n}); toastP('✍️ Записано в догляд');
  }
}
customElements.define('dt-quick-log', DtQuickLog);
