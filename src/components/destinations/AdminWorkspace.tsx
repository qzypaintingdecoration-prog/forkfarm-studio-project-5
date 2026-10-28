import React, { useState, useEffect } from 'react';
import { Lock, Unlock, RefreshCw, CheckCircle2, Clock, Mail, Phone, Building2, Filter, AlertTriangle } from 'lucide-react';
import { ClientEnquiry } from '../../types';
import { soundEngine } from '../../services/soundEngine';

export const AdminWorkspace: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [enquiries, setEnquiries] = useState<ClientEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<ClientEnquiry | null>(null);

  // Check saved session
  useEffect(() => {
    const savedToken = sessionStorage.getItem('forkframe_admin_token');
    if (savedToken === 'forkframe-studio-secure-2026') {
      setIsAuthenticated(true);
      fetchEnquiries(savedToken);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // Standard secure studio access token
    if (passphrase === 'forkframe-studio-secure-2026' || passphrase === 'forkframe2026') {
      soundEngine.playArrivalChime();
      const token = 'forkframe-studio-secure-2026';
      sessionStorage.setItem('forkframe_admin_token', token);
      setIsAuthenticated(true);
      fetchEnquiries(token);
    } else {
      soundEngine.playSelectClick();
      setAuthError('Invalid administrative passphrase.');
    }
  };

  const handleLogout = () => {
    soundEngine.playSelectClick();
    sessionStorage.removeItem('forkframe_admin_token');
    setIsAuthenticated(false);
    setEnquiries([]);
    setSelectedEnquiry(null);
  };

  const fetchEnquiries = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    soundEngine.playSelectClick();
    const token = sessionStorage.getItem('forkframe_admin_token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus as any } : item))
        );
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus as any });
        }
      }
    } catch (err) {
      console.error('Failed to patch enquiry status:', err);
    }
  };

  // Filtered enquiries
  const filtered = statusFilter === 'All'
    ? enquiries
    : enquiries.filter((e) => e.status === statusFilter);

  // Compute pipeline value estimate
  const totalPipelineEstimated = enquiries.reduce((sum, item) => {
    if (item.budgetTier.includes('£3,000')) return sum + 4500;
    if (item.budgetTier.includes('£6,000')) return sum + 9000;
    if (item.budgetTier.includes('£12,000')) return sum + 18500;
    return sum + 30000;
  }, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Restricted Operational Console
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            Studio Administration
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Review inbound hospitality briefs, client scoping enquiries, and pipeline dispatch.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            Lock Console
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        /* Login Screen */
        <div className="max-w-md mx-auto my-12 p-8 bg-neutral-900/90 rounded-2xl border border-white/10 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Studio Authentication</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Enter your executive passphrase to access confidential client briefs.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Passphrase (e.g. forkframe2026)"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-neutral-950 border border-neutral-700 rounded-xl text-white text-center focus:outline-none focus:border-amber-400 transition-colors"
              autoFocus
            />

            {authError && (
              <span className="text-xs text-red-400 block">{authError}</span>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-lg"
            >
              Unlock Administration
            </button>
          </form>

          <span className="text-[11px] text-neutral-500 block">
            Demo passphrase hint: <code className="text-amber-400">forkframe2026</code>
          </span>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-8">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/10">
              <span className="text-xs text-neutral-400 block">Active Client Enquiries</span>
              <span className="text-2xl font-extrabold font-mono text-white mt-1 block">
                {enquiries.length}
              </span>
            </div>
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/10">
              <span className="text-xs text-neutral-400 block">Estimated Pipeline Value</span>
              <span className="text-2xl font-extrabold font-mono text-amber-400 mt-1 block">
                £{totalPipelineEstimated.toLocaleString()}
              </span>
            </div>
            <div className="p-4 bg-neutral-900/60 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">System State</span>
                <span className="text-xs font-semibold text-emerald-400 mt-1 block">
                  Express API / DB Online
                </span>
              </div>
              <button
                onClick={() => {
                  const token = sessionStorage.getItem('forkframe_admin_token');
                  if (token) fetchEnquiries(token);
                }}
                disabled={isLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors cursor-pointer"
                title="Refresh Enquiries"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-lg border border-white/5">
              {['All', 'New', 'In Review', 'Discovery Scheduled', 'Proposal Sent'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-amber-500 text-black font-semibold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <span className="text-xs text-neutral-400">
              Showing {filtered.length} of {enquiries.length} records
            </span>
          </div>

          {/* Enquiries Grid / Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-neutral-900/80 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider bg-black/40">
                      <th className="py-3 px-4">Ref & Client</th>
                      <th className="py-3 px-4">Venue & Sector</th>
                      <th className="py-3 px-4">Budget Tier</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-neutral-500">
                          No enquiries found under {statusFilter} status.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((enq) => (
                        <tr
                          key={enq.id}
                          onClick={() => {
                            soundEngine.playSelectClick();
                            setSelectedEnquiry(enq);
                          }}
                          className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                            selectedEnquiry?.id === enq.id ? 'bg-amber-500/10' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-amber-400 block">
                              {enq.id}
                            </span>
                            <span className="font-semibold text-white">
                              {enq.clientName}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white block font-medium">
                              {enq.businessName}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {enq.businessType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-300">
                            {enq.budgetTier}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-white">
                              {enq.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Selected Enquiry Detail View (5 cols) */}
            <div className="lg:col-span-5">
              {selectedEnquiry ? (
                <div className="bg-neutral-900/90 rounded-2xl border border-amber-500/30 p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold block">
                        {selectedEnquiry.id}
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {selectedEnquiry.businessName}
                      </h4>
                    </div>

                    {/* Status dropdown */}
                    <select
                      value={selectedEnquiry.status}
                      onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                      className="px-2 py-1 text-xs bg-black border border-neutral-700 rounded-lg text-amber-400 font-medium focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Discovery Scheduled">Discovery Scheduled</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-amber-400 underline">
                        {selectedEnquiry.email}
                      </a>
                    </div>
                    {selectedEnquiry.phone && (
                      <div className="flex items-center gap-2 text-neutral-300">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{selectedEnquiry.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-neutral-300">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Launch Window: {selectedEnquiry.targetLaunch}</span>
                    </div>
                  </div>

                  {/* Scope Items */}
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                      Required Scope & Integrations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEnquiry.projectScope.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/10 text-neutral-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details / Brief Notes */}
                  {selectedEnquiry.details && (
                    <div className="p-3 bg-black/60 rounded-xl border border-white/5 text-xs text-neutral-300 leading-relaxed">
                      <span className="text-neutral-400 font-semibold block mb-1">Client Notes:</span>
                      {selectedEnquiry.details}
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-500 block font-mono">
                    Received: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="p-8 text-center bg-neutral-900/50 rounded-2xl border border-white/10 text-xs text-neutral-500">
                  Select an enquiry row to review full requirements and contact info.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
