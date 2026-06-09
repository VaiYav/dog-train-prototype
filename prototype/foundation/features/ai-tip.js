/* 003-ai-daily-tip — <dt-ai-tip>
 * Personalized "tip of the day" grounded on getPersonalizationContext().
 * Custom element: app.js calls .render() from renderToday(). Internal listeners (no inline onclick). */
class DtAiTip extends HTMLElement {
  tipText(){
    const ctx=getPersonalizationContext(), d=ctx.dog, done=ctx.progress.completedToday, nm=d.name, goal=ctx.goal;
    const t=[];
    if(done===0) t.push(`Почни з найлегшого: коротка прогулянка «розблокує» решту дня для ${nm}.`);
    if(done>=1&&done<3) t.push(`Гарний темп! Ще ${3-done} — і день ${nm} закрито на 100%.`);
    if(done===3) t.push(`День ${nm} виконано повністю 🎉 Спокійний вечір і свіжа вода — теж важлива частина догляду.`);
    if(goal.includes('Поведінка')) t.push(`Ціль — поведінка: для ${nm} 5 хв тренування зранку дають більше, ніж одне довге заняття.`);
    if(goal.includes('Активність')) t.push(`Ціль — активність: ${d.breedGroup==='Велика'?'великому':'активному'} ${nm} краще 2 коротші прогулянки, ніж одна довга.`);
    if(d.ageBand.includes('Цуценя')) t.push(`${nm} ще цуценя — соціалізація зараз важливіша за трюки: нові звуки й поверхні потроху.`);
    if(d.ageBand.includes('Старший')) t.push(`${nm} у поважному віці — обери м'якший темп і слідкуй за суглобами.`);
    if(d.breedGroup==='Маленька') t.push(`Маленьким як ${nm} важливіша частота, ніж тривалість: коротко, але регулярно.`);
    t.push(`Кілька хвилин уваги щодня роблять для ${nm} більше, ніж рідкісні «великі» зусилля.`);
    return t[(S.tipIdx||0)%t.length];
  }
  render(){
    if(getVariant('ai_daily_tip')!=='variant'){this.innerHTML='';return;}   // A/B: control = без картки
    const fb=S.tipFb;
    this.innerHTML=`<div class="aitip">
      <div class="aitip-h">💡 Порада дня для ${S.dog.name||'Рекса'}
        <span class="aitip-tag">AI · персоналізовано</span>
        <button class="aitip-r" data-act="refresh" title="Інша порада" aria-label="Інша порада">↻</button></div>
      <div class="aitip-b">${this.tipText()}</div>
      <div class="aitip-f">${fb?`<span class="muted">${fb==='up'?'👍 Дякую за відгук!':'👎 Врахуємо'}</span>`
        :`<button data-fb="up">👍 Корисно</button><button data-fb="down">👎</button>`}
        <span class="aitip-note">у проді — LLM на ваших даних</span></div></div>`;
    if(!S._tipShown){S._tipShown=true;trackEvent('ai_tip_shown',{goal:S.dog.goal,age:S.dog.age});}
  }
  connectedCallback(){
    this.addEventListener('click', e=>{
      if(e.target.closest('[data-act=refresh]')){S.tipIdx=(S.tipIdx||0)+1;S.tipFb=null;save();this.render();trackEvent('ai_tip_refreshed',{idx:S.tipIdx});return;}
      const f=e.target.closest('[data-fb]'); if(f){S.tipFb=f.dataset.fb;save();this.render();trackEvent('ai_tip_feedback',{helpful:f.dataset.fb==='up'});}
    });
  }
}
customElements.define('dt-ai-tip', DtAiTip);
