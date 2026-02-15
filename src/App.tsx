import React, { useState, useCallback, ReactNode } from "react";

// ── Type Definitions ──────────────────────────────────────────────────────
interface NavItem {
  m: number;
  label: string;
}

interface BadgeProps {
  m: number;
  n: number;
}

interface CardProps {
  c?: string;
  title: string;
  children: ReactNode;
}

interface FlowProps {
  m: number;
  steps: string[];
}

interface TableProps {
  m: number;
  heads: string[];
  rows: string[][];
}

interface TGProps {
  m: number;
  items: [string, string][];
}

interface DiagProps {
  nodes: Array<{l: string; c: string}>;
}

interface QuizProps {
  qs: Array<{
    q: string;
    opts: string[];
    ans: number;
    fb: string;
  }>;
}

interface FootProps {
  cur: number;
  total: number;
  m: number;
  go: (n: number) => void;
}

interface HeroProps {
  mod: number;
  title: string;
  desc: string;
  chips: string[];
  onStart: () => void;
}

// ── Theme ──────────────────────────────────────────────────────────────────
const C1="#1e3a8a", C2="#7f1d1d", C3="#14532d", C4="#4c1d95", C5="#7c2d12", C6="#134e4a";
const CC: Record<string, string> = {b:"#3b82f6",g:"#16a34a",o:"#ea580c",p:"#7c3aed",r:"#ef4444",t:"#0d9488"};
const NAV: NavItem[] = [
  {m:1,label:"Module Overview"},{m:1,label:"Machine Learning"},{m:1,label:"Reinforcement Learning"},
  {m:1,label:"Neural Networks"},{m:1,label:"Deep Learning"},{m:1,label:"Backpropagation"},
  {m:1,label:"Gradient Descent"},{m:1,label:"Bias vs Variance"},{m:1,label:"Module 1 Quiz"},
  {m:2,label:"Module 2 Overview"},{m:2,label:"Computer Vision"},{m:2,label:"NLP Fundamentals"},
  {m:2,label:"Transformers"},{m:2,label:"Large Language Models"},{m:2,label:"Prompt Engineering"},
  {m:2,label:"Generative AI & Diffusion"},{m:2,label:"AI Ethics & Safety"},  {m:2,label:"Module 2 Quiz"},
  {m:3,label:"Module 3 Overview"},{m:3,label:"MLOps Fundamentals"},{m:3,label:"Data Pipelines & Feature Stores"},
  {m:3,label:"Model Training at Scale"},{m:3,label:"Model Evaluation & Monitoring"},{m:3,label:"Model Serving & APIs"},
  {m:3,label:"CI/CD for ML"},{m:3,label:"Responsible Deployment"},  {m:3,label:"Module 3 Quiz"},
  {m:4,label:"Module 4 Overview"},{m:4,label:"What Are AI Agents?"},{m:4,label:"Agent Architectures"},
  {m:4,label:"Tools & Function Calling"},{m:4,label:"Memory & Context Management"},{m:4,label:"Multi-Agent Systems"},
  {m:4,label:"Planning & Reasoning"},{m:4,label:"Safety in Agents"},  {m:4,label:"Module 4 Quiz"},
  {m:5,label:"Module 5 Overview"},{m:5,label:"The AI PM Role"},{m:5,label:"Identifying AI Opportunities"},
  {m:5,label:"Data Strategy for AI Products"},{m:5,label:"Building the AI Roadmap"},{m:5,label:"Evaluating AI Product Quality"},
  {m:5,label:"Launching AI Features"},{m:5,label:"Metrics & Success"},  {m:5,label:"Module 5 Quiz"},
  {m:6,label:"Module 6 Overview"},{m:6,label:"Capstone 1: ML Pipeline"},{m:6,label:"Capstone 2: Fine-tune LLM"},
  {m:6,label:"Capstone 3: AI Agent"},{m:6,label:"Capstone 4: Deploy Model API"},{m:6,label:"Capstone 5: AI Product Spec"},
  {m:6,label:"Peer Review Framework"},{m:6,label:"Presentation & Portfolio"},{m:6,label:"Quiz & Graduation"},
];

// ── Shared components ──────────────────────────────────────────────────────
const Bdg: React.FC<BadgeProps> = ({m,n}) => (
  <span style={{background:m===1?"#dbeafe":m===2?"#fee2e2":"#dcfce7",color:m===1?C1:m===2?C2:C3,padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:700,display:"inline-block",marginBottom:10}}>
    Module {m} · Lesson {n}
  </span>
);

