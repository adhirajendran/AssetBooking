import { useState, useEffect } from 'react';

export default function AdminPanel({ user }: { user: any }) {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'audit'>('bookings');

  useEffect(() => {
    fetchBookings();
    fetchAuditLogs();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/bookings');
      const data = await res.json();
      setAllBookings(data);
    } catch(e) { console.error(e) }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/audit-logs');
      const data = await res.json();
      setAuditLogs(data);
    } catch(e) { console.error(e) }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:8080/api/bookings/${id}/status?status=${status}&adminId=${user.id}`, {
        method: 'PATCH'
      });
      fetchBookings();
      fetchAuditLogs(); // Refresh logs to show the status change action
    } catch(e) { console.error(e) }
  };

  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Center</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-glass'}`} onClick={() => setActiveTab('bookings')}>All Bookings</button>
          <button className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-glass'}`} onClick={() => setActiveTab('audit')}>Audit History</button>
        </div>
      </div>

      {activeTab === 'bookings' && (
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <th style={{ padding: '15px' }}>ID</th>
            <th style={{ padding: '15px' }}>User</th>
            <th style={{ padding: '15px' }}>Asset</th>
            <th style={{ padding: '15px' }}>Time</th>
            <th style={{ padding: '15px' }}>Status</th>
            <th style={{ padding: '15px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allBookings.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '15px' }}>#{b.id}</td>
              <td style={{ padding: '15px' }}>{b.user.name}</td>
              <td style={{ padding: '15px' }}>{b.asset.name}</td>
              <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>
                {new Date(b.startTime).toLocaleString()}
              </td>
              <td style={{ padding: '15px' }}>
                <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
              </td>
              <td style={{ padding: '15px' }}>
                {b.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleStatusChange(b.id, 'APPROVED')}>Approve</button>
                    <button className="btn btn-glass" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--accent-danger)' }} onClick={() => handleStatusChange(b.id, 'REJECTED')}>Reject</button>
                  </div>
                )}
                {b.status === 'APPROVED' && (
                  <button className="btn btn-glass" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleStatusChange(b.id, 'CANCELLED')}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}

      {activeTab === 'audit' && (
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
            <th style={{ padding: '15px' }}>Time</th>
            <th style={{ padding: '15px' }}>Entity</th>
            <th style={{ padding: '15px' }}>Action</th>
            <th style={{ padding: '15px' }}>Details</th>
            <th style={{ padding: '15px' }}>Performed By</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).reverse().map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
              <td style={{ padding: '15px' }}>{log.entityType} #{log.entityId}</td>
              <td style={{ padding: '15px' }}><span className="badge badge-pending" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{log.action}</span></td>
              <td style={{ padding: '15px' }}>{log.details}</td>
              <td style={{ padding: '15px' }}>{log.performedBy ? log.performedBy.name : 'System'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}
