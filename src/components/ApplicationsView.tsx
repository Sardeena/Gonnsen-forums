/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  CornerDownRight, 
  Plus, 
  Trash2, 
  Lock, 
  UserCheck, 
  MessageSquare,
  Wrench,
  Sparkles
} from 'lucide-react';
import { AppTemplate, SubmittedApplication, User as UserType, AppQuestion } from '../types';

interface ApplicationsProps {
  templates: AppTemplate[];
  submissions: SubmittedApplication[];
  allUsers: UserType[];
  currentUser: UserType;
  onSubmitApplication: (submissionData: Partial<SubmittedApplication>) => void;
  onModifySubmission: (submissionId: string, updated: Partial<SubmittedApplication>) => void;
  onAddNotification: (notifData: any) => void;
  onAddTemplateQuestion: (templateId: string, newQuestion: AppQuestion) => void;
}

export default function ApplicationsView({
  templates,
  submissions,
  allUsers,
  currentUser,
  onSubmitApplication,
  onModifySubmission,
  onAddNotification,
  onAddTemplateQuestion
}: ApplicationsProps) {
  const [activeTab, setActiveTab] = useState<'apply' | 'staff_review' | 'form_builder'>('apply');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');

  // Form states for applying
  const [formAnswers, setFormAnswers] = useState<{ [qId: string]: string }>({});

  // Review states (selected application for reviewing)
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [newInternalNote, setNewInternalNote] = useState('');

  // Custom Form Builder state
  const [customQuestionLabel, setCustomQuestionLabel] = useState('');
  const [customQuestionType, setCustomQuestionType] = useState<'text' | 'textarea' | 'select' | 'checkbox'>('text');
  const [customQuestionOptions, setCustomQuestionOptions] = useState('');
  const [customQuestionRequired, setCustomQuestionRequired] = useState(true);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId);
  const selectedReviewApp = submissions.find(s => s.id === activeReviewId);

  // Filter application templates or user listings
  const userSubmissions = submissions.filter(s => s.applicantId === currentUser.id);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) return;

    const submissionData: Partial<SubmittedApplication> = {
      templateId: selectedTemplateId,
      applicantId: currentUser.id,
      answers: { ...formAnswers },
      status: 'pending',
      internalNotes: [],
      createdAt: new Date().toISOString()
    };

    onSubmitApplication(submissionData);
    setFormAnswers({});
    alert('Application submitted successfully! Check progress in your portal feed.');
  };

  const handleFieldChange = (qId: string, val: string) => {
    setFormAnswers({ ...formAnswers, [qId]: val });
  };

  const isStaff = ['Owner', 'Administrator', 'Senior Administrator', 'Moderator', 'Community Manager'].includes(currentUser.role);

  const handleApproveApp = (app: SubmittedApplication) => {
    onModifySubmission(app.id, { status: 'approved' });
    
    // Notify Applicant
    onAddNotification({
      recipientId: app.applicantId,
      senderId: currentUser.id,
      type: 'staff_app',
      targetType: 'app',
      targetId: app.id,
      text: `🎉 CONGRATULATIONS! Your application for "${templates.find(t => t.id === app.templateId)?.title}" was APPROVED! Rank and badges loaded.`,
      createdAt: new Date().toISOString()
    });

    alert('Submission APPROVED. Dispatch alerts sent.');
  };

  const handleRejectApp = (app: SubmittedApplication) => {
    onModifySubmission(app.id, { status: 'rejected' });
    
    // Notify Applicant
    onAddNotification({
      recipientId: app.applicantId,
      senderId: currentUser.id,
      type: 'staff_app',
      targetType: 'app',
      targetId: app.id,
      text: `❌ APPLICATION UPDATE: Your application for "${templates.find(t => t.id === app.templateId)?.title}" was rejected. Please review our rules and adapt traits.`,
      createdAt: new Date().toISOString()
    });

    alert('Submission REJECTED. Form status updated.');
  };

  const handleAddInternalNoteSubmit = (e: React.FormEvent, app: SubmittedApplication) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    const notes = [
      ...(app.internalNotes || []),
      { authorId: currentUser.id, note: newInternalNote, createdAt: new Date().toISOString() }
    ];

    onModifySubmission(app.id, { internalNotes: notes });
    setNewInternalNote('');
    alert('Internal note synchronized for reviewing supervisors.');
  };

  const handleDeployCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionLabel.trim() || !selectedTemplateId) return;

    const parsedOptions = customQuestionOptions
      ? customQuestionOptions.split(',').map(o => o.trim()).filter(Boolean)
      : undefined;

    const newQ: AppQuestion = {
      id: `custom_${Date.now()}`,
      label: customQuestionLabel,
      type: customQuestionType,
      options: parsedOptions,
      required: customQuestionRequired
    };

    onAddTemplateQuestion(selectedTemplateId, newQ);
    
    // Reset inputs
    setCustomQuestionLabel('');
    setCustomQuestionOptions('');
    alert('Question added! You can view it live in the Candidate application preview now.');
  };

  return (
    <div className="space-y-6">
      
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">ADMINISTRATIONS WORKFLOWS</span>
          <h1 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-50 uppercase tracking-tight flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-indigo-505 text-indigo-600" />
            Nexus Application Center
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg mt-0.5">Submit custom whitelists, join professional esports teams, apply for moderators, or build custom layout forms dynamically.</p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-950 font-mono text-xs">
          <button 
            onClick={() => setActiveTab('apply')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'apply' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Apply Center
          </button>
          {isStaff && (
            <>
              <button 
                onClick={() => setActiveTab('staff_review')}
                className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'staff_review' ? 'bg-white dark:bg-zinc-800 text-yellow-500 font-bold shadow-sm' : 'text-zinc-500 hover:text-zinc-805'}`}
              >
                Staff Reviews Desk
              </button>
              <button 
                onClick={() => setActiveTab('form_builder')}
                className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'form_builder' ? 'bg-white dark:bg-zinc-800 text-indigo-500 font-bold shadow-sm' : 'text-zinc-500 hover:text-zinc-805'}`}
              >
                Form Builder
              </button>
            </>
          )}
        </div>
      </div>

      {/* CORE APPLY VIEW TAB */}
      {activeTab === 'apply' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Templates selector & My Submissions status list */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-95 w-full border border-zinc-200 p-4 rounded-xl space-y-3 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider block">Available Whitelists</span>
              <div className="space-y-1.5">
                {templates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition flex flex-col gap-1 ${tpl.id === selectedTemplateId ? 'border-indigo-505 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'border-zinc-150 dark:border-zinc-805 hover:bg-zinc-50 dark:hover:bg-zinc-90 w hover:text-zinc-800'}`}
                  >
                    <span>{tpl.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono font-normal truncate">{tpl.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* My historic submissions tracker */}
            <div className="bg-white dark:bg-zinc-95 w-full border border-zinc-200 p-4 rounded-xl space-y-4 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider block">Your submissions timeline</span>
              
              <div className="space-y-2.5">
                {userSubmissions.length === 0 ? (
                  <p className="text-[11px] text-zinc-450 dark:text-zinc-500 font-mono italic">No requests filed recently.</p>
                ) : (
                  userSubmissions.map(sub => {
                    const tpl = templates.find(t => t.id === sub.templateId);
                    return (
                      <div key={sub.id} className="p-3 bg-zinc-50 border rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="font-bold truncate max-w-[120px]">{tpl?.title}</span>
                          <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                            sub.status === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : sub.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600'
                                : 'bg-amber-500/10 text-amber-600 animate-pulse'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block font-mono">Filed on {new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Selected Form display fields to apply */}
          <div className="lg:col-span-2">
            {activeTemplate ? (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-5">
                <div className="border-b pb-3 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-zinc-850 dark:text-zinc-50 uppercase font-mono tracking-tight">{activeTemplate.title}</h3>
                  <p className="text-xs text-zinc-405 leading-relaxed">{activeTemplate.description}</p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4 text-xs font-mono">
                  {activeTemplate.questions.map((q) => (
                    <div key={q.id} className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        {q.label}
                        {q.required && <span className="text-rose-500">*</span>}
                      </label>

                      {q.type === 'text' && (
                        <input
                          type="text"
                          required={q.required}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleFieldChange(q.id, e.target.value)}
                          placeholder="Type answer here..."
                          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-xl outline-none"
                        />
                      )}

                      {q.type === 'textarea' && (
                        <textarea
                          rows={4}
                          required={q.required}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleFieldChange(q.id, e.target.value)}
                          placeholder="Provide deep details, context or scenarios explanation here..."
                          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-xl outline-none"
                        />
                      )}

                      {q.type === 'select' && (
                        <select
                          required={q.required}
                          value={formAnswers[q.id] || ''}
                          onChange={(e) => handleFieldChange(q.id, e.target.value)}
                          className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 rounded-xl outline-none"
                        >
                          <option value="">-- Choose Option --</option>
                          {q.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {q.type === 'checkbox' && (
                        <div className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id={q.id}
                            required={q.required}
                            checked={formAnswers[q.id] === 'true'}
                            onChange={(e) => handleFieldChange(q.id, e.target.checked ? 'true' : 'false')}
                            className="rounded border-zinc-300 dark:border-zinc-750 text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5"
                          />
                          <label htmlFor={q.id} className="text-[11px] text-zinc-500 font-normal select-none">
                            I verify that this information is complete and correct.
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="pt-3.5 border-t border-zinc-150 dark:border-zinc-805 flex justify-end gap-2 text-xs">
                    <button 
                      type="button" 
                      onClick={() => setFormAnswers({})}
                      className="px-4 py-2 border rounded-xl hover:bg-zinc-50"
                    >
                      Clear Fields
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow cursor-pointer"
                    >
                      Submit Candidate Request
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="p-8 border rounded-2xl border-dashed text-center text-xs text-zinc-400 font-mono">No active template chosen.</p>
            )}
          </div>
        </div>
      )}

      {/* CORE STAFF REVIEW TAB */}
      {activeTab === 'staff_review' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: list of submissions waiting review */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block pl-1">Review Candidate queue</span>
            
            <div className="divide-y border border-zinc-200 rounded-2xl bg-white dark:bg-zinc-950/80 overflow-hidden shadow-sm">
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-450 font-mono italic">
                  Clear! No pending applications.
                </div>
              ) : (
                submissions.map((sub) => {
                  const applicant = allUsers.find(u => u.id === sub.applicantId);
                  const tpl = templates.find(t => t.id === sub.templateId);
                  const isCurSelected = activeReviewId === sub.id;

                  return (
                    <div
                      key={sub.id}
                      onClick={() => { setActiveReviewId(sub.id); }}
                      className={`p-4 cursor-pointer transition flex items-start justify-between gap-3 text-xs ${isCurSelected ? 'bg-amber-500/5 dark:bg-amber-500/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-90 w/20'}`}
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{tpl?.title}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                          <User className="h-3.5 w-3.5" />
                          <span className="font-semibold text-zinc-650">{applicant?.username}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono ${
                        sub.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : sub.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-amber-505 bg-amber-500/10 text-amber-600'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right panel: dynamic details review work area */}
          <div className="lg:col-span-2">
            {selectedReviewApp ? (
              <div className="bg-white dark:bg-zinc-950 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-6">
                
                {/* Header author info */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3.5 gap-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 block font-bold">RECRUIT SUITE NODES #{selectedReviewApp.id}</span>
                    <h3 className="text-sm sm:text-base font-extrabold text-indigo-650 dark:text-indigo-400">
                      Applicant: {allUsers.find(u => u.id === selectedReviewApp.applicantId)?.username}
                    </h3>
                  </div>

                  {/* Actions */}
                  {selectedReviewApp.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRejectApp(selectedReviewApp)}
                        className="px-3 py-1.5 border border-rose-300 text-rose-600 dark:text-rose-450 hover:bg-rose-50 rounded-xl text-xs font-bold font-mono"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleApproveApp(selectedReviewApp)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow"
                      >
                        <UserCheck className="h-4 w-4" />
                        Approve Candidate
                      </button>
                    </div>
                  )}
                </div>

                {/* Answers List */}
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-zinc-400 font-extrabold block">Candidate answers sheets</span>
                  
                  <div className="space-y-3.5">
                    {activeTemplate?.questions.map((q) => {
                      const ans = selectedReviewApp.answers[q.id];
                      return (
                        <div key={q.id} className="p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border">
                          <span className="text-[10px] font-mono text-zinc-500 block font-bold uppercase">{q.label}</span>
                          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans pt-1 font-semibold">{ans || '(No Answer)'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Internal notes widget */}
                <div className="border-t pt-4 space-y-4 font-mono">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-widest flex items-center gap-1">
                    <Wrench className="h-4 w-4 text-indigo-505" />
                    Internal reviewer notes ({selectedReviewApp.internalNotes?.length || 0})
                  </span>

                  <div className="space-y-2 max-h-44 overflow-y-auto pr-2">
                    {(selectedReviewApp.internalNotes || []).map((noteItem, nIdx) => {
                      const authorUser = allUsers.find(u => u.id === noteItem.authorId);
                      return (
                        <div key={nIdx} className="p-2.5 bg-yellow-500/5 border border-yellow-500/20 text-xs rounded-lg space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-zinc-400">
                            <span className="font-bold text-yellow-600">Reviewer: {authorUser?.username}</span>
                            <span>{new Date(noteItem.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-700 dark:text-zinc-300">"{noteItem.note}"</p>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={(e) => handleAddInternalNoteSubmit(e, selectedReviewApp)} className="flex gap-2">
                    <input 
                      type="text" 
                      value={newInternalNote} 
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      placeholder="Write internal review note (e.g., 'Checked records, player is highly mature on Minecraft survival Node' etc.)"
                      className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-950 border text-xs rounded-xl outline-none" 
                    />
                    <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs h-9.5">
                      Add Note
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className="p-16 border rounded-2xl border-dashed bg-zinc-50/50 text-center text-xs text-zinc-400 font-mono flex flex-col items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-zinc-350" />
                <p>Choose any candidate's request on the left grid to view detailed replies, write internal comments, or approve whitelist rights instantly.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CORE FORM BUILDER TAB */}
      {activeTab === 'form_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Template Question Builder Form */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold text-indigo-605 text-indigo-600 uppercase flex items-center gap-1.5 pb-2 border-b">
              <Sparkles className="h-4.5 w-4.5" />
              Dynamic Question Designer
            </span>

            <form onSubmit={handleDeployCustomQuestion} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-500 font-bold block">Target Form Application</label>
                <select 
                  value={selectedTemplateId} 
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full mt-1.5 p-2 bg-zinc-50 border rounded-lg outline-none"
                >
                  {templates.map(tpl => (
                    <option key={tpl.id} value={tpl.id}>{tpl.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-500 font-bold block">Question Input Type</label>
                <select 
                  value={customQuestionType} 
                  onChange={(e: any) => setCustomQuestionType(e.target.value)}
                  className="w-full mt-1.5 p-2 bg-zinc-50 border rounded-lg outline-none"
                >
                  <option value="text">Short Text Response</option>
                  <option value="textarea">Long Scenario Paragraph</option>
                  <option value="select">Dropdown Choice</option>
                  <option value="checkbox">Agree/Accept Checkbox</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-500 font-bold block">Question Label / Prompt</label>
                <input 
                  type="text" 
                  required
                  value={customQuestionLabel} 
                  onChange={(e) => setCustomQuestionLabel(e.target.value)}
                  placeholder="e.g., Explain why you seek gang whitelisting?" 
                  className="w-full mt-1.5 p-2 bg-zinc-50 border rounded-lg" 
                />
              </div>

              {customQuestionType === 'select' && (
                <div>
                  <label className="text-zinc-500 font-bold block">Comma-Separated Selection Options</label>
                  <input 
                    type="text" 
                    value={customQuestionOptions} 
                    onChange={(e) => setCustomQuestionOptions(e.target.value)}
                    placeholder="e.g. Active, Casual, Inactive" 
                    className="w-full mt-1.5 p-2 bg-zinc-50 border rounded-lg" 
                  />
                  <span className="text-[10px] text-zinc-400 block mt-1">Specify choices split by commas nicely.</span>
                </div>
              )}

              <div className="flex items-center gap-2 py-1">
                <input 
                  type="checkbox" 
                  id="req_box" 
                  checked={customQuestionRequired} 
                  onChange={(e) => setCustomQuestionRequired(e.target.checked)} 
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5"
                />
                <label htmlFor="req_box" className="text-zinc-600 select-none">Mark question as *REQUIRED</label>
              </div>

              <button 
                type="submit" 
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-xl shadow"
              >
                Inject Question Node
              </button>
            </form>
          </div>

          {/* Right panel: Active Preview of the modified form */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block pl-1">Live Builder Preview</span>
            
            {activeTemplate ? (
              <div className="p-5 border bg-white dark:bg-zinc-950 rounded-2xl space-y-4 opacity-80 select-none cursor-default font-mono">
                <div className="border-b pb-2.5">
                  <span className="text-[9px] uppercase bg-zinc-100 dark:bg-zinc-90 w px-2 py-0.5 rounded font-bold text-zinc-500 tracking-wider">PREVIEW PANEL (CLICK DISABLED)</span>
                  <h3 className="text-sm font-extrabold text-zinc-700 dark:text-zinc-300 uppercase mt-2">{activeTemplate.title} Form Layout</h3>
                </div>
                
                <div className="space-y-3.5">
                  {activeTemplate.questions.map((q) => (
                    <div key={q.id} className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border rounded-xl text-xs">
                      <span className="font-bold text-zinc-650 tracking-tight flex items-center gap-1">
                        {q.label}
                        {q.required && <span className="text-rose-500">*</span>}
                      </span>
                      <div className="border bg-white dark:bg-zinc-950 p-2 text-zinc-400 text-[11px] rounded mt-1.5">
                        {q.type === 'text' && 'Simple input...'}
                        {q.type === 'textarea' && 'User biography explanation text...'}
                        {q.type === 'select' && `Select options: [${(q.options || []).join(' | ')}]`}
                        {q.type === 'checkbox' && 'Agreement checkbox toggle.'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Select template to inspect preview.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
