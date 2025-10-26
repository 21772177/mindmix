async function withRetry(fn, attempts=3, delayMs=500){
  let lastErr = null;
  for(let i=0;i<attempts;i++){
    try{ return await fn(); }catch(e){ lastErr = e; await new Promise(r=>setTimeout(r, delayMs*(i+1))); }
  }
  throw lastErr;
}
module.exports = { withRetry };
