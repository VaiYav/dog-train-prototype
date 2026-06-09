/* 001-daily-focus — A/B prototype logic (own store; isolated from the foundation app).
 * Lives on its own page (daily-focus.html), so global S / setVariant / render do NOT collide with foundation. */
const TASKS=[
  {emoji:'🚶',title:'Прогулянка',sub:'15 хв · активність і настрій'},
  {emoji:'🦴',title:'Тренування «сидіти»',sub:'5 хв навичок'},
  {emoji:'💧',title:'Свіжа вода + огляд лап',sub:'щоденний догляд'}
];
let S=fresh();
function fresh(){return{variant:'control',day:1,streak:0,freeze:1,doneToday:[],firstWin:false,
  reminderOn:false,reminderTime:'Вечір 18:00',prevDayDone:true,events:[],lastVarSwitch:0};}

function setVariant(v){S=fresh();S.variant=v;
  document.getElementById('segC').classList.toggle('on',v==='control');
  document.getElementById('segV').classList.toggle('on',v==='variant');
  document.getElementById('segV').classList.toggle('v',v==='variant');
  document.getElementById('abnote').textContent=v==='control'
    ? 'A/B: control — фундамент без активного стріку/нагадування'
    : 'A/B: variant — щоденне нагадування + гуманний стрік (петля)';
  track('experiment_exposure',{flag:'daily_focus'});
  render();
}
function track(name,props){props=props||{};props.variant=S.variant;
  S.events.push({name,props,t:new Date().toLocaleTimeString('uk')});renderEv();}
function renderEv(){const l=document.getElementById('evlog');if(!l)return;
  l.innerHTML=S.events.slice().reverse().map(e=>`<div class="evrow"><span class="evt">${e.t}</span> <span class="evname">${e.name}</span> <span class="evvar">{variant:${e.props.variant}${Object.keys(e.props).filter(k=>k!=='variant').map(k=>', '+k+':'+JSON.stringify(e.props[k])).join('')}}</span></div>`).join('')||'<span style="color:#6b7b88">подій ще немає</span>';}
function toggleEv(){document.getElementById('evdrawer').classList.toggle('show');}

function render(){
  const isV=S.variant==='variant';
  const chip=document.getElementById('streak');
  if(isV){chip.className='streak on';chip.title='Серія днів поспіль';chip.textContent='🔥 '+S.streak;}
  else{chip.className='streak off';chip.title='Стрік вимкнено у control';chip.textContent='🔥 0';}
  const bs=document.getElementById('bannerSlot');
  if(isV){const toWeek=Math.max(0,7-S.streak);bs.innerHTML=
    `<div class="sbanner"><div class="row1">🔥 Серія: ${S.streak} ${plural(S.streak)} ${S.streak>0?'— не загуби сьогодні!':'— почни сьогодні!'}</div>
     <div class="sbar"><span style="width:${Math.min(100,S.streak/7*100)}%"></span></div>
     <div class="abnote" style="margin-top:6px">${toWeek>0?('ще '+toWeek+' до повного тижня 🏆'):'тиждень закрито! 🏆'} · ❄️ заморозок: ${S.freeze}</div></div>`;}
  else bs.innerHTML='';
  const rs=document.getElementById('reminderSlot');
  if(isV&&S.reminderOn&&S.day>1&&S.doneToday.length===0){rs.innerHTML=
    `<div class="reminder">🔔 <div><b>${S.reminderTime}</b> · DogTrain<br><small>Час подбати про Рекса 🐾 — 3 завдання. Серія: ${S.streak} 🔥</small></div></div>`;}
  else rs.innerHTML='';
  document.getElementById('dayLabel').textContent='Сьогодні · День '+S.day;
  document.getElementById('taskList').innerHTML=TASKS.map((t,i)=>{
    const d=S.doneToday.includes(i);
    return `<div class="task ${d?'done':''}" onclick="toggle(${i})"><div class="box">${d?'✓':''}</div>
      <div><div class="t-title">${t.emoji} ${t.title}</div><div class="t-sub">${t.sub}</div></div></div>`;}).join('');
}
function plural(n){return n===1?'день':(n>=2&&n<=4?'дні':'днів');}

function toggle(i){const k=S.doneToday.indexOf(i);
  if(k>=0){S.doneToday.splice(k,1);render();return;}
  S.doneToday.push(i);navigator.vibrate&&navigator.vibrate(12);
  const first=S.doneToday.length===1;
  track('task_completed',{task_type:TASKS[i].title,day_index:S.day-1});
  if(first){
    if(S.variant==='variant'){S.streak++;chipPop();track('streak_incremented',{n:S.streak});
      if(S.streak===3||S.streak===7){celebrate(S.streak);track('streak_milestone',{n:S.streak});}}
    if(!S.firstWin){S.firstWin=true;track('first_win',{});
      if(S.variant==='variant'&&!S.reminderOn)setTimeout(()=>document.getElementById('optin').classList.add('show'),400);}
  }
  if(S.doneToday.length===3)track('day_completed',{day_index:S.day-1});
  render();
}
function chipPop(){const c=document.getElementById('streak');c.classList.add('pop');setTimeout(()=>c.classList.remove('pop'),420);}

let pickedTime='Вечір 18:00';
function pickTime(el,t){document.querySelectorAll('#times button').forEach(b=>b.classList.remove('sel'));el.classList.add('sel');pickedTime=t;}
function enableReminder(){S.reminderOn=true;S.reminderTime=pickedTime;closeOptin();
  track('reminder_scheduled',{time:pickedTime});toast('🔔 Нагадування увімкнено: '+pickedTime);render();}
function closeOptin(){document.getElementById('optin').classList.remove('show');if(!S.reminderOn)track('notification_permission',{granted:false});}

function nextDay(){
  const completedToday=S.doneToday.length>0;
  if(S.variant==='variant'){
    if(!completedToday){
      if(S.freeze>0){S.freeze--;toast('❄️ Заморозка серії використана — серію збережено ('+S.streak+' 🔥). Без паніки!');track('streak_frozen',{kept:S.streak});}
      else{S.streak=0;toast('Серію скинуто, але це ок — почни нову сьогодні 💪');track('streak_reset',{});}
    }
    if(S.reminderOn){track('reminder_fired',{time:S.reminderTime});}
  }
  S.day++; S.doneToday=[];
  if(S.day%7===1)S.freeze=Math.min(1,S.freeze+1);
  track('app_opened',{day_since_install:S.day-1});
  if(S.variant==='variant'&&S.reminderOn)track('reminder_opened',{});
  render();
}
function resetDemo(){const v=S.variant;S=fresh();S.variant=v;render();track('demo_reset',{});}

function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600);}
function celebrate(n){const c=document.getElementById('confetti');c.innerHTML='';const cols=['#ef6c2e','#e08a2b','#1f8a8a','#f0c14b','#7fd1c8'];
  for(let i=0;i<70;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.background=cols[i%cols.length];
    s.style.animationDelay=(Math.random()*.5)+'s';s.style.transform='rotate('+Math.random()*360+'deg)';c.appendChild(s);}
  c.classList.add('show');setTimeout(()=>c.classList.remove('show'),2100);
  toast(n===7?'🏆 Тиждень поспіль! Перший тижневий план — твій!':'🎉 '+n+' дні поспіль! Так тримати!');}

setVariant('control');
