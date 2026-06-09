/* DogTrain foundation — core app (global, classic script: inline onclick + global S preserved).
 * Loaded BEFORE foundation/features/*.js. The AI feature surfaces (002–006) live in those
 * <dt-*> custom elements and consume the globals defined here:
 *   S, trackEvent(), getPersonalizationContext(), getVariant()/setVariant(), renderCare(), toastP().
 * Core screens (onboarding→plan→today→care→progress→paywall) stay plain global functions on purpose. */

/* ---------- state ---------- */
const LS='dogtrain_proto_v1';
let S=load()||freshState();
function freshState(){return{dog:{name:'',avatar:'🐶',size:'',age:'',weight:'',activity:'',goal:'',living:''},
  step:0, plan:null, completions:{}, firstWin:false, push:null, trialDaysLeft:7, trialEnded:false,
  care:null, variants:{ask_rex:'variant'}, tipIdx:0, tipFb:null, missionIdx:0, events:[]};}
function save(){try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem(LS))}catch(e){return null}}
function resetAll(){S=freshState();save();render();show('welcome');document.getElementById('tabbar').style.display='none';document.getElementById('evtoggle').style.display='none';
  const ar=document.querySelector('dt-ask-rex'); if(ar)ar.reset();
  const pt=document.querySelector('dt-product-tour'); if(pt)pt.reset();
  applyAiVariants(); renderAbPanel();
  trackEvent('demo_reset');}

/* ---------- analytics (simulated trackEvent) ---------- */
function trackEvent(name,props){const e={name,props:props||{},ts:new Date().toLocaleTimeString('uk')};S.events.push(e);save();renderEvents();}
function renderEvents(){const log=document.getElementById('evlog');if(!log)return;
  log.innerHTML=S.events.slice().reverse().map(e=>`<div class="evrow"><span class="evd-time">${e.ts}</span> <span class="evname">${e.name}</span>${Object.keys(e.props).length?`\n<span class="evprops">${JSON.stringify(e.props)}</span>`:''}</div>`).join('')||'<span class="muted">подій ще немає</span>';}
function toggleEvents(){document.getElementById('evdrawer').classList.toggle('show');}

/* ---------- navigation ---------- */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.dataset.screen===id));
  document.getElementById('viewport').scrollTop=0;
  document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('sel',b.dataset.tab===id));
  if(id==='progress')renderProgress();
  if(id==='care'){renderCare();const _ql=document.querySelector('dt-quick-log');if(_ql)_ql.applyVariant();}
  if(id==='week')renderWeek();
  if(id==='today'){renderToday();trackEvent('app_opened',{day_since_install:1,screen:'today'});}
}

