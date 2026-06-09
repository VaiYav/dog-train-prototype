/* 002-ai-ask-rex — <dt-ask-rex>
 * Grounded Q&A about the dog. Safety guardrail (constitution III): medical → vet redirect, no diagnosis.
 * A/B surface via getVariant('ask_rex'): variant = chat exists; control = no chat.
 * Self-contained custom element. Public methods used by app.js: applyVariant(), toggleVariant(), reset().
 * Consumes globals: S, getPersonalizationContext(), getVariant()/setVariant(), trackEvent(). */

/* Safety-фільтр: широке покриття симптомів — за невпевненості краще «до ветеринара». */
const ASK_MEDICAL = new RegExp([
  'хвор','болит','болі','біль','симптом','температ','гаряч','кров','отру',            // загальні
  'блюв','блює','блюют','рвот','рве','нудит','нудот','понос','пронос','діаре','запор', // ШКТ
  'кашл','задих','важко дих','не можу дих','дихає важко','хрип',                       // дихання
  'опух','набряк','червон','запал','гній','свербіж','інфекц','отит','висип','короста',// запалення/шкіра
  'кульга','шкутиль','паралі','не піднім','не вста','хитаєт','дрож','тремт','судом','конвульс', // невро/ОРА
  'схуд','худне','апетит','не їсть','не їв','не їла','відмов.*їж','нічого не їсть',     // апетит/вага
  'млявий','млява','слабк','летарг','непритом','зомлі',                                // загальний стан
  'поранен','поріз','опік',                                                            // травми
  'доз','таблет','скільки.*лік','лік.*скільки','лік.*дава','дава.*лік','можна.*лік'    // дозування ліків
].join('|'));
const ASK_KB = [
  {topic:'walk', match:/гуля|прогул|скільки.*ход|вигул|бігат|активн.*скільки/,
   answer:c=>{const d=c.dog,mins=d.breedGroup==='Велика'?'40–60':d.breedGroup==='Маленька'?'20–30':'30–45';
     const age=d.ageBand.includes('Цуценя')?' Для цуценя — коротше й частіше.':d.ageBand.includes('Старший')?' Для старшого — м’якший темп, стеж за суглобами.':'';
     return `Для ${(d.breedGroup||'середнього').toLowerCase()} ${(d.activity||'').toLowerCase()} ${d.name} — орієнтовно ${mins} хв/день, краще 2 виходи.${age}`;}},
  {topic:'feeding', match:/год|їс|їж|корм|раціон|порці/,
   answer:c=>`Годуй ${c.dog.name} за віком (${c.dog.ageBand||'дорослий'})${c.dog.weightKg?` і вагою (${c.dog.weightKg} кг)`:' і вагою'}, у стабільний час, 1–2 рази на день. Точні порції краще звірити з ветеринаром.`},
  {topic:'behavior', match:/гавк|вночі|повед|кус|тягне|стриб|гризе|непослух|бо[ї20]ться|страх/,
   answer:c=>`Для ${c.dog.name} (ціль: ${(c.goal||'поведінка').toLowerCase()}) — короткі регулярні тренування (5 хв/день > разові заняття) і не заохочуй небажане увагою. Послідовність важливіша за суворість.`},
  {topic:'training', match:/трен|вчит|навчит|трюк|сидіти|лежати|до мене|привчит|команд/,
   answer:c=>`Почни з 1 навички за раз, коротко (5 хв) і з ласощами як винагородою. Для ${c.dog.name} ${c.dog.ageBand.includes('Цуценя')?'зараз база — ім’я, «до мене», туалет.':'працює правило «проси те, що майже виходить» і поступово ускладнюй.'}`},
  {topic:'care', match:/догляд|кігт|зуб|вух|шерст|купа|грум|блох|кліщ|чист|линя/,
   answer:c=>`Базовий догляд для ${c.dog.name}: огляд лап і вух після прогулянок, зуби 2–3 р/тиждень, кігті за потреби, розчісування за типом шерсті. Графік щеплень/обробок — у вкладці «Догляд».`},
];

