(function(){
var KEY="planner-v1",S={tasks:{},notes:{},x:{},habits:[]},cur=new Date(),tab="a";
try{var r=localStorage.getItem(KEY);if(r){var p=JSON.parse(r);if(p&&p.tasks){S=p;S.x=S.x||{};S.habits=S.habits||[];S.notes=S.notes||{}}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function k(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function $(i){return document.getElementById(i)}
function X(){var key=k(cur);return S.x[key]=S.x[key]||{pr:{},ex:{},q:"",mood:0,gr:"",in:"",h:{}}}
var PC={h:"var(--hi)",m:"var(--md)",l:"var(--lo)"},PO={h:0,m:1,l:2};
var PRAY=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
var EXTRA=["Tahajjud","Morning adhkar","Evening adhkar","Sunnah & nafl prayers","Sadaqah (charity)","Voluntary fast"];
var MOODS=["Drained","Low","Steady","Strong","Locked in"];
var QUOTES=[["Discipline is choosing what you want most over what you want now.",""],["Be so consistent that your excuses get bored.",""],["Silence the noise. Do the work.",""],["Comfort is a slow leak. Choose the grind.",""],["Nobody is coming to save you. Build yourself.",""],["Mood is optional. Execution is not.",""],["Calm mind. Ruthless habits.",""],["Small wins, every day, no exceptions.",""],["Tie your camel, then trust in Allah. Plan, then rely.",""],["Indeed, with hardship comes ease.","Surah Ash-Sharh 94:6"],["Allah does not burden a soul beyond its capacity.","Surah Al-Baqarah 2:286"],["Win the morning, win the day.",""]];
var RANKS=["Rookie","Grinder","Disciplined","Relentless","Apex"];
function mk(label,on,ch,rm){var li=document.createElement("li");if(on)li.className="done";
  var c=document.createElement("input");c.type="checkbox";c.checked=!!on;c.onchange=function(){ch(c.checked);save();render()};
  var t=document.createElement("span");t.className="t";t.textContent=label;li.append(c,t);
  if(rm){var x=document.createElement("button");x.className="x";x.textContent="✕";x.setAttribute("aria-label","Delete");x.onclick=rm;li.appendChild(x)}
  return li}
function render(){
  var key=k(cur),x=X(),all=S.tasks[key]||[];
  $("dl").textContent=cur.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"});
  $("ds").textContent=cur.getFullYear();
  var q=QUOTES[Math.floor(cur.getTime()/864e5)%QUOTES.length];
  $("q").textContent=q[0];$("qs").textContent=q[1];
  var w=$("week");w.innerHTML="";
  var st=new Date(cur);st.setDate(cur.getDate()-cur.getDay());
  for(var i=0;i<7;i++){(function(){
    var d=new Date(st);d.setDate(st.getDate()+i);
    var b=document.createElement("button");b.className="day"+(k(d)===key?" sel":"")+(k(d)===k(new Date())?" today":"");
    var n=(S.tasks[k(d)]||[]).filter(function(t){return!t.d}).length;
    b.innerHTML="<span></span><b></b><span></span>";
    b.children[0].textContent=d.toLocaleDateString("en-US",{weekday:"short"});
    b.children[1].textContent=d.getDate();
    b.children[2].textContent=n?n+" left":"·";
    b.onclick=function(){cur=d;render()};w.appendChild(b)})()}
  var list=all.slice().sort(function(a,b){return (a.d-b.d)||((a.tm||"99")>(b.tm||"99")?1:(a.tm||"99")<(b.tm||"99")?-1:0)||(PO[a.p]-PO[b.p])});
  var ul=$("list");ul.innerHTML="";
  if(!list.length){var e=document.createElement("div");e.className="empty";e.textContent="No missions yet. Add your first one above.";ul.appendChild(e)}
  list.forEach(function(t){
    var li=mk(t.t,t.d,function(v){t.d=v},function(){S.tasks[key]=S.tasks[key].filter(function(o){return o.id!==t.id});save();render()});
    var dot=document.createElement("span");dot.className="dot";dot.style.background=PC[t.p];li.insertBefore(dot,li.children[1]);
    if(t.tm){var m=document.createElement("span");m.className="tm";m.textContent=t.tm;li.insertBefore(m,li.lastChild)}
    ul.appendChild(li)});
  var pl=$("pl");pl.innerHTML="";PRAY.forEach(function(n){pl.appendChild(mk(n,x.pr[n],function(v){x.pr[n]=v}))});
  var xl=$("xl");xl.innerHTML="";EXTRA.forEach(function(n){xl.appendChild(mk(n,x.ex[n],function(v){x.ex[n]=v}))});
  var hl=$("hl");hl.innerHTML="";
  if(!S.habits.length){var e2=document.createElement("div");e2.className="empty";e2.textContent="Set your own rules. Add a habit above.";hl.appendChild(e2)}
  S.habits.forEach(function(h){hl.appendChild(mk(h.n,x.h[h.id],function(v){x.h[h.id]=v},function(){S.habits=S.habits.filter(function(o){return o.id!==h.id});save();render()}))});
  var md=$("md");md.innerHTML="";MOODS.forEach(function(m,i){var b=document.createElement("button");b.className="mood"+(x.mood===i+1?" on":"");b.textContent=m;b.onclick=function(){x.mood=x.mood===i+1?0:i+1;save();render()};md.appendChild(b)});
  if(document.activeElement!==$("nn"))$("nn").value=S.notes[key]||"";
  if(document.activeElement!==$("in"))$("in").value=x.in||"";
  if(document.activeElement!==$("gr"))$("gr").value=x.gr||"";
  if(document.activeElement!==$("qp"))$("qp").value=x.q||"";
  var tot=all.length+PRAY.length+S.habits.length,dn=all.filter(function(t){return t.d}).length+PRAY.filter(function(n){return x.pr[n]}).length+S.habits.filter(function(h){return x.h[h.id]}).length;
  var pc=tot?Math.round(dn/tot*100):0;
  $("pc").textContent=pc+"%";$("rk").textContent=RANKS[pc>=100?4:Math.floor(pc/25)];
  $("pt").textContent=dn+" of "+tot+" completed";
  $("pb").style.width=pc+"%";
}
function add(){var v=$("nt").value.trim();if(!v)return;var key=k(cur);(S.tasks[key]=S.tasks[key]||[]).push({id:Date.now()+Math.random(),t:v,tm:$("ntm").value,p:$("np").value,d:false});$("nt").value="";$("ntm").value="";save();render();$("nt").focus()}
function addH(){var v=$("nh").value.trim();if(!v)return;S.habits.push({id:"h"+Date.now(),n:v});$("nh").value="";save();render()}
$("ad").onclick=add;$("ah").onclick=addH;
$("nt").onkeydown=function(e){if(e.key==="Enter")add()};
$("nh").onkeydown=function(e){if(e.key==="Enter")addH()};
$("prev").onclick=function(){cur.setDate(cur.getDate()-1);render()};
$("next").onclick=function(){cur.setDate(cur.getDate()+1);render()};
$("today").onclick=function(){cur=new Date();render()};
$("nn").oninput=function(){S.notes[k(cur)]=this.value;save()};
$("in").oninput=function(){X().in=this.value;save()};
$("gr").oninput=function(){X().gr=this.value;save()};
$("qp").oninput=function(){X().q=this.value;save()};
$("th").onclick=function(){var r=document.documentElement;r.dataset.theme=r.dataset.theme==="light"?"dark":"light"};
Array.prototype.forEach.call(document.querySelectorAll(".tab"),function(b){b.onclick=function(){tab=b.dataset.t;Array.prototype.forEach.call(document.querySelectorAll(".tab"),function(o){o.classList.toggle("on",o===b)});["a","b","c"].forEach(function(s){$("s"+s).classList.toggle("hide",s!==tab)})}});
render();
})();