/* ---------- onboarding (8 steps) ---------- */
const STEPS=[
 {key:'name',type:'name',q:"Як звати вашого песика?",emoji:'🐶'},
 {key:'size',type:'opt',q:"Який розмір / група породи?",opts:[['🐕‍🦺','Велика'],['🐕','Середня'],['🐩','Маленька']]},
 {key:'age',type:'opt',q:"Скільки років?",opts:[['🍼','Цуценя (до 1р)'],['🦴','Дорослий (1–7р)'],['🧓','Старший (7+)']]},
 {key:'weight',type:'weight',q:"Вага (необов'язково)",emoji:'⚖️'},
 {key:'activity',type:'opt',q:"Рівень активності?",opts:[['🛋️','Спокійний'],['🚶','Помірний'],['⚡','Дуже активний']]},
 {key:'goal',type:'opt',q:"Головна ціль?",opts:[['❤️','Здоров’я'],['🎾','Активність'],['🎓','Поведінка / тренування']]},
 {key:'living',type:'opt',q:"Умови життя?",opts:[['🏡','Приватний двір'],['🏢','Квартира']]},
 {key:'confirm',type:'confirm',q:"Перевірмо профіль"}
];
function startOnboarding(){S.step=0;save();trackEvent('onboarding_started',{source:'welcome'});show('onb');renderStep();}
function renderStep(){
  const i=S.step, st=STEPS[i];
  document.getElementById('stepCounter').textContent=`Крок ${i+1}/8`;
  document.getElementById('onbBar').style.width=((i+1)/8*100)+'%';
  const body=document.getElementById('stepBody'); let h='';
  h+=`<h1 style="margin-top:6px">${st.q}</h1>`;
  if(st.type==='name'){
    h+=`<div class="avatars">${['🐶','🐕','🐩','🦮','🐕‍🦺','🌭'].map(a=>`<button class="${S.dog.avatar===a?'sel':''}" onclick="pickAvatar('${a}')">${a}</button>`).join('')}</div>`;
    h+=`<input class="field" id="nameInput" placeholder="Напр., Рекс" value="${S.dog.name||''}" oninput="S.dog.name=this.value;refreshNext()">`;
  }else if(st.type==='weight'){
    h+=`<p class="muted">Допоможе точніше підібрати навантаження.</p>`;
    h+=`<input class="field" id="wInput" inputmode="decimal" placeholder="кг" value="${S.dog.weight||''}" oninput="S.dog.weight=this.value">`;
  }else if(st.type==='opt'){
    h+=st.opts.map(([e,l])=>`<button class="opt ${S.dog[st.key]===l?'sel':''}" onclick="pickOpt('${st.key}','${l}')"><span class="o-emoji">${e}</span> ${l}<span class="check">✓</span></button>`).join('');
  }else if(st.type==='confirm'){
    h+=`<div class="listcard">
      <div class="row"><span class="r-emoji">${S.dog.avatar}</span><div><b>${S.dog.name||'Песик'}</b></div></div>
      <div class="row"><span class="r-emoji">📋</span><div>${S.dog.size||'—'} · ${S.dog.age||'—'}${S.dog.weight?(' · '+S.dog.weight+' кг'):''}</div></div>
      <div class="row"><span class="r-emoji">🎯</span><div>${S.dog.activity||'—'} · ${S.dog.goal||'—'} · ${S.dog.living||'—'}</div></div>
    </div>`;
  }
  body.innerHTML=h;
  document.getElementById('skipBtn').style.display=(st.key==='weight')?'block':'none';
  const nb=document.getElementById('nextBtn'); nb.textContent=(st.type==='confirm')?'Згенерувати план ✨':'Далі';
  refreshNext();
}
function pickAvatar(a){S.dog.avatar=a;save();renderStep();}
function pickOpt(k,v){S.dog[k]=v;save();trackEvent('onboarding_step_completed',{step:S.step+1,field:k});renderStep();
  // auto-advance for choice steps
  setTimeout(()=>{if(S.step<7)nextStepInternal();},180);}
function refreshNext(){const st=STEPS[S.step];let ok=true;
  if(st.type==='name')ok=!!(S.dog.name&&S.dog.name.trim());
  if(st.type==='opt')ok=!!S.dog[st.key];
  document.getElementById('nextBtn').disabled=!ok;}
function nextStep(){const st=STEPS[S.step];
  if(st.type!=='opt')trackEvent('onboarding_step_completed',{step:S.step+1,field:st.key});
  nextStepInternal();}
function nextStepInternal(){
  if(S.step>=7){generatePlan();return;}
  S.step++;save();renderStep();
}
function prevStep(){if(S.step===0){show('welcome');return;}S.step--;save();renderStep();}
function skipStep(){trackEvent('onboarding_step_skipped',{step:S.step+1});nextStepInternal();}