class DtAskRex extends HTMLElement {
  connectedCallback(){
    this.innerHTML=`
      <button class="ask-fab" style="display:none" aria-label="Запитай про Рекса">💬 Запитай</button>
      <div class="askwrap" role="dialog" aria-modal="true" aria-label="Запитай про Рекса">
        <header><b>💬 Запитай про Рекса</b><span style="margin-left:auto;display:flex;gap:6px">
          <button class="btn secondary docs-btn" style="width:auto" title="Про фічу та безпеку" aria-label="Про фічу та безпеку">ℹ️</button>
          <button class="btn secondary close-btn" style="width:auto" title="Закрити чат" aria-label="Закрити чат">✕</button></span></header>
        <div class="asklog"></div>
        <div class="askchips"></div>
        <div class="askin"><input class="ask-in" placeholder="Запитай про свого песика…" aria-label="Питання про песика"><button class="send-btn" title="Відправити" aria-label="Відправити">➤</button></div>
        <div class="askdocs"></div>
      </div>`;
    this.fab=this.querySelector('.ask-fab');
    this.wrap=this.querySelector('.askwrap');
    this.log=this.querySelector('.asklog');
    this.chipsEl=this.querySelector('.askchips');
    this.input=this.querySelector('.ask-in');
    this.docs=this.querySelector('.askdocs');
    this.fab.addEventListener('click',()=>this.open());
    this.querySelector('.docs-btn').addEventListener('click',()=>this.openDocs());
    this.querySelector('.close-btn').addEventListener('click',()=>this.close());
    this.querySelector('.send-btn').addEventListener('click',()=>this.send());
    this.input.addEventListener('keydown',e=>{if(e.key==='Enter')this.send();});
    this.chipsEl.addEventListener('click',e=>{const b=e.target.closest('button'); if(b)this.do(b.textContent);});
    this.log.addEventListener('click',e=>{const f=e.target.closest('[data-fb]'); if(f)this.feedback(f.dataset.fb,f.dataset.topic,f);});
    this.docs.addEventListener('click',e=>{if(e.target.closest('[data-act=closedocs]'))this.closeDocs();});
    // NB: applyVariant() is driven by app.js goToday() (after app.js globals exist), not here at connect time.
  }

  /* ---- A/B surface ---- */
  applyVariant(){
    const on=getVariant('ask_rex')==='variant';
    this.fab.style.display=on?'block':'none';
    if(!on)this.close();
  }
  toggleVariant(){setVariant('ask_rex',getVariant('ask_rex')==='variant'?'control':'variant');this.applyVariant();}
  reset(){this.fab.style.display='none';this.close();this.log.innerHTML='';delete this.log.dataset.init;}

  /* ---- chat open/close ---- */
  open(){
    if(getVariant('ask_rex')!=='variant')return;             // guardrail: у control фічі немає
    this.wrap.classList.add('show'); this.closeDocs(); trackEvent('ai_qa_opened',{}); this.renderChips();
    if(!this.log.dataset.init){this.push('a',`Привіт! Питай про ${S.dog.name||'Рекса'} 🐶 Відповідаю під твого песика; діагнози — лише до ветеринара. Тисни ℹ️ зверху — як це працює.`,{});this.log.dataset.init='1';}
    if(this.input)this.input.focus();                        // a11y: фокус у діалог
  }
  close(){this.wrap.classList.remove('show'); if(this.fab&&this.fab.style.display!=='none')this.fab.focus();}

  renderChips(){
    const c=getPersonalizationContext(), age=c.dog.ageBand||'', goal=c.goal||'', chips=['Скільки гуляти?','Чим годувати?'];
    if(age.includes('Цуценя'))chips.push('Як соціалізувати цуценя?');
    else if(age.includes('Старший'))chips.push('Як берегти суглоби?');
    if(goal.includes('Поведінка'))chips.push('Чому гавкає вночі?','Як навчити команди?');
    else if(goal.includes('Активність'))chips.push('Який маршрут обрати?');
    else chips.push('Як доглядати щодня?');
    this.chipsEl.innerHTML=chips.slice(0,5).map(q=>`<button>${q}</button>`).join('');
  }

