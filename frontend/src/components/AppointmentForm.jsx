import React,{useEffect,useState} from 'react';
import {submitAppointment} from '../api/appointments';
import {getBranches,getDoctors} from '../api/catalog';
const TIMES=['10:00','11:00','12:00','14:00','15:00','16:00'];
export default function AppointmentForm({compact=false}){
  const [form,setForm]=useState({ownerName:'',phone:'',email:'',petName:'',branchId:'',doctorId:'',date:'',time:TIMES[0]});
  const [branches,setBranches]=useState([]),[doctors,setDoctors]=useState([]);
  const [message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{let active=true;Promise.all([getBranches(),getDoctors()]).then(([b,d])=>{if(!active)return;setBranches(b.branches||[]);setDoctors(d.doctors||[])}).catch(err=>{if(active)setMessage('Unable to load branches and doctors: '+err.message+'. Please contact the hospital directly.')});return()=>{active=false}},[]);
  const branchDoctors=doctors.filter(d=>d.branchId===form.branchId);
  const update=e=>{const {name,value}=e.target;setForm(v=>({...v,[name]:value,...(name==='branchId'?{doctorId:''}:{})}))};
  async function submit(e){e.preventDefault();setBusy(true);setMessage('');try{const res=await submitAppointment(form);setMessage('Appointment registered'+(res?.doctor?.name?' with '+res.doctor.name:'')+'. Our team will confirm availability.')}catch(err){setMessage('Unable to submit: '+err.message+'. Please contact the hospital directly.')}finally{setBusy(false)}}
  const fields=[['ownerName','Owner Name','text',true],['phone','Mobile','tel',true],['email','Email (optional)','email',false],['petName','Pet Name','text',true]];
  return <form className={'vv-form '+(compact?'vv-compact-form':'')} onSubmit={submit}><div className="vv-fields">
    {fields.map(([name,label,type,required])=><label key={name}>{label}<input name={name} type={type} required={required} value={form[name]} onChange={update} minLength={name==='phone'?10:undefined}/></label>)}
    <label>Branch<select name="branchId" required value={form.branchId} onChange={update}><option value="">Select branch</option>{branches.map(b=><option key={b.id} value={b.id}>{b.name}{b.city?' — '+b.city:''}</option>)}</select></label>
    <label>Doctor<select name="doctorId" required value={form.doctorId} onChange={update} disabled={!form.branchId}><option value="">{form.branchId?(branchDoctors.length?'Select doctor':'No doctors at this branch'):'Select a branch first'}</option>{branchDoctors.map(d=><option key={d.id} value={d.id}>{d.name}{d.specialty?' ('+d.specialty+')':''}</option>)}</select></label>
    <label>Date<input name="date" type="date" required value={form.date} onChange={update} min={new Date().toLocaleDateString('en-CA')}/></label>
    <label>Time<select name="time" required value={form.time} onChange={update}>{TIMES.map(t=><option key={t}>{t}</option>)}</select></label>
  </div><button className="vv-btn" disabled={busy}>{busy?'Submitting…':'Confirm appointment'}</button><p role="status" aria-live="polite">{message}</p><small>Appointment is confirmed only after hospital staff approve availability.</small></form>}