const H: React.FC<{children: ReactNode}> = ({children}) => <h1 style={{fontSize:29,fontWeight:700,color:"#111",lineHeight:1.2,marginBottom:6}}>{children}</h1>;

const Sub: React.FC<{children: ReactNode}> = ({children}) => <p style={{fontSize:15,color:"#666",lineHeight:1.65,marginBottom:20}}>{children}</p>;

const SH: React.FC<{m: number; children: ReactNode}> = ({m,children}) => (
  <h2 style={{fontSize:16,fontWeight:700,color:"#111",margin:"20px 0 10px",paddingBottom:6,borderBottom:`2px solid ${m===1?"#dbeafe":m===2?"#fee2e2":m===3?"#dcfce7":m===4?"#ede9fe":m===5?"#ffedd5":"#ccfbf1"}`}}>{children}</h2>
);

const Bx: React.FC<{t?: string; children: ReactNode}> = ({t="b",children}) => {
  const mp: Record<string, string[]> = {b:["#eff6ff","#3b82f6"],r:["#fff5f5","#ef4444"],g:["#f0fdf4","#16a34a"],y:["#fffbeb","#d97706"]};
  const[bg,bc] = mp[t] || mp.b;
  return <div style={{background:bg,borderLeft:`4px solid ${bc}`,padding:"11px 15px",borderRadius:6,marginBottom:14}}><p style={{margin:0,fontSize:14,color:"#222"}}>{children}</p></div>;
};

const Anl: React.FC<{children: ReactNode}> = ({children}) => (
  <div style={{background:"#fffbeb",border:"1px dashed #d97706",borderRadius:8,padding:"11px 15px",margin:"10px 0",fontSize:13,color:"#555"}}>{children}</div>
);

const G2: React.FC<{children: ReactNode}> = ({children}) => <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"10px 0"}}>{children}</div>;

const G3: React.FC<{children: ReactNode}> = ({children}) => <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11,margin:"10px 0"}}>{children}</div>;

const UL: React.FC<{items: string[]}> = ({items}) => (
  <ul style={{margin:"4px 0 0 15px"}}>
    {items.map((x,i)=> <li key={i} style={{fontSize:13,color:"#555",marginBottom:4}}>{x}</li>)}
  </ul>
);

const Card: React.FC<CardProps> = ({c="b",title,children}) => {
  const[h,sH] = useState(false);
  return(
    <div onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{background:"#fff",border:"1px solid #e8e8e8",borderRadius:8,padding:14,
        borderTop:`3px solid ${CC[c]||"#999"}`,transition:"all .15s",
        boxShadow:h?"0 4px 12px rgba(0,0,0,.07)":"none",transform:h?"translateY(-2px)":"none"}}>
      <h3 style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:6}}>{title}</h3>
      <div style={{fontSize:13,color:"#555"}}>{children}</div>
    </div>
  );
}

const Flow: React.FC<FlowProps> = ({m,steps}) => {
  const col=m===1?"#3b82f6":m===2?"#ef4444":"#16a34a";
  return(
    <div style={{background:"#f8f9fb",border:"1px solid #e8e8e8",borderRadius:8,padding:14,margin:"10px 0"}}>
      {steps.map((s,i)=> (
        <div key={i} style={{display:"flex",gap:10,background:"#fff",borderRadius:6,padding:"9px 12px",
          marginBottom:i<steps.length-1?6:0,borderLeft:`3px solid ${col}`,fontSize:13,color:"#444"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:col,color:"#fff",fontSize:10,
            fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
          <div dangerouslySetInnerHTML={{__html:s}}/>
        </div>
      ))}
    </div>
  );
}

const Tbl: React.FC<TableProps> = ({m,heads,rows}) => {
  return(
    <table style={{width:"100%",borderCollapse:"collapse",margin:"10px 0",fontSize:13,border:"1px solid #e8e8e8",borderRadius:8,overflow:"hidden"}}>
      <thead><tr>{heads.map((h,i)=><th key={i} style={{padding:"9px 11px",textAlign:"left",fontSize:12,fontWeight:700,color:"#fff",background:m===1?C1:m===2?C2:C3}}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r,ri)=><tr key={ri}>{r.map((c,ci)=><td key={ci} style={{padding:"9px 11px",borderBottom:ri<rows.length-1?"1px solid #f0f0f0":"none",color:"#444"}} dangerouslySetInnerHTML={{__html:c}}/>)}</tr>)}</tbody>
    </table>
  );
}

const TG: React.FC<TGProps> = ({m,items}) => {
  const brd=m===1?"#3b82f6":"#ef4444", cl=m===1?C1:C2;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,margin:"10px 0"}}>
      {items.map(([n,d],i)=> (
        <div key={i} style={{background:"#fff",border:"1px solid #e8e8e8",borderLeft:`3px solid ${brd}`,borderRadius:6,padding:"10px 12px"}}>
          <div style={{fontSize:13,fontWeight:700,color:cl,marginBottom:3}}>{n}</div>
          <div style={{fontSize:12,color:"#777",lineHeight:1.5}}>{d}</div>
        </div>
      ))}
    </div>
  );
}

