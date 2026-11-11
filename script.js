(function(){
var KEY="planner-v1",S={tasks:{},notes:{},x:{},habits:[]},cur=new Date(),vm=new Date(cur.getFullYear(),cur.getMonth(),1),tab="a",qs="";
try{var r=localStorage.getItem(KEY);if(r){var p=JSON.parse(r);if(p&&p.tasks){S=p;S.x=S.x||{};S.habits=S.habits||[];S.notes=S.notes||{}}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function k(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function $(i){return document.getElementById(i)}
function X(){var key=k(cur);return S.x[key]=S.x[key]||{pr:{},ex:{},q:"",mood:0,gr:"",in:"",h:{},fs:0}}
var PC={h:"var(--hi)",m:"var(--md)",l:"var(--lo)"},PN={h:"Critical",m:"Important",l:"Routine"},PO={h:0,m:1,l:2};
var PRAY=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
var EXTRA=["Tahajjud","Morning adhkar","Evening adhkar","Sunnah & nafl prayers","Sadaqah (charity)","Voluntary fast"];
var MOODS=["Drained","Low","Steady","Strong","Locked in"],RANKS=["Rookie","Grinder","Disciplined","Relentless","Apex"];
var QUOTES=[["Discipline is choosing what you want most over what you want now.",""],["Be so consistent that your excuses get bored.",""],["Silence the noise. Do the work.",""],["Comfort is a slow leak. Choose the grind.",""],["Nobody is coming to save you. Build yourself.",""],["Mood is optional. Execution is not.",""],["Calm mind. Ruthless habits.",""],["Small wins, every day, no exceptions.",""],["Tie your camel, then trust in Allah. Plan, then rely.",""],["Indeed, with hardship comes ease.","Surah Ash-Sharh 94:6"],["Allah does not burden a soul beyond its capacity.","Surah Al-Baqarah 2:286"],["Win the morning, win the day.",""]];
function mk(label,on,ch,rm,tag,tc,sub){var li=document.createElement("li");if(on)li.className="done";
  var c=document.createElement("input");c.type="checkbox";c.checked=!!on;c.onchange=function(){ch(c.checked);save();render()};
  var t=document.createElement("span");t.className="t";t.textContent=label;
  if(sub){var s=document.createElement("small");s.textContent=sub;t.appendChild(s)}
  li.append(c,t);
  if(tag){var g=document.createElement("span");g.className="tag";g.style.color=tc;g.textContent=tag;li.appendChild(g)}
  if(rm){var x=document.createElement("button");x.className="x";x.textContent="✕";x.setAttribute("aria-label","Delete");x.onclick=rm;li.appendChild(x)}
  return li}
function fill(ul,f){ul.innerHTML="";var key=k(cur);
  var all=(S.tasks[key]||[]).slice().sort(function(a,b){return (a.d-b.d)||((a.tm||"99")>(b.tm||"99")?1:(a.tm||"99")<(b.tm||"99")?-1:0)||(PO[a.p]-PO[b.p])});
  var l=all.filter(function(t){return!f||t.t.toLowerCase().indexOf(f)>-1});
  if(!l.length){var e=document.createElement("div");e.className="empty";e.textContent=f?"No match found.":"No missions yet. Add your first one.";ul.appendChild(e)}
  l.forEach(function(t){ul.appendChild(mk(t.t,t.d,function(v){t.d=v},function(){S.tasks[key]=S.tasks[key].filter(function(o){return o.id!==t.id});save();render()},PN[t.p],PC[t.p],t.tm))})}
function render(){
  var key=k(cur),x=X(),all=S.tasks[key]||[],today=k(new Date());
  $("dl").textContent=cur.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  $("ds").textContent=key===today?"Today · "+cur.getFullYear():cur.getFullYear();
  var q=QUOTES[Math.floor(cur.getTime()/864e5)%QUOTES.length];$("q").textContent=q[0];$("qs").textContent=q[1];
  var w=$("week");w.innerHTML="";var st=new Date(cur);st.setDate(cur.getDate()-((cur.getDay()+6)%7));
  for(var i=0;i<7;i++){(function(){var d=new Date(st);d.setDate(st.getDate()+i);
    var b=document.createElement("button");b.className="day"+(k(d)===key?" sel":"");
    b.innerHTML="<b></b><span></span>";b.children[0].textContent=d.getDate();b.children[1].textContent=d.toLocaleDateString("en-US",{weekday:"short"});
    b.onclick=function(){cur=d;vm=new Date(d.getFullYear(),d.getMonth(),1);render()};w.appendChild(b)})()}
  fill($("list"),qs);fill($("cl"),"");$("ct2").textContent="Tasks for "+cur.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  var g=$("cg");g.innerHTML="";["Mo","Tu","We","Th","Fr","Sa","Su"].forEach(function(h){var s=document.createElement("span");s.className="h";s.textContent=h;g.appendChild(s)});
  $("cm").textContent=vm.toLocaleDateString("en-US",{month:"long",year:"numeric"});
  for(var b0=(vm.getDay()+6)%7;b0>0;b0--)g.appendChild(document.createElement("span"));
  var nd=new Date(vm.getFullYear(),vm.getMonth()+1,0).getDate();
  for(var n=1;n<=nd;n++){(function(n){var d=new Date(vm.getFullYear(),vm.getMonth(),n),kk=k(d);
    var b=document.createElement("button");b.className="cd"+(kk===key?" sel":"")+(kk===today?" today":"")+((S.tasks[kk]||[]).length?" dot":"");
    b.textContent=n;b.onclick=function(){cur=d;render()};g.appendChild(b)})(n)}
  var pl=$("pl");pl.innerHTML="";PRAY.forEach(function(n){pl.appendChild(mk(n,x.pr[n],function(v){x.pr[n]=v}))});
  var xl=$("xl");xl.innerHTML="";EXTRA.forEach(function(n){xl.appendChild(mk(n,x.ex[n],function(v){x.ex[n]=v}))});
  var hl=$("hl");hl.innerHTML="";
  if(!S.habits.length){var e2=document.createElement("div");e2.className="empty";e2.textContent="Set your own rules. Add a habit above.";hl.appendChild(e2)}
  S.habits.forEach(function(h){hl.appendChild(mk(h.n,x.h[h.id],function(v){x.h[h.id]=v},function(){S.habits=S.habits.filter(function(o){return o.id!==h.id});save();render()}))});
  var md=$("md");md.innerHTML="";MOODS.forEach(function(m,i){var b=document.createElement("button");b.className="mood"+(x.mood===i+1?" on":"");b.textContent=m;b.onclick=function(){x.mood=x.mood===i+1?0:i+1;save();render()};md.appendChild(b)});
  [["nn",S.notes[key]],["in",x.in],["gr",x.gr],["qp",x.q]].forEach(function(a){if(document.activeElement!==$(a[0]))$(a[0]).value=a[1]||""});
  var tot=all.length+PRAY.length+S.habits.length,dn=all.filter(function(t){return t.d}).length+PRAY.filter(function(n){return x.pr[n]}).length+S.habits.filter(function(h){return x.h[h.id]}).length;
  var pc=tot?Math.round(dn/tot*100):0;
  $("pc").textContent=pc+"%";$("rk").textContent=RANKS[pc>=100?4:Math.floor(pc/25)];$("pt").textContent=dn+" of "+tot+" completed";
  var C=2*Math.PI*52,rg=$("rg");rg.style.strokeDasharray=C;rg.style.strokeDashoffset=C*(1-pc/100);
  tdraw();
}
var LEN={f:25,s:5,l:15},T={m:"f",left:1500,run:false,iv:null},TC=2*Math.PI*95;
function tdraw(){var m=Math.floor(T.left/60),s=T.left%60,x=X();
  $("tt").textContent=String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  $("ts").textContent=T.m==="f"?"Session "+(((x.fs||0)%4)+1)+" of 4":"Take a break";
  var tr=$("tr");tr.style.strokeDasharray=TC;tr.style.strokeDashoffset=TC*(1-T.left/(LEN[T.m]*60));
  $("pp").textContent=T.run?"❚❚":"▶";$("tf").textContent="Focus sessions today: "+(x.fs||0);
  Array.prototype.forEach.call(document.querySelectorAll(".mo"),function(b){b.classList.toggle("on",b.dataset.m===T.m)})}
function tstop(){clearInterval(T.iv);T.run=false}
function setMode(m){tstop();T.m=m;T.left=LEN[m]*60;tdraw()}
$("pp").onclick=function(){if(T.run){tstop();tdraw();return}
  T.run=true;T.iv=setInterval(function(){T.left--;
    if(T.left<=0){tstop();var x=X();if(T.m==="f"){x.fs=(x.fs||0)+1;save();setMode(x.fs%4===0?"l":"s")}else setMode("f")}
    tdraw()},1000);tdraw()};
$("rs").onclick=function(){setMode(T.m)};
Array.prototype.forEach.call(document.querySelectorAll(".mo"),function(b){b.onclick=function(){setMode(b.dataset.m)}});
function add(){var v=$("nt").value.trim();if(!v)return;var key=k(cur);(S.tasks[key]=S.tasks[key]||[]).push({id:Date.now()+Math.random(),t:v,tm:$("ntm").value,p:$("np").value,d:false});$("nt").value="";$("ntm").value="";$("form").classList.add("hide");save();render()}
function addH(){var v=$("nh").value.trim();if(!v)return;S.habits.push({id:"h"+Date.now(),n:v});$("nh").value="";save();render()}
$("ct").onclick=function(){$("form").classList.toggle("hide");$("nt").focus()};
$("ad").onclick=add;$("ah").onclick=addH;
$("nt").onkeydown=function(e){if(e.key==="Enter")add()};$("nh").onkeydown=function(e){if(e.key==="Enter")addH()};
$("sr").oninput=function(){qs=this.value.trim().toLowerCase();fill($("list"),qs)};
$("mp").onclick=function(){vm=new Date(vm.getFullYear(),vm.getMonth()-1,1);render()};
$("mn").onclick=function(){vm=new Date(vm.getFullYear(),vm.getMonth()+1,1);render()};
$("today").onclick=function(){cur=new Date();vm=new Date(cur.getFullYear(),cur.getMonth(),1);render()};
$("nn").oninput=function(){S.notes[k(cur)]=this.value;save()};
$("in").oninput=function(){X().in=this.value;save()};$("gr").oninput=function(){X().gr=this.value;save()};$("qp").oninput=function(){X().q=this.value;save()};
$("th").onclick=function(){var r=document.documentElement,dk=r.dataset.theme==="dark"||(!r.dataset.theme&&matchMedia("(prefers-color-scheme:dark)").matches);r.dataset.theme=dk?"light":"dark"};
Array.prototype.forEach.call(document.querySelectorAll(".nav button"),function(b){b.onclick=function(){tab=b.dataset.t;
  Array.prototype.forEach.call(document.querySelectorAll(".nav button"),function(o){o.classList.toggle("on",o===b)});
  ["a","d","b","c","f"].forEach(function(s){$("s"+s).classList.toggle("hide",s!==tab)});window.scrollTo(0,0)}});
render();
})();