/* ---------- rules engine (no AI/ML) ---------- */
const WALK={'Маленька':{'Спокійний':10,'Помірний':15,'Дуже активний':25},'Середня':{'Спокійний':15,'Помірний':25,'Дуже активний':40},'Велика':{'Спокійний':20,'Помірний':35,'Дуже активний':55}};
const TRAIN=['«Сидіти»','«Лежати»','«До мене» (підкликання)','Ходьба на повідку','«Місце»','«Дай лапу»','Витримка'];
const CARE_T=['Свіжа вода + огляд лап','Чищення зубів','Розчісування','Огляд вух','Підрізати кігті (огляд)'];
function generatePlan(){
  const size=S.dog.size||'Середня', act=S.dog.activity||'Помірний', goal=S.dog.goal||'Здоров’я';
  const base=(WALK[size]&&WALK[size][act])||20;
  const days=[];const names=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];
  for(let d=0;d<7;d++){
    const walkMin=base+(goal==='Активність'?10:0)+(d%2?5:0);
    const tasks=[];
    if(d===0)tasks.push({emoji:'🚶',type:'walk',title:'Коротка прогулянка',min:10,trivial:true,why:'Найлегший перший крок — щоб почати'});
    else tasks.push({emoji:'🚶',type:'walk',title:'Прогулянка',min:walkMin,why:'Активність для здоров’я та настрою'});
    const tr=TRAIN[(d*(goal==='Поведінка / тренування'?2:1))%TRAIN.length];
    tasks.push({emoji:'🦴',type:'training',title:'Тренування '+tr,min:5,why:'5 хвилин навичок щодня'});
    tasks.push({emoji:'💧',type:'care',title:CARE_T[d%CARE_T.length],min:3,why:'Щоденний догляд'});
    days.push({name:names[d],tasks});
  }
  S.plan={days,goal,size,createdTs:Date.now()};
  S.care=defaultCare();
  save();
  trackEvent('dog_profile_completed',{breed_group:size,age_band:S.dog.age,activity:act});
  trackEvent('plan_generated',{tasks_total:21,goal});
  trackEvent('trial_started',{days:7,card:false});
  document.getElementById('planTitle').textContent=`План для ${S.dog.name||'песика'} готовий!`;
  document.getElementById('planSub').textContent=`На основі: ${size.toLowerCase()} · ${S.dog.age||''} · ${act.toLowerCase()} · ціль: ${goal.toLowerCase()}`;
  document.getElementById('planMeta').textContent='7 днів · 3 завдання/день';
  show('plan');
}
function defaultCare(){const puppy=(S.dog.age||'').includes('Цуценя');
  return[
    {emoji:'💉',title:'Щеплення',status:puppy?'crit':'warn',note:puppy?'наступне за 5 днів':'за 12 днів'},
    {emoji:'🩺',title:'Ветеринар',status:'mut',note:'не задано'},
    {emoji:'✂️',title:'Грумінг',status:'ok',note:'за 3 тижні'},
    {emoji:'🪱',title:'Дегельмінтизація',status:'crit',note:'прострочено'}
  ];}

/* ---------- today ---------- */
function goToday(first){document.getElementById('tabbar').style.display='flex';document.getElementById('evtoggle').style.display='block';
  applyAiVariants(); renderAbPanel();
  show('today');}
function todayCompletions(){S.completions['0']=S.completions['0']||[];return S.completions['0'];}
function renderToday(){
  if(!S.plan){show('welcome');return;}
  document.getElementById('todayHello').textContent=`Привіт! ${S.dog.name||'Песик'} ${S.dog.avatar}`;
  document.getElementById('dayName').textContent=S.plan.days[0].name;
  const done=todayCompletions();
  const list=document.getElementById('taskList');
  list.innerHTML=S.plan.days[0].tasks.map((t,idx)=>{
    const isDone=done.includes(idx);
    return `<div class="task ${isDone?'done':''}" onclick="toggleTask(${idx})">
      <div class="box">${isDone?'✓':''}</div>
      <div style="flex:1"><div class="t-title">${t.emoji} ${t.title}</div>
      <div class="t-why">${t.min} хв · ${t.why}</div></div></div>`;
  }).join('');
  updateRing();
  const _tip=document.querySelector('dt-ai-tip'); if(_tip)_tip.render();          // 003
  const _ad=document.querySelector('dt-adaptive'); if(_ad)_ad.render();           // 006
  document.getElementById('todayTrial').style.display=S.trialEnded?'none':'flex';
  document.getElementById('todayTrial').innerHTML='✨ Trial: '+S.trialDaysLeft+' днів лишилось';
}
function updateRing(){const done=todayCompletions().length;const p=Math.round(done/3*100);
  ['ring','ring2'].forEach(id=>{const r=document.getElementById(id);if(r){r.style.setProperty('--p',p);r.dataset.label=done+'/3';}});}
