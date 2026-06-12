/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Hammer, 
  FileText, 
  CheckCircle, 
  XSquare, 
  Trash2, 
  AlertOctagon, 
  Search, 
  Clock, 
  Eye,
  Wrench,
  Activity
} from 'lucide-react';
import { ReportTicket, AuditLog, User, UserRole } from '../types';

interface ModConsoleProps {
  reports: ReportTicket[];
  auditLogs: AuditLog[];
  allUsers: User[];
  currentUser: User;
  onResolveReport: (reportId: string, resolutionText: string) => void;
  onModifyUserSuspension: (userId: string, isSuspended: boolean, warningDelta: number) => void;
  onAddAuditLog: (log: Partial<AuditLog>) => void;
  onAddNotification: (notifData: any) => void;
}

export default function ModConsole({
  reports,
  auditLogs,
  allUsers,
  currentUser,
  onResolveReport,
  onModifyUserSuspension,
  onAddAuditLog,
  onAddNotification
}: ModConsoleProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'infractions' | 'audit_logs'>('reports');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for infraction dispatch
  const [targetUsername, setTargetUsername] = useState('');
  const [warningPoints, setWarningPoints] = useState(0);
  const [discipAction, setDiscipAction] = useState<'warn' | 'suspend' | 'temp_ban'>('warn');
  const [discipReason, setDiscipReason] = useState('');

  // Resolution text inside tickets
  const [resolutionTextVal, setResolutionTextVal] = useState<{ [id: string]: string }>({});

  const handleResolveSubmit = (e: React.FormEvent, rep: ReportTicket) => {
    e.preventDefault();
    const txt = resolutionTextVal[rep.id] || '';
    if (!txt.trim()) return;

    onResolveReport(rep.id, txt);
    
    // Log into security audit trail
    onAddAuditLog({
      actorId: currentUser.id,
      action: 'REPORT_RESOLVE',
      target: `Report id #${rep.id.split('_')[1] || '1'}`,
      timestamp: new Date().toISOString(),
      details: `Resolved report with decision: "${txt}". Verified by ${currentUser.username}.`
    });

    // Notify reporter
    onAddNotification({
      recipientId: rep.reporterId,
      senderId: currentUser.id,
      type: 'staff_app',
      targetType: 'app',
      targetId: rep.id,
      text: `🛡️ Moderation ticket resolved: Your report regarding "${rep.targetTitle}" has been processed: "${txt}"`,
      createdAt: new Date().toISOString()
    });

    alert('Security report marked as RESOLVED and archived.');
    setResolutionTextVal({ ...resolutionTextVal, [rep.id]: '' });
  };

  const handleInfractionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim() || !discipReason.trim()) return;

    const findUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.trim().toLowerCase());
    if (!findUser) {
      alert(`Username "${targetUsername}" not found. Verify if there is typos in user gaming profile.`);
      return;
    }

    if (findUser.role === 'Owner') {
      alert('Security violation: Staff is strictly unauthorized from deploying disciplinary sanctions against the Root Server Owner.');
      return;
    }

    // Submit warnings or suspensions
    if (discipAction === 'warn') {
      onModifyUserSuspension(findUser.id, false, warningPoints);
      
      onAddAuditLog({
        actorId: currentUser.id,
        action: 'USER_WARN',
        target: findUser.username,
        timestamp: new Date().toISOString(),
        details: `Dispatched warn flag (+${warningPoints} warning points). Reason: ${discipReason}`
      });

      onAddNotification({
        recipientId: findUser.id,
        senderId: currentUser.id,
        type: 'reaction',
        targetType: 'app',
        targetId: 'infraction_notify',
        text: `⚠️ WARNING POINTS ISSUED: The moderation staff issued +${warningPoints} warning points on your account: "${discipReason}"`,
        createdAt: new Date().toISOString()
      });

      alert(`Success! Dispatched ${warningPoints} Warning points to ${findUser.username}.`);
    } else if (discipAction === 'suspend') {
      onModifyUserSuspension(findUser.id, true, 0);

      onAddAuditLog({
        actorId: currentUser.id,
        action: 'USER_SUSPEND',
        target: findUser.username,
        timestamp: new Date().toISOString(),
        details: `Suspended user account access. Reason: ${discipReason}`
      });

      alert(`Success! Deployed account SUSPENSION state for ${findUser.username}.`);
    } else if (discipAction === 'temp_ban') {
      onModifyUserSuspension(findUser.id, true, 0);

      onAddAuditLog({
        actorId: currentUser.id,
        action: 'USER_BAN',
        target: findUser.username,
        timestamp: new Date().toISOString(),
        details: `Temporary Ban issued. Profile lock active. Reason: ${discipReason}`
      });

      alert(`Success! Deployed immediate TEMPORARY BAN lock for ${findUser.username}.`);
    }

    // Reset Form
    setTargetUsername('');
    setWarningPoints(0);
    setDiscipReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Moderation Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-450 uppercase tracking-widest block">ADMINISTRATIONS COMMAND SHELL</span>
          <h1 className="text-xl font-extrabold text-zinc-850 dark:text-zinc-50 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5.5 w-5.5 text-amber-500" />
            Nexus Moderator Suite
          </h1>
          <p className="text-xs text-zinc-500 max-w-lg mt-0.5">Oversight panel for community supervisors. Review tickets, flags accounts, inspect server behaviors, and examine audit trails safely.</p>
        </div>

        {/* Console Nav Tabs */}
        <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-950 font-mono text-xs">
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'reports' ? 'bg-white dark:bg-zinc-805 text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Disputes Ticket ({reports.filter(r => r.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('infractions')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'infractions' ? 'bg-white dark:bg-zinc-805 text-amber-600 dark:text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Infractions Center
          </button>
          <button 
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${activeTab === 'audit_logs' ? 'bg-white dark:bg-zinc-805 text-indigo-500 font-bold' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            Security Audit Logs
          </button>
        </div>
      </div>

      {/* TICKET REPORTS PROCESSOR */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block pl-1">Active report tickets</span>

          <div className="grid grid-cols-1 gap-4">
            {reports.length === 0 ? (
              <div className="py-12 text-center border rounded-2xl bg-zinc-50 dark:bg-zinc-95 w text-zinc-400 font-mono text-xs">
                Clear! All reporting nodes resolved.
              </div>
            ) : (
              reports.map((rep) => {
                const reporter = allUsers.find(u => u.id === rep.reporterId);
                return (
                  <div key={rep.id} className="bg-white dark:bg-zinc-95 w border border-zinc-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start text-xs font-mono">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-zinc-400 block">REPORT PATH {rep.targetType.toUpperCase()} #{rep.id}</span>
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">{rep.targetTitle}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        rep.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/15 text-rose-600 animate-pulse'
                      }`}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed text-xs space-y-1.5">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                        <span>Reporter: {reporter?.username || 'Nexus Member'}</span>
                        <span>Filed: {new Date(rep.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 font-medium">"{rep.reason}"</p>
                    </div>

                    {rep.status === 'pending' ? (
                      <form 
                        onSubmit={(e) => handleResolveSubmit(e, rep)} 
                        className="flex gap-2 font-mono text-xs pt-1"
                      >
                        <input 
                          type="text" 
                          required
                          value={resolutionTextVal[rep.id] || ''}
                          onChange={(e) => setResolutionTextVal({ ...resolutionTextVal, [rep.id]: e.target.value })}
                          placeholder="State resolution action (e.g., 'Removed item and issued warning points')" 
                          className="flex-1 p-2 bg-zinc-50 dark:bg-zinc-95 w border rounded-xl outline-none text-xs"
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold">
                          Resolve
                        </button>
                      </form>
                    ) : (
                      <div className="text-[11px] font-mono text-emerald-600 flex items-center gap-1.5 p-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Resolution logged: "{rep.resolutionText}"</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* DISCIPLINARY ACTIONS CENTER */}
      {activeTab === 'infractions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dispatch form panel */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase flex items-center gap-1.5 pb-2 border-b">
              <Hammer className="h-4.5 w-4.5" />
              Infraction Warning Dispatcher
            </span>

            <form onSubmit={handleInfractionSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-500">Suspect Gamer Username</label>
                <input 
                  type="text" 
                  required
                  value={targetUsername} 
                  onChange={(e) => setTargetUsername(e.target.value)}
                  placeholder="e.g. MercenarySeller" 
                  className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-900 border rounded-lg h-9 text-xs" 
                />
              </div>

              <div>
                <label className="text-zinc-500">Disciplinary Action Option</label>
                <select 
                  value={discipAction} 
                  onChange={(e: any) => setDiscipAction(e.target.value)}
                  className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-900 border rounded-lg h-9 text-xs"
                >
                  <option value="warn">Dispatch Warning points</option>
                  <option value="suspend">Deploy Account Suspension</option>
                  <option value="temp_ban">Temp-Ban lock active</option>
                </select>
              </div>

              {discipAction === 'warn' && (
                <div>
                  <label className="text-zinc-500">Warning Points score (+)</label>
                  <input 
                    type="number" 
                    value={warningPoints} 
                    onChange={(e) => setWarningPoints(Number(e.target.value))}
                    className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-90 w border rounded-lg h-9" 
                    min={1} 
                    max={100} 
                  />
                  <span className="text-[10px] text-zinc-400 block mt-1">累積 100 points leads to standard automated ban.</span>
                </div>
              )}

              <div>
                <label className="text-zinc-500">Official Sanction Reason / Evidence logs</label>
                <textarea 
                  required
                  rows={4} 
                  value={discipReason} 
                  onChange={(e) => setDiscipReason(e.target.value)}
                  placeholder="Insert explicit reasons: e.g. 'toxic language inside GTA V survival logs node 1' or 'posting leaked plugins inside graphics board'..."
                  className="w-full mt-1.5 p-2 bg-zinc-50 dark:bg-zinc-90 w border rounded-lg text-xs" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-505 hover:bg-amber-500 text-white font-bold rounded-xl shadow cursor-pointer text-xs"
              >
                Dispatch Infraction Shield
              </button>
            </form>
          </div>

          {/* Active players lists to easily inspect warning points */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block pl-1">Server Registered Members list</span>
            
            <div className="border border-zinc-200 rounded-2xl bg-white dark:bg-zinc-950/80 overflow-hidden shadow-sm divide-y">
              {allUsers.map((user) => (
                <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.username} className="h-8 w-8 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold text-zinc-800 dark:text-white block">{user.username}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{user.role}</span>
                    </div>
                  </div>

                  {/* Warning stats indicators */}
                  <div className="flex items-center gap-4 font-mono">
                    <div className="text-right">
                      <span className="block text-[8px] uppercase text-zinc-400 font-bold">Ref Posts</span>
                      <span className="text-zinc-700 dark:text-zinc-350 font-semibold">{user.postsCount}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase text-zinc-400 font-bold">Reputation</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">+{user.repPoints}</span>
                    </div>
                    <div className="text-right min-w-[75px]">
                      <span className="block text-[8px] uppercase text-zinc-400 font-bold">Infraction Warnings</span>
                      <span className="text-rose-500 font-bold font-mono">{(user.id === 'user_noobmaster') ? '20/100 IP' : '0/100 IP'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUDIT SECURITY LOGS TRAIL */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pl-1">
            <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Core system transactions audit logs</span>
            <span className="text-[10.5px] font-bold text-indigo-605">🛡️ Decrypted & Signed securely</span>
          </div>

          <div className="border border-zinc-250 dark:border-zinc-805 bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-sm font-mono">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 font-bold flex justify-between uppercase text-zinc-400 text-[10px]">
              <span>Audit Event Action</span>
              <span className="hidden md:inline">Parameters / Actors</span>
              <span>Logged Date</span>
            </div>

            <div className="divide-y max-h-96 overflow-y-auto">
              {auditLogs.map((log) => {
                const actor = allUsers.find(u => u.id === log.actorId);
                return (
                  <div key={log.id} className="p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-90 w/10 transition flex flex-col md:flex-row justify-between gap-1.5 text-[11px] leading-relaxed">
                    <div className="flex-1 space-y-1 pr-4">
                      <span className="inline-block bg-zinc-100 dark:bg-zinc-90 w/80 border text-[9.5px] px-1.5 font-bold font-mono text-indigo-600 border-indigo-500/10 capitalize">
                        {log.action}
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-350">{log.details}</p>
                    </div>

                    <div className="w-52 shrink-0 space-y-0.5 text-[10px] text-zinc-455 self-start md:self-center">
                      <div className="flex gap-1">
                        <span>Actor:</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">{actor?.username || 'Nexus Core'}</span>
                      </div>
                      <div className="flex gap-1 text-[9px] text-zinc-400">
                        <span>Target:</span>
                        <span>{log.target}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-zinc-400 shrink-0 self-start md:self-center font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
