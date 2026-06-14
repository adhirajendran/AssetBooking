import { useState, useEffect } from 'react';

export default function Dashboard({ user }: { user: any }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  
  // Booking form state
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [purpose, setPurpose] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
    fetchMyBookings();
    fetchAllBookings();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/assets');
      const data = await res.json();
      setAssets(data);
    } catch(e) { console.error(e) }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`);
      const data = await res.json();
      setMyBookings(data);
    } catch(e) { console.error(e) }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/bookings');
      const data = await res.json();
      setAllBookings(data);
    } catch(e) { console.error(e) }
  }

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !bookingDate) {
      setError('Please fill required fields.');
      return;
    }
    setError('');

    const start = `${bookingDate}T${startTime}:00`;
    const end = `${bookingDate}T${endTime}:00`;

    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: parseInt(selectedAsset),
          userId: user.id,
          startTime: start,
          endTime: end,
          purpose
        })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      
      // Refresh bookings
      fetchMyBookings();
      fetchAllBookings();
      setSelectedAsset('');
      setPurpose('');
      alert('Booking successful!');
    } catch (err: any) {
      setError(err.message || 'Failed to book asset. Conflict?');
    }
  };

  const getBookingsByDate = (dateStr: string) => {
    return allBookings.filter(b => b.startTime.startsWith(dateStr) && (b.status === 'APPROVED' || b.status === 'PENDING'));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ marginBottom: '20px' }}>Make a Reservation</h2>
          {error && <div style={{ color: 'var(--accent-danger)', marginBottom: '15px' }}>{error}</div>}
          
          <form onSubmit={handleBook}>
            <div className="input-group">
              <label className="input-label">Select Asset</label>
              <select className="input-field" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} required>
                <option value="">-- Choose Asset --</option>
                {assets.filter(a => a.active).map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.type})</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label">Date</label>
              <input type="date" className="input-field" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
               <div className="input-group" style={{ flex: 1 }}>
                 <label className="input-label">Start Time</label>
                 <input type="time" className="input-field" value={startTime} onChange={e => setStartTime(e.target.value)} required />
               </div>
               <div className="input-group" style={{ flex: 1 }}>
                 <label className="input-label">End Time</label>
                 <input type="time" className="input-field" value={endTime} onChange={e => setEndTime(e.target.value)} required />
               </div>
            </div>

            <div className="input-group">
              <label className="input-label">Purpose (optional)</label>
              <input type="text" className="input-field" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Client Meeting" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Book Now</button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
           <h2 style={{ marginBottom: '20px' }}>Availability Check</h2>
           <p style={{ marginBottom: '15px' }}>Showing bookings for <strong>{bookingDate}</strong>:</p>
           {getBookingsByDate(bookingDate).length === 0 ? (
             <p style={{ color: 'var(--accent-success)' }}>All assets appear clear for this day.</p>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getBookingsByDate(bookingDate).map(b => (
                  <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '3px solid var(--accent-warning)' }}>
                    <div>
                      <strong>{b.asset.name}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Booked by {b.user.name}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                      <div>{new Date(b.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(b.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '30px', maxHeight: '800px', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '20px' }}>My Bookings</h2>
        
        {myBookings.length === 0 ? (
          <p>You have no active bookings.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {myBookings.sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map(b => (
              <div key={b.id} className="glass-panel" style={{ padding: '15px', background: 'var(--bg-secondary)', borderLeft: `4px solid ${b.status === 'APPROVED' ? 'var(--accent-success)' : b.status === 'PENDING' ? 'var(--accent-warning)' : 'var(--accent-danger)'}`}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>{b.asset.name}</h3>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                  {new Date(b.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} - {new Date(b.endTime).toLocaleTimeString([], { timeStyle: 'short' })}
                </p>
                {b.purpose && <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>"{b.purpose}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