  /* ---- answering (grounded; medical → vet) ---- */
  classify(q){const t=(q||'').toLowerCase();if(ASK_MEDICAL.test(t))return 'medical';const hit=ASK_KB.find(k=>k.match.test(t));return hit?hit.topic:'general';}
  answer(q){
    const c=getPersonalizationContext(), nm=c.dog.name, topic=this.classify(q);
    if(topic==='medical') return {topic, med:true,
      a:`Я не ставлю діагнозів і не призначаю ліки. Якщо щось турбує у стані ${nm} — це привід звернутися до ветеринара. Можу підказати загальні питання, які варто йому поставити.`};
    const kb=ASK_KB.find(k=>k.topic===topic);
    if(kb) return {topic, med:false, a:kb.answer(c)};
    return {topic:'general', med:false,
      a:`Гарне питання про ${nm}! Для ${(c.dog.breedGroup||'середнього').toLowerCase()} ${c.dog.ageBand?c.dog.ageBand.toLowerCase()+' ':''}песика з ціллю «${(c.goal||'здоров’я').toLowerCase()}» головне — трохи уваги щодня + послідовність. Уточни деталь (прогулянки / їжа / поведінка / догляд) — підкажу конкретніше під ${nm}.`};
  }
  send(){if((this.input.value||'').trim()){this.do(this.input.value.trim());this.input.value='';}}
  do(q){
    this.push('q',q,{}); const r=this.answer(q);
    trackEvent('ai_qa_question',{topic:r.topic,medical:r.med});
    if(r.med)trackEvent('ai_qa_medical_redirect',{});        // guardrail: 0 діагнозів — лише ескалація
    const t0=performance.now(); this.showTyping();
    setTimeout(()=>{ this.hideTyping();
      this.push('a',r.a,{med:r.med,topic:r.topic,fb:true});
      trackEvent('ai_qa_answered',{topic:r.topic,medical:r.med,latency_ms:Math.round(performance.now()-t0)});
    },280);
  }

  /* ---- bubbles ---- */
  push(role,txt,opt){opt=opt||{};const b=document.createElement('div');b.className='bubble '+role;
    if(role==='q'){ b.textContent=txt; }                     // user input → textContent (no HTML injection)
    else{
      let html=txt;
      if(opt.med)html+='<span class="disc">⚠️ Не діагноз. Зверніться до ветеринара.</span>';
      if(opt.fb)html+=`<span class="fb"><button data-fb="up" data-topic="${opt.topic||''}">👍 Корисно</button><button data-fb="down" data-topic="${opt.topic||''}">👎</button></span>`;
      b.innerHTML=html;
    }
    this.log.appendChild(b);this.log.scrollTop=this.log.scrollHeight;}
  showTyping(){this.hideTyping();const b=document.createElement('div');b.className='bubble a typing';b.textContent='Рекс друкує…';this._typing=b;this.log.appendChild(b);this.log.scrollTop=this.log.scrollHeight;}
  hideTyping(){if(this._typing){this._typing.remove();this._typing=null;}}
  feedback(v,topic,el){trackEvent('ai_qa_feedback',{helpful:v==='up',topic});
    el.parentElement.outerHTML=`<span class="muted" style="font-size:.72rem">${v==='up'?'👍 дякую за відгук!':'👎 врахуємо'}</span>`;}

  /* ---- in-UI documentation ---- */
  openDocs(){
    const c=getPersonalizationContext();
    this.docs.innerHTML=`
      <h3>ℹ️ Про «Запитай про Рекса»</h3>
      <p class="muted" style="font-size:.84rem">Персональний Q&amp;A: відповіді grounded на даних саме твого песика, а не generic.</p>
      <div class="doc-sec"><b>🛡 Безпека (головний guardrail)</b>Ніколи не діагностуємо. Медичні теми → загальна порада + «не впевнений → до ветеринара». 0 діагнозів і доз (constitution III).</div>
      <div class="doc-sec"><b>🎯 На чому grounded</b>PersonalizationContext цього песика: <b>${c.dog.name}</b> · ${c.dog.breedGroup} · ${c.dog.ageBand||'вік —'} · ${c.dog.activity||'активність —'} · ціль: ${c.goal||'—'}.</div>
      <div class="doc-sec"><b>🔬 Прод vs прототип</b>Прод: PersonalizationContext + curated KB → prompt → LLM із safety-фільтром. Прототип: <code>answer(q)</code> — grounded відповіді за темами (демо).</div>
      <div class="doc-sec"><b>📊 Події</b><code>ai_qa_opened</code> · <code>ai_qa_question{topic,medical}</code> · <code>ai_qa_answered{topic,medical,latency_ms}</code> · <code>ai_qa_feedback{helpful,topic}</code> · <code>ai_qa_medical_redirect</code> · <code>ai_qa_docs_opened</code> · <code>ab_variant_set{feature,variant}</code>.</div>
      <div class="doc-sec"><b>🧪 A/B</b>Поверхня за <code>getVariant('ask_rex')</code> — зараз <b>${getVariant('ask_rex')}</b>. У <i>control</i> чату немає (метрика ask vs control). Перемкнути — у дровері «📊 events».</div>
      <button class="btn secondary" data-act="closedocs" style="margin-top:8px">← Назад до чату</button>`;
    this.docs.classList.add('show'); trackEvent('ai_qa_docs_opened',{});
  }
  closeDocs(){this.docs.classList.remove('show');}
}
customElements.define('dt-ask-rex', DtAskRex);