const Diag: React.FC<DiagProps> = ({nodes}) => {
  return(
    <div style={{background:"#f8f9fb",border:"1px solid #e8e8e8",borderRadius:8,padding:14,textAlign:"center",margin:"10px 0"}}>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
        {nodes.map((n,i)=> (
          <span key={i} style={{display:"inline-flex",alignItems:"center"}}>
            <div style={{color:"#fff",padding:"7px 12px",borderRadius:6,fontSize:12,fontWeight:600,background:n.c,lineHeight:1.3}} dangerouslySetInnerHTML={{__html:n.l}}/>
            {i<nodes.length-1&&<span style={{fontSize:16,color:"#bbb",margin:"0 3px"}}>→</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

const Quiz: React.FC<QuizProps> = ({qs}) => {
  interface QuizState {
    [key: number]: {
      done?: boolean;
      choice?: number;
      wrong?: number;
    };
  }
  
  const[st,setSt] = useState<QuizState>({});
  
  function ans(qi: number, oi: number, ok: boolean): void {
    if(st[qi]?.done) return;
    if(ok){ 
      setSt(s=>({...s,[qi]:{done:true,choice:oi}})); 
    }
    else{
      setSt(s=>({...s,[qi]:{wrong:oi}}));
      setTimeout(()=>setSt(s=>{const n={...s};if(!n[qi]?.done)delete n[qi];return n;}),800);
    }
  }
  
  return(
    <div>
      {qs.map((q,qi)=> (
        <div key={qi} style={{background:"#fff",border:"1px solid #e8e8e8",borderRadius:8,padding:14,margin:"12px 0"}}>
          <div style={{fontSize:14,fontWeight:700,color:"#111",marginBottom:10}}>Q{qi+1}. {q.q}</div>
          {q.opts.map((o,oi)=>{
            const done=st[qi]?.done, chosen=done&&oi===st[qi]?.choice, wrong=st[qi]?.wrong===oi;
            return(
              <div key={oi} onClick={()=>ans(qi,oi,oi===q.ans)}
                style={{background:chosen?"#f0fdf4":wrong?"#fff5f5":"#f8f9fb",
                  border:`1px solid ${chosen?"#16a34a":wrong?"#ef4444":"#e8e8e8"}`,
                  borderRadius:6,padding:"9px 12px",fontSize:13,
                  color:chosen?"#15803d":wrong?"#dc2626":"#444",
                  cursor:done?"default":"pointer",marginBottom:5,
                  display:"flex",gap:8,fontWeight:chosen?700:400,transition:"all .15s"}}>
                <span>{chosen?"✅":wrong?"❌":"○"}</span>{o}
              </div>
            );
          })}
          {st[qi]?.done&&<div style={{fontSize:13,fontWeight:600,color:"#15803d",marginTop:7}}>✅ {q.fb}</div>}
        </div>
      ))}
    </div>
  );
}

const Foot: React.FC<FootProps> = ({cur,total,m,go}) => {
  const col=m===1?C1:m===2?C2:C3, last=cur===total-1;
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:30,paddingTop:16,borderTop:"1px solid #eee"}}>
      <button onClick={()=>go(cur-1)} disabled={cur===0}
        style={{padding:"8px 20px",fontSize:13,fontWeight:700,border:"1px solid #e0e0e0",borderRadius:6,
          background:"#f0f0f0",color:"#444",cursor:cur===0?"not-allowed":"pointer",opacity:cur===0?.35:1,fontFamily:"inherit"}}>← Back</button>
      <span style={{fontSize:12,color:"#aaa",fontWeight:600}}>{cur+1}/{total}</span>
      <button onClick={()=>!last&&go(cur+1)} disabled={last}
        style={{padding:"8px 20px",fontSize:13,fontWeight:700,border:"none",borderRadius:6,
          background:last?"#ccc":col,color:"#fff",cursor:last?"not-allowed":"pointer",fontFamily:"inherit"}}>
        {last?"Complete 🎉":"Next →"}
      </button>
    </div>
  );
}

// ── Hero helper ────────────────────────────────────────────────────────────
const Hero: React.FC<HeroProps> = ({mod,title,desc,chips,onStart}) => {
  const bg=mod===1?"linear-gradient(135deg,#1e3a8a,#0f172a)":mod===2?"linear-gradient(135deg,#7f1d1d,#0f0505)":mod===3?"linear-gradient(135deg,#14532d,#052e16)":mod===4?"linear-gradient(135deg,#4c1d95,#1e0a3c)":mod===5?"linear-gradient(135deg,#7c2d12,#1c0a03)":"linear-gradient(135deg,#134e4a,#042f2e)";
  const col=mod===1?C1:mod===2?C2:mod===3?C3:mod===4?C4:mod===5?C5:C6;
  return(
    <div style={{background:bg,minHeight:"calc(100vh - 52px)",display:"flex",flexDirection:"column",
      justifyContent:"center",padding:"50px 56px",color:"#fff",margin:"-38px -50px -50px"}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"rgba(255,255,255,.5)",marginBottom:12}}>
        Module {mod} · AI & Generative AI Specialization
      </div>
      <h1 style={{fontSize:40,fontWeight:700,lineHeight:1.1,marginBottom:14}}>{title}</h1>
      <p style={{fontSize:16,color:"rgba(255,255,255,.72)",maxWidth:460,lineHeight:1.65}}>{desc}</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:18}}>
        {chips.map(c=><span key={c} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",fontSize:12,fontWeight:600,padding:"4px 11px",borderRadius:12}}>{c}</span>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:32,paddingTop:16,borderTop:"1px solid rgba(255,255,255,.15)"}}>
        <span style={{color:"rgba(255,255,255,.4)",fontSize:12}}>{mod===1?"9":"9"} lessons · ~{mod===1?"45":"50"} min</span>
        <button onClick={onStart} style={{padding:"8px 20px",fontSize:13,fontWeight:700,border:"none",borderRadius:6,background:"#fff",color:col,cursor:"pointer",fontFamily:"inherit"}}>
          Start Module →
        </button>
      </div>
    </div>
  );
}

// ── All 54 Slides ──────────────────────────────────────────────────────────
// (Copy all your S0 through S53 functions here - they're fine as-is)
// I'll show one example, but keep all your existing slide components

function S0({go}: {go: (n: number) => void}){ return <Hero mod={1} title="AI & Machine Learning Foundations" desc="Master the core concepts powering every modern AI system." chips={["Machine Learning","Neural Networks","Deep Learning","Backpropagation","Gradient Descent","Bias vs Variance"]} onStart={()=>go(1)}/>; }

// Add proper typing to all slide components
function S1({cur,total,go}: {cur: number; total: number; go: (n: number) => void}){ return(<div>
  <Bdg m={1} n={2}/><H>Machine Learning</H><Sub>Algorithms that learn patterns from data and generalise to unseen examples.</Sub>
  <Bx>Core idea: Given enough labeled examples, a model learns input→output mappings and applies them to new data.</Bx>
  <SH m={1}>Three Paradigms</SH>
  <G3>
    <Card c="b" title="Supervised"><p>Labeled input-output pairs</p><UL items={["Classification & Regression","Spam filters, price prediction"]}/></Card>
    <Card c="g" title="Unsupervised"><p>Unlabeled data — find structure</p><UL items={["Clustering, anomaly detection","Customer segmentation"]}/></Card>
    <Card c="o" title="Reinforcement"><p>Rewards & penalties loop</p><UL items={["Agent + environment","Game AI, robotics"]}/></Card>
  </G3>
  <SH m={1}>ML Workflow</SH>
  <Flow m={1} steps={["<strong>Collect</strong> — gather relevant data","<strong>Prepare</strong> — clean, split train/val/test","<strong>Train</strong> — model minimises loss","<strong>Evaluate</strong> — measure accuracy on held-out set","<strong>Deploy & Monitor</strong> — watch for drift"]}/>
  <SH m={1}>Key Terms</SH>
  <TG m={1} items={[["Features","Input variables used for prediction"],["Labels","Target outputs the model learns to predict"],["Overfitting","Memorises noise; fails on new data"],["Underfitting","Too simple; misses real patterns"]]}/>
  <Foot cur={cur} total={total} m={1} go={go}/>
</div>); }

// ... continue with all your S2 through S53 components exactly as you had them
// Just make sure each has the correct prop types

// ── App ────────────────────────────────────────────────────────────────────
// Define the slides array with proper typing
const ALL: Array<React.FC<{cur: number; total: number; go: (n: number) => void} | {go: (n: number) => void}>> = [
  S0,S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12,S13,S14,S15,S16,S17,S18,S19,S20,S21,S22,S23,S24,S25,S26,S27,S28,S29,S30,S31,S32,S33,S34,S35,S36,S37,S38,S39,S40,S41,S42,S43,S44,S45,S46,S47,S48,S49,S50,S51,S52,S53
];

export default function App(){
  const[cur,setCur] = useState<number>(0);
  
  const go = useCallback((n: number): void => {
    if(n>=0&&n<ALL.length){
      setCur(n);
      document.getElementById("ms")?.scrollTo(0,0);
    }
  },[]);
  
  const pct = Math.round((cur+1)/ALL.length*100);
  const Slide = ALL[cur];
  
  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:"#f0f2f5",overflow:"hidden",height:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{height:52,background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 28px",flexShrink:0}}>
        <div style={{fontSize:19,fontWeight:700,color:"#fff"}}>⚡ Skill<span style={{color:"#60a5fa"}}>Sync</span></div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>AI & Generative AI Specialization</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.4)",fontWeight:600}}>{cur+1} / {ALL.length}</div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:258,background:"#fff",borderRight:"1px solid #e8e8e8",display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{padding:"14px 16px 12px",borderBottom:"1px solid #f0f0f0"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#111"}}>Modules 1 & 2</div>
            <div style={{fontSize:11,color:"#999",marginTop:2}}>AI & Machine Learning</div>
            <div style={{display:"flex",alignItems:"center",gap:7,marginTop:8}}>
              <div style={{flex:1,height:4,background:"#eee",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#3b82f6,#8b5cf6)",width:`${pct}%`,transition:"width .4s"}}/>
              </div>
              <span style={{fontSize:11,color:"#888",fontWeight:700}}>{pct}%</span>
            </div>
          </div>
          <div style={{overflowY:"auto",flex:1,padding:"6px 0"}}>
            {[1,2,3,4,5,6].map(mod=>(
              <div key={mod}>
                <div style={{padding:"9px 16px 3px",fontSize:10,fontWeight:700,letterSpacing:".7px",textTransform:"uppercase",color:"#bbb",display:"flex",alignItems:"center",gap:6}}>
                  Module {mod} <span style={{background:mod===1?"#dbeafe":mod===2?"#fee2e2":"#dcfce7",color:mod===1?"#1e40af":mod===2?"#b91c1c":"#14532d",fontSize:9,padding:"1px 6px",borderRadius:8,fontWeight:700}}>{mod===1?"Foundations":mod===2?"Advanced AI":"MLOps"}</span>
                </div>
                {NAV.map((n,i)=>n.m!==mod?null:(
                  <div key={i} onClick={()=>go(i)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 16px",cursor:"pointer",
                    borderLeft:`3px solid ${cur===i?(mod===1?"#3b82f6":"#ef4444"):"transparent"}`,
                                          background:cur===i?(mod===1?"#eff6ff":mod===2?"#fff5f5":"#f0fdf4"):"transparent",transition:"background .1s"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",
                      background:cur>i?"#16a34a":cur===i?(mod===1?"#3b82f6":mod===2?"#ef4444":"#16a34a"):"#ececec",
                      color:cur>i||cur===i?"#fff":"#777",fontSize:10,fontWeight:700,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {cur>i?"✓":i+1}
                    </div>
                    <span style={{fontSize:12.5,color:cur===i?(mod===1?"#1e40af":mod===2?"#b91c1c":"#14532d"):"#444",fontWeight:cur===i?700:400,lineHeight:1.3}}>{n.label}</span>
                  </div>
                ))}
                {mod!==3&&<div style={{height:1,background:"#f4f4f4",margin:"3px 10px"}}/>}
              </div>
            ))}
          </div>
        </div>
        <div id="ms" style={{flex:1,overflowY:"auto",background:"#f7f8fc"}}>
          <div style={{padding:"38px 50px 50px",maxWidth:820}}>
            <Slide cur={cur} total={ALL.length} go={go}/>
          </div>
        </div>
      </div>
    </div>
  );
}
