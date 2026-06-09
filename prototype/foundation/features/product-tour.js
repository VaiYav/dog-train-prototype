/* 007-product-tour — <dt-product-tour>  (NON-AI, deterministic coach marks)
 * Short guided walkthrough of key surfaces (highlight + tooltip card). Skippable, non-blocking,
 * shown once (S.tourSeen), relaunchable via the "?" button. Default trigger = AFTER first win
 * (app.js pushDecision → maybeAutoStart) so it never delays time-to-value. A/B getVariant('product_tour').
 * Consumes globals: S, save(), trackEvent(), getVariant(). No PersonalizationContext / LLM. */
class DtProductTour extends HTMLElement {
  connectedCallback(){
    // fixed sequence (≤5). Steps whose target is hidden (feature in control / wrong screen) are skipped.
    this.TOUR=[
      {sel:'#taskList',              title:'Екран «Сьогодні»',       body:'Тут 1–3 завдання на день під твого песика. Відмічай виконане — це твоя перша перемога.'},
      {sel:'dt-ai-tip .aitip',       title:'💡 Порада дня',          body:'Персональна підказка під породу/вік/ціль — свіжий привід заходити щодня.'},
      {sel:'#tabbar',                title:'Догляд і Прогрес',        body:'Внизу — вкладки: «Догляд» (нагадування, швидкий лог) і «Прогрес» (місії, тиждень).'},
      {sel:'dt-ask-rex .ask-fab',    title:'💬 Запитай про Рекса',    body:'Питай будь-що про свого песика — відповіді під його дані. Діагнози — лише до ветеринара.'}
    ];
    this.i=0;
    this.innerHTML=`
      <button class="tour-help" aria-label="Показати тур по застосунку" title="Тур по застосунку">?</button>
      <div class="tour-overlay" role="dialog" aria-modal="true" aria-label="Тур по застосунку">
        <div class="tour-ring" aria-hidden="true"></div>
        <div class="tour-card">
          <div class="tour-step"></div>
          <div class="tour-title"></div>
          <div class="tour-body"></div>
          <div class="tour-dots"></div>
          <div class="tour-actions"><button class="btn secondary tour-skip" style="width:auto">Пропустити</button><button class="btn tour-next" style="width:auto">Далі →</button></div>
        </div>
      </div>`;
    this.help=this.querySelector('.tour-help');
    this.overlay=this.querySelector('.tour-overlay');
    this.ring=this.querySelector('.tour-ring');
    this.help.addEventListener('click',()=>this.start(true));
    this.querySelector('.tour-skip').addEventListener('click',()=>this.end('skipped'));
    this.querySelector('.tour-next').addEventListener('click',()=>this.next());
    this.overlay.addEventListener('click',e=>{ if(e.target===this.overlay)this.end('skipped'); });  // tap dim = skip (non-blocking)
    window.addEventListener('resize',()=>{ if(this.overlay.classList.contains('show'))this.position(); });
  }

  applyVariant(){
    const on=getVariant('product_tour')==='variant';
    const appStarted=document.getElementById('tabbar').style.display==='flex';
    this.help.style.display=(on && appStarted) ? 'flex' : 'none';   // «?» лише в застосунку (не на онбордингу)
    if(!on)this.end('hidden', true);                                 // control → ховаємо тур, без події
  }
  maybeAutoStart(){ if(getVariant('product_tour')==='variant' && !S.tourSeen) this.start(false); }
  reset(){ this.help.style.display='none'; this.end('hidden', true); }

  start(manual){
    if(getVariant('product_tour')!=='variant')return;
    this.overlay.classList.add('show'); trackEvent('tour_started',{manual:!!manual}); this.step(0);
  }
  visibleTarget(sel){ const el=document.querySelector(sel); if(!el)return null; const r=el.getBoundingClientRect(); return (r.width>0&&r.height>0)?el:null; }
  isLast(i){ for(let k=i+1;k<this.TOUR.length;k++){ if(this.visibleTarget(this.TOUR[k].sel)) return false; } return true; }
  step(i){
    while(i<this.TOUR.length && !this.visibleTarget(this.TOUR[i].sel)) i++;   // skip hidden targets
    if(i>=this.TOUR.length){ this.end('completed'); return; }
    this.i=i; const s=this.TOUR[i], el=this.visibleTarget(s.sel);
    el.scrollIntoView({block:'center',behavior:'auto'});
    this.position();
    this.querySelector('.tour-step').textContent=`Крок ${i+1}/${this.TOUR.length}`;
    this.querySelector('.tour-title').textContent=s.title;
    this.querySelector('.tour-body').textContent=s.body;
    this.querySelector('.tour-dots').innerHTML=this.TOUR.map((_,k)=>`<span class="${k===i?'on':''}">●</span>`).join('');
    this.querySelector('.tour-next').textContent=this.isLast(i) ? 'Готово' : 'Далі →';
    trackEvent('tour_step',{n:i+1});
    this.querySelector('.tour-next').focus();                                 // a11y: фокус у діалог
  }
  position(){
    const el=this.visibleTarget(this.TOUR[this.i].sel); if(!el)return;
    const pr=document.getElementById('phone').getBoundingClientRect(), tr=el.getBoundingClientRect(), pad=6;
    this.ring.style.left=(tr.left-pr.left-pad)+'px';
    this.ring.style.top=(tr.top-pr.top-pad)+'px';
    this.ring.style.width=(tr.width+pad*2)+'px';
    this.ring.style.height=(tr.height+pad*2)+'px';
  }
  next(){ this.step(this.i+1); }
  end(reason, silent){
    this.overlay.classList.remove('show');
    if(reason==='completed'||reason==='skipped'){ S.tourSeen=true; save(); }
    if(!silent && (reason==='completed'||reason==='skipped')) trackEvent('tour_'+reason,{});
    if(this.help && this.help.style.display!=='none') this.help.focus();      // a11y: повернути фокус
  }
}
customElements.define('dt-product-tour', DtProductTour);
