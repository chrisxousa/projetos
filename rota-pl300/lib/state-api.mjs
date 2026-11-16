import {defaults,apply,validate,validOps} from './sync-core.mjs';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function stateApi(request,db){
 const user=request.headers.get('oai-authenticated-user-id');
 if(!user)return json({error:'authentication_required'},401);
 const url=new URL(request.url);
 if(request.method==='PATCH'){
  if(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'forbidden_origin'},403);
 }
 if(!db)return json({error:'storage_unavailable'},503);
 const read=()=>db.prepare('SELECT data, revision, updated_at FROM study_state WHERE user_id = ?').bind(user).first();
 const payload=row=>({state:row?JSON.parse(row.data):defaults(),revision:row?.revision??0,updatedAt:row?.updated_at??null,userId:user,hasData:!!row});
 try {
  if(request.method==='GET')return json(payload(await read()));
  if(request.method!=='PATCH')return json({error:'method_not_allowed'},405);
  const raw=await request.text();if(raw.length>2000000)return json({error:'too_large'},413);
  let body;try{body=JSON.parse(raw)}catch{return json({error:'invalid_json'},400)}
  if(!validOps(body.ops))return json({error:'invalid_operations'},400);
  for(let attempt=0;attempt<5;attempt++){
   const row=await read(),p=payload(row),change=apply(p.state,body.ops);
   if(change.conflicts.length)return json({...p,error:'conflict',conflicts:change.conflicts},409);
   if(!validate(change.state))return json({error:'invalid_state'},400);
   if(!body.ops.length)return json(p);
   const now=new Date().toISOString(),data=JSON.stringify(change.state);
   const result=row?await db.prepare('UPDATE study_state SET data = ?, revision = revision + 1, updated_at = ? WHERE user_id = ? AND revision = ?').bind(data,now,user,row.revision).run():await db.prepare('INSERT INTO study_state (user_id, data, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(user_id) DO NOTHING').bind(user,data,now).run();
   if(result.meta.changes===1)return json({state:change.state,revision:p.revision+1,updatedAt:now,userId:user,hasData:true});
  }
  return json({error:'busy_retry'},503);
 }catch{return json({error:'storage_error'},503)}
}
