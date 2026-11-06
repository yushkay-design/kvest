(()=>{
'use strict';
const $=id=>document.getElementById(id);
const phrase='Люблю домашних животных';
let typeTimer=null,replyTimer=null,ready=false,busy=false;
const show=id=>{$(id).hidden=false},hide=id=>{$(id).hidden=true};
const move=id=>requestAnimationFrame(()=>$(id).scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
function openThread(){hide('board');show('thread');window.scrollTo(0,0);try{history.replaceState(null,'','#chat')}catch(e){}}
function back(){hide('thread');show('board');window.scrollTo(0,0);try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
$('open-thread').addEventListener('click',openThread);
$('back-board').addEventListener('click',back);
function startTyping(){
if(ready||busy)return;
busy=true;hide('phrase-choice');show('compose-form');
$('typed-phrase').textContent='';$('typing-caret').hidden=false;$('send-phrase').disabled=true;
const letters=Array.from(phrase);
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let i=0;
function next(){
if(i<letters.length){$('typed-phrase').textContent+=letters[i++];typeTimer=setTimeout(next,reduced?0:65)}
else{typeTimer=null;$('typing-caret').hidden=true;$('send-phrase').disabled=false;ready=true;busy=false}
}
next();
}
$('choose-phrase').addEventListener('click',startTyping);
$('send-phrase').addEventListener('click',()=>{
if(!ready||busy)return;
ready=false;busy=true;
hide('compose-zone');show('outgoing-block');show('typing-block');move('typing-block');
replyTimer=setTimeout(()=>{
replyTimer=null;hide('typing-block');show('reply-block');move('reply-block');busy=false;
},2200);
});
$('restart').addEventListener('click',()=>{
if(typeTimer!==null){clearTimeout(typeTimer);typeTimer=null}
if(replyTimer!==null){clearTimeout(replyTimer);replyTimer=null}
busy=false;ready=false;
['outgoing-block','typing-block','reply-block','compose-form'].forEach(hide);
['compose-zone','phrase-choice'].forEach(show);
$('typed-phrase').textContent='';
$('typing-caret').hidden=false;
$('send-phrase').disabled=true;move('chat-history');
});
if(location.hash==='#chat')openThread();
})();