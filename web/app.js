const $=id=>document.getElementById(id);
let rows=[],headers=[],items=[],selected=0,busy=false;
const formats={plenary:[5632,1792],lab1:[24576,1792],labs:[3360,1344],dome:[2016,1008]};
function stageKey(stage){if(['Plenary A','Plenary B'].includes(stage))return 'plenary';const lab=stage.match(/\bLAB\s*([1-5])\b/i);if(lab)return 'lab'+lab[1];if(stage==='Dome - PITCH')return 'dome';return null;}
function dimensions(stage){const key=stageKey(stage);return key?formats[key]||formats.labs:null;}
function matchesStage(stage){const filter=$('stage').value,key=stageKey(stage);return filter==='all'||(filter==='known'&&key)||(filter==='labs'&&key?.startsWith('lab'))||filter===key;}
function applyFormat(){const mode=$('format').value;const dims=mode==='auto'?(dimensions(items[selected]?.stage||'')||(!items.length?formats.plenary:null)):formats[mode];if(dims){$('width').value=dims[0];$('height').value=dims[1];}}
function sessionSettings(s,item){if($('format').value!=='auto')return s;const dims=dimensions(item.stage);if(!dims){if(item.stage==='Manual')return s;throw Error(`Palco sem formato definido: ${item.stage||'não indicado'}. Escolhe um formato ou Personalizado.`);}return {...s,w:dims[0],h:dims[1]};}