function toggleTask(idx){
  const done=todayCompletions();const i=done.indexOf(idx);
  if(i>=0){done.splice(i,1);}
  else{
    done.push(idx); navigator.vibrate&&navigator.vibrate(15);
    const t=S.plan.days[0].tasks[idx];
    trackEvent('task_completed',{task_id:'d0_'+idx,task_type:t.type,day_index:0});
    if(!S.firstWin){S.firstWin=true;save();trackEvent('first_win',{ttv_demo:true});
      setTimeout(()=>{if(S.push===null)document.getElementById('pushSheet').classList.add('show');},420);}
    if(done.length===3){trackEvent('day_completed',{day_index:0,tasks_done:3});celebrate();}
  }
  save();renderToday();
}
function pushDecision(yes){S.push=yes;save();document.getElementById('pushSheet').classList.remove('show');
  trackEvent('notification_permission',{granted:yes});
  const _t=document.querySelector('dt-product-tour'); if(_t)setTimeout(()=>_t.maybeAutoStart(),320);}  // 007: тур ПІСЛЯ першої перемоги (не блокує TTV)

/* ---------- confetti ---------- */
function celebrate(){const c=document.getElementById('confetti');c.innerHTML='';
  const colors=['#e08a2b','#1f8a8a','#f0c14b','#7fd1c8','#ffb27a'];
  for(let i=0;i<60;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';
    s.style.background=colors[i%colors.length];s.style.animationDelay=(Math.random()*.5)+'s';
    s.style.transform='rotate('+Math.random()*360+'deg)';c.appendChild(s);}
  c.classList.add('show');setTimeout(()=>c.classList.remove('show'),2000);}

/* ---------- care / week / progress ---------- */
function renderCare(){if(!S.care)S.care=defaultCare();
  document.getElementById('careList').innerHTML=S.care.map(c=>`<div class="row"><span class="r-emoji">${c.emoji}</span><div>${c.title}</div><span class="badge b-${c.status}">${c.note}</span></div>`).join('');}
function addCareDemo(){S.care.push({emoji:'🛁',title:'Купання',status:'ok',note:'заплановано'});save();renderCare();trackEvent('care_event_added',{type:'bath'});}
function renderWeek(){if(!S.plan)return;
  document.getElementById('weekList').innerHTML=S.plan.days.map((d,i)=>{
    const done=(S.completions[i]||[]).length;
    const dots=i===0?('●'.repeat(done)+'◌'.repeat(3-done)):'◌◌◌';
    return `<div class="weekday"><b style="width:28px">${d.name}</b><span class="dots">${dots}</span><span class="muted" style="margin-left:auto;font-size:.82rem">3 завдання</span></div>`;
  }).join('');}
function renderProgress(){const done=todayCompletions().length;
  document.getElementById('progToday').textContent='Сьогодні: '+done+'/3';
  document.getElementById('progStreak').textContent='Днів поспіль: 0 (стрік — у Фазі 3)';
  updateRing();
  document.getElementById('progWeek').innerHTML=(S.plan?S.plan.days:[]).map((d,i)=>{
    const c=(S.completions[i]||[]).length;return `<div class="row"><b style="width:28px">${d.name}</b><span class="dots">${'●'.repeat(c)}${'◌'.repeat(3-c)}</span></div>`;}).join('');
  document.getElementById('progTrial').innerHTML=S.trialEnded?'🔒 Trial завершено':('✨ Trial активний · '+S.trialDaysLeft+' дн.');
  const _m=document.querySelector('dt-missions'); if(_m)_m.render();               // 004
}
function simulateTrialEnd(){S.trialEnded=true;S.trialDaysLeft=0;save();trackEvent('paywall_viewed',{reason:'trial_end'});show('paywall');}

