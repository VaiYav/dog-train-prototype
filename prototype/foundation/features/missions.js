/* 004-ai-missions — <dt-missions>
 * Weekly mission personalized on goal + age. Custom element: app.js calls .render() from renderProgress(). */
class DtMissions extends HTMLElement {
  text(ctx){
    const g=ctx.goal||'', nm=ctx.dog.name, age=ctx.dog.ageBand||'';
    const M=[];
    if(g.includes('Поведінка')) M.push(`Навчіть ${nm} нову команду «дай п’ять» — 5 хв/день цього тижня.`);
    if(g.includes('Активність')) M.push(`Новий маршрут: знайдіть для ${nm} нову локацію прогулянки цього тижня.`);
    if(g.includes('Здоров')) M.push(`7 днів поспіль: свіжа вода + огляд лап ${nm} після кожної прогулянки.`);
    if(age.includes('Цуценя')) M.push(`Соціалізація: познайомте ${nm} з 3 новими звуками/поверхнями цього тижня.`);
    M.push(`Навчіть ${nm} спокійно чекати 10 секунд перед мискою.`);
    const accepted=S.missionsAccepted||[];                        // AC2: не пропонувати вже прийняте/опановане
    const pool=M.filter(m=>!accepted.includes(m)); const avail=pool.length?pool:M;
    return avail[(S.missionIdx||0)%avail.length];
  }
  render(){
    if(getVariant('ai_missions')!=='variant'){this.innerHTML='';return;}   // A/B: control = без місій
    this.innerHTML=`<div class="mission"><div class="m-h">🎯 Місія тижня для ${S.dog.name||'Рекса'}</div>
      <div class="m-b">${this.text(getPersonalizationContext())}</div>
      <div class="m-actions"><button class="m-go" data-act="accept">Прийняти</button><button class="m-alt" data-act="other">↻ Інша</button></div></div>`;
    if(!S._missionShown){S._missionShown=true;trackEvent('ai_mission_shown',{goal:S.dog.goal});}
  }
  connectedCallback(){
    this.addEventListener('click', e=>{
      if(e.target.closest('[data-act=other]')){S.missionIdx=(S.missionIdx||0)+1;save();this.render();trackEvent('ai_mission_refreshed',{});return;}
      if(e.target.closest('[data-act=accept]')){
        const cur=this.querySelector('.m-b')?.textContent||'';
        S.missionsAccepted=S.missionsAccepted||[]; if(cur&&!S.missionsAccepted.includes(cur))S.missionsAccepted.push(cur);
        save(); trackEvent('ai_mission_accepted',{}); toastP('🎯 Місію прийнято — додано в план!'); this.render();   // не повториться
      }
    });
  }
}
customElements.define('dt-missions', DtMissions);