await document.fonts.load('600 96px Poppins');
function parseCSV(s){
 const result=[];let row=[],cell='',quoted=false;
 s=s.replace(/^\uFEFF/,'');
 for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){cell+='"';i++;}else if(quoted||cell==='')quoted=!quoted;else cell+=c;}else if(c===','&&!quoted){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))result.push(row);row=[];cell='';}else cell+=c;}
 if(quoted)throw Error('CSV incompleto: aspas não fechadas.');
 row.push(cell);if(row.some(x=>x.trim()))result.push(row);return result;
}
function option(value,label){const o=document.createElement('option');o.value=value;o.textContent=label;return o;}
function refill(){
 const col=headers.indexOf($('column').value),stage=headers.indexOf('Stage Placement Final');
 items=rows.map((r,i)=>({title:r[col]||'',stage:stage<0?'':(r[stage]||'').trim(),id:i+1})).filter(r=>r.title.trim()&&matchesStage(r.stage));
 selected=0;$('session').replaceChildren(...items.map((r,i)=>option(i,`${r.id} · ${r.title}`)));
 $('text').value=items[0]?.title||'';$('count').textContent=`${items.length} sessões selecionadas${stage<0?' · CSV sem coluna de palco; seleciona Todos os palcos.':''}`;applyFormat();render();
}
function settings(){
 const n=id=>Number($(id).value);
 const s={w:n('width'),h:n('height'),x:n('x'),y:n('y'),size:n('size')*n('scale')/100,scale:n('scale')/100,leading:n('leading'),limit:n('limit'),color:$('color').value,align:$('align').value,capital:$('case').value,colon:$('colon').checked,shadow:$('shadow').checked,opacity:n('opacity')/100,angle:n('angle'),distance:n('distance'),blur:n('blur')};
 if(!Object.values(s).every(v=>typeof v!=='number'||Number.isFinite(v))||!Number.isInteger(s.w)||!Number.isInteger(s.h)||s.w<1||s.h<1||s.w>32767||s.h>32767||s.w*s.h>60000000||s.size<=0||s.scale<=0||s.leading<=0||s.limit<1||!Number.isInteger(s.limit)||s.opacity<0||s.opacity>1||s.distance<0||s.blur<0)throw Error('Verifica os valores. Máximo: 32 767 px por lado e 60 milhões de píxeis.');
 return s;
}
function linesFor(text,s){
 text=text.replace(/\u200B/g,'');
 if(s.capital==='upper')text=text.toLocaleUpperCase();
 if(s.capital==='title')text=text.toLocaleLowerCase().replace(/(^|[^\p{L}\p{N}])(\p{L})/gu,(_,a,b)=>a+b.toLocaleUpperCase());
 const parts=text.split(s.colon?/(?<=:)|\r?\n/:/\r?\n/),lines=[];
 for(const part of parts){let line='';for(const word of part.trim().split(/\s+/).filter(Boolean)){if(line&&[...line+' '+word].length>s.limit){lines.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)lines.push(line);}
 return lines;
}
function draw(text,s,canvas){
 canvas.width=s.w;canvas.height=s.h;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Este browser não suporta a composição.');try{ctx.getImageData(0,0,1,1);}catch{throw Error('Este browser não suporta estas dimensões. Usa Chrome ou Edge num computador.');}ctx.font=`600 ${s.size}px Poppins`;ctx.textAlign=s.align;ctx.textBaseline='alphabetic';ctx.fillStyle=s.color;
 if(s.shadow){ctx.shadowColor=`rgba(0,0,0,${s.opacity})`;ctx.shadowOffsetX=Math.sin(s.angle*Math.PI/180)*s.distance*s.scale;ctx.shadowOffsetY=-Math.cos(s.angle*Math.PI/180)*s.distance*s.scale;ctx.shadowBlur=s.blur*s.scale;}
 const lines=linesFor(text,s);let clipped=false;
 lines.forEach((line,i)=>{const m=ctx.measureText(line);const y=s.y+i*s.leading+m.actualBoundingBoxAscent;ctx.fillText(line,s.x,y);if(s.x-m.actualBoundingBoxLeft<0||s.x+m.actualBoundingBoxRight>s.w||y+m.actualBoundingBoxDescent>s.h||s.y+i*s.leading<0)clipped=true;});
 return {lines,clipped,long:lines.some(l=>[...l].length>s.limit)};
}
function render(){if(busy)return;try{const s=sessionSettings(settings(),items[selected]||{stage:'Manual'}),r=draw($('text').value,s,$('canvas'));$('status').textContent=!r.lines.length?'Introduz um título.':r.clipped?'Atenção: o texto ultrapassa a composição.':r.long?'Uma palavra ultrapassa o limite de caracteres; não foi dividida.':`${s.w} × ${s.h} px · ${r.lines.length} linhas · PNG transparente`;}catch(e){$('status').textContent=e.message;}}
function blob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Não foi possível exportar a imagem.')),'image/png'));}
function save(data,name){const url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
const encoder=new TextEncoder();
function crc32(bytes){let crc=0xffffffff;for(const b of bytes){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
// ZIP entries are stored without extra compression: PNGs are already compressed.
function zip(files){const chunks=[],central=[];let offset=0,centralSize=0;for(const f of files){const name=encoder.encode(f.name),crc=crc32(f.data),local=new Uint8Array(30+name.length),v=new DataView(local.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint32(14,crc,true);v.setUint32(18,f.data.length,true);v.setUint32(22,f.data.length,true);v.setUint16(26,name.length,true);local.set(name,30);chunks.push(local,f.data);const c=new Uint8Array(46+name.length),d=new DataView(c.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);d.setUint32(16,crc,true);d.setUint32(20,f.data.length,true);d.setUint32(24,f.data.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);c.set(name,46);central.push(c);centralSize+=c.length;offset+=local.length+f.data.length;}const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);return new Blob([...chunks,...central,end],{type:'application/zip'});}
function filename(item,index){return `${String(index+1).padStart(3,'0')}-${item.title.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g,'-').slice(0,70)||'titulo'}.png`;}
async function run(fn){busy=true;document.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=true);try{await fn();}catch(e){$('status').textContent=e.message;}finally{busy=false;document.querySelectorAll('input,select,textarea,button').forEach(el=>el.disabled=false);$('column').disabled=!headers.length;}}
$('file').addEventListener('change',async()=>{try{const file=$('file').files[0];if(!file)return;const parsed=parseCSV(await file.text());if(parsed.length<2)throw Error('O CSV não contém sessões.');headers=parsed.shift();rows=parsed;$('column').replaceChildren(...headers.map(h=>option(h,h)));$('column').disabled=false;$('column').value=headers.includes('Session Title')?'Session Title':headers[0];if(!headers.includes('Stage Placement Final'))$('stage').value='all';refill();}catch(e){$('status').textContent=e.message;}});
$('column').addEventListener('change',refill);$('stage').addEventListener('change',refill);
$('session').addEventListener('change',()=>{selected=Number($('session').value);$('text').value=items[selected]?.title||'';applyFormat();render();});
$('text').addEventListener('input',()=>{if(items[selected])items[selected].title=$('text').value;render();});
$('manual').addEventListener('click',()=>{items=[];rows=[];headers=[];$('column').replaceChildren();$('column').disabled=true;$('session').replaceChildren(option('','Texto manual'));$('count').textContent='1 título manual';render();});
for(const id of ['width','height','x','y','size','scale','leading','limit','color','align','case','colon','shadow','opacity','angle','distance','blur'])$(id).addEventListener('input',render);
$('format').addEventListener('change',()=>{applyFormat();render();});
for(const id of ['width','height'])$(id).addEventListener('input',()=>{$('format').value='custom';render();});
$('background').addEventListener('change',()=>{$('preview').className=$('background').value;});
$('download').addEventListener('click',()=>run(async()=>{const s=sessionSettings(settings(),items[selected]||{stage:'Manual'}),text=$('text').value;if(!text.trim())throw Error('Introduz um título.');const c=document.createElement('canvas');const r=draw(text,s,c);if(r.clipped)throw Error('Ajusta o texto: ultrapassa a composição.');save(await blob(c),filename({title:text},selected));$('status').textContent='PNG exportado.';}));
$('batch').addEventListener('click',()=>run(async()=>{const s=settings(),list=items.length?items.filter(i=>i.title.trim()):[{title:$('text').value,stage:'Manual'}];if(!list.length||!list[0].title.trim())throw Error('Não há títulos para exportar.');const files=[],manifest=[],c=document.createElement('canvas');for(let i=0;i<list.length;i++){const itemSettings=sessionSettings(s,list[i]);const r=draw(list[i].title,itemSettings,c);if(r.clipped)throw Error(`A sessão ${i+1} ultrapassa a composição. Ajusta antes de exportar.`);const name=filename(list[i],i);files.push({name,data:new Uint8Array(await (await blob(c)).arrayBuffer())});manifest.push({...list[i],file:name,width:itemSettings.w,height:itemSettings.h,lines:r.lines,over_character_limit:r.long});$('status').textContent=`A gerar ${i+1} / ${list.length}…`;await new Promise(resolve=>setTimeout(resolve,0));}files.push({name:'manifest.json',data:encoder.encode(JSON.stringify({settings:s,sessions:manifest},null,2))});save(zip(files),'titulos.zip');$('status').textContent=`${list.length} PNGs exportados em ZIP.`;}));
render();
