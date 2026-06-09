/* 006-adaptive-plan — <dt-adaptive>
 * "AI will adapt tomorrow" preview. LLM proposes (prod); rules validate bounds.
 * Custom element: app.js calls .render() from renderToday(). Display only, no controls. */
class DtAdaptive extends HTMLElement {
  preview(){
    const ctx=getPersonalizationContext(), done=ctx.progress.completedToday, nm=ctx.dog.name;
    if(done>=3) return {dir:'harder', msg:`Сьогодні всі 3 ✅ — завтра трохи складніше для ${nm}: +5 хв прогулянка або новий трюк.`};
    if(done===0) return {dir:'easier', msg:`Поки 0 виконано — завтра почнемо з легшого, щоб утримати ритм ${nm}.`};
    return {dir:'steady', msg:`Темп ${done}/3 — завтра тримаємо схожий рівень.`};
  }
  render(){
    if(getVariant('adaptive_plan')!=='variant'){this.innerHTML='';return;}   // A/B: control = без адаптації
    const a=this.preview();
    this.innerHTML=`<div class="adaptive"><span class="ad-h">🔄 AI підлаштує завтра <span class="ad-tag">rules-validated (1–3 завдання)</span></span><div class="ad-b">${a.msg}</div></div>`;
    // подія лише коли напрям адаптації змінився (rules-валідатор тримає межі 1–3 → у демо ніколи не rejected)
    if(a.dir!==this._lastDir){this._lastDir=a.dir;trackEvent('plan_adapted',{direction:a.dir});}
  }
}
customElements.define('dt-adaptive', DtAdaptive);