/* ---------- PersonalizationContext (ai-personalization-context enabler) ---------- */
function getPersonalizationContext(){
  const d=S.dog||{}, done=todayCompletions().length;
  const total=Object.values(S.completions||{}).reduce((a,b)=>a+(b?b.length:0),0);
  return {
    dog:{name:d.name||'Рекс', breedGroup:d.size||'Середня', ageBand:d.age||'', weightKg:(d.weight||null), activity:d.activity||'', living:d.living||''},
    goal:d.goal||'',
    progress:{completedToday:done, completedTotal:total},
    flags:{variant:getVariant('ask_rex')}   // live A/B-стан (не stale), єдине джерело — getVariant
  };
}
/* ---------- A/B variant hook (foundation Consumer Contract: getVariant) ---------- */
/* Кожна AI-фіча має власну A/B-поверхню; default 'variant' (демо показує фічу), 'control' = без поверхні. */
const VARIANT_DEFAULTS={ask_rex:'variant', ai_daily_tip:'variant', ai_missions:'variant', quick_log:'variant', adaptive_plan:'variant', product_tour:'variant'};
function getVariant(feature){return (S.variants&&S.variants[feature])||VARIANT_DEFAULTS[feature]||'control';}
function setVariant(feature,v){S.variants=S.variants||{};S.variants[feature]=v;save();trackEvent('ab_variant_set',{feature,variant:v});}

/* Unified A/B across every feature (each spec: «у control немає поверхні»). */
const AI_VARIANTS=[
  {key:'ask_rex', label:'Запитай'}, {key:'ai_daily_tip', label:'Порада'},
  {key:'ai_missions', label:'Місії'}, {key:'quick_log', label:'Швид.лог'}, {key:'adaptive_plan', label:'Адаптація'},
  {key:'product_tour', label:'Тур'}
];
function applyAiVariants(){
  const q=s=>document.querySelector(s);
  const ar=q('dt-ask-rex'); if(ar)ar.applyVariant();          // 002 — fab/overlay visibility
  const tip=q('dt-ai-tip'); if(tip)tip.render();              // 003 — render() self-gates on variant
  const ad=q('dt-adaptive'); if(ad)ad.render();               // 006
  const m=q('dt-missions'); if(m)m.render();                  // 004
  const ql=q('dt-quick-log'); if(ql)ql.applyVariant();        // 005 — show/hide input
  const pt=q('dt-product-tour'); if(pt)pt.applyVariant();     // 007 — «?» visibility / hide in control
}
function toggleAiVariant(feature){setVariant(feature, getVariant(feature)==='variant'?'control':'variant');applyAiVariants();renderAbPanel();}
function toggleAskRexVariant(){toggleAiVariant('ask_rex');}    // back-compat alias
function renderAbPanel(){const p=document.getElementById('abPanel'); if(!p)return;
  p.innerHTML='<div class="abpanel-h">A/B фічі — <i>control = без поверхні</i>:</div>'+
    AI_VARIANTS.map(v=>`<button class="abtog ${getVariant(v.key)==='variant'?'on':''}" onclick="toggleAiVariant('${v.key}')">${v.label}: <b>${getVariant(v.key)}</b></button>`).join('');
}

/* ---------- shared toast ---------- */
function toastP(m){let t=document.getElementById('toastP');if(!t){t=document.createElement('div');t.id='toastP';t.style.cssText='position:absolute;left:16px;right:16px;bottom:76px;background:#11141a;color:#fff;padding:11px 14px;border-radius:12px;z-index:46;font-size:.86rem;text-align:center';document.getElementById('phone').appendChild(t);}t.textContent=m;t.style.display='block';setTimeout(()=>{t.style.display='none';},2200);}

/* ---------- boot ---------- */
function render(){renderEvents();}
(function init(){
  // міграція стану зі старих версій (без поля variants) → дефолтний варіант, стан повний
  if(!S.variants){S.variants={ask_rex:VARIANT_DEFAULTS.ask_rex};save();}
  render(); renderAbPanel(); applyAiVariants();
  if(S.plan){goToday(true);} else if(S.step>0){show('onb');renderStep();}
  const ck=document.getElementById('clock');setInterval(()=>{const d=new Date();ck.textContent=d.getHours()+':'+String(d.getMinutes()).padStart(2,'0');},1000);
})();
