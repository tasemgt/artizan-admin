// src/pages/community/GateVerify.jsx
// Primary screen for Community Security and Admin roles.
// Allows entry of 6-char code or QR scan to verify artisan access.

import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axiosClient from '../../api/axiosClient';

const INITIAL = { status: 'idle', data: null, error: null };

export default function GateVerify() {
  const [code,     setCode]     = useState('');
  const [result,   setResult]   = useState(INITIAL);
  const [scanning, setScanning] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  // ── QR Scanner lifecycle ──────────────────────────────────────────
  useEffect(() => {
    if (scanning && scannerRef.current) {
      html5QrRef.current = new Html5Qrcode('qr-reader');
      html5QrRef.current
        .start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            setCode(decodedText);
            stopScanner();
            verifyCode(decodedText);
          },
          () => {},
        )
        .catch(() => setScanning(false));
    }
    return () => { if (html5QrRef.current) stopScanner(); };
  }, [scanning]);

  const stopScanner = () => {
    html5QrRef.current?.stop().catch(() => {});
    setScanning(false);
  };

  // ── Verify ────────────────────────────────────────────────────────
  const verifyCode = async (codeToVerify) => {
    const trimmed = (codeToVerify ?? code).trim().toUpperCase();
    if (!trimmed || trimmed.length !== 6) {
      setResult({ status: 'error', data: null, error: 'Please enter a valid 6-character access code.' });
      return;
    }
    setLoading(true);
    setResult(INITIAL);
    try {
      const { data } = await axiosClient.post('/access-codes/verify', { code: trimmed });
      setResult({ status: 'valid', data: data.data, error: null });
    } catch (err) {
      const msg = err.response?.data?.error?.message ?? 'Invalid or expired access code.';
      setResult({ status: 'invalid', data: null, error: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setResult(INITIAL);
  };

  return (
    <div className="gate-verify-page">
      <div className="gate-verify-card">

        {/* Header card */}
        <div className="card">
          <div className="card-header-primary" style={{ margin: 0, borderRadius: '6px 6px 0 0', padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="material-icons" style={{ fontSize: 28 }}>verified_user</span>
              <div>
                <h4 className="card-title-white" style={{ margin: 0 }}>Gate Verification</h4>
                <p className="card-subtitle-white" style={{ margin: 0 }}>Enter or scan artisan access code</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            {/* Code input */}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Access Code</label>
              <input
                className="form-control gate-code-input"
                type="text"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="A B C 1 2 3"
                onKeyDown={e => e.key === 'Enter' && verifyCode()}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 10,
                  textAlign: 'center',
                  color: 'var(--color-primary)',
                  border: 'none',
                  borderBottom: '2px solid var(--color-primary)',
                  width: '100%',
                  paddingBottom: 8,
                  background: 'transparent',
                  outline: 'none',
                }}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                className="btn btn-primary"
                onClick={() => verifyCode()}
                disabled={loading || code.length !== 6}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span className="material-icons" style={{ fontSize: 18 }}>check_circle</span>
                {loading ? 'Verifying…' : 'Verify Code'}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setScanning(s => !s)}
                style={{ flexShrink: 0 }}
                title="Scan QR Code"
              >
                <span className="material-icons">qr_code_scanner</span>
              </button>
              {result.status !== 'idle' && (
                <button className="btn btn-outline" onClick={handleReset} title="Reset">
                  <span className="material-icons">refresh</span>
                </button>
              )}
            </div>

            {/* QR scanner area */}
            {scanning && (
              <div style={{ marginTop: 16 }}>
                <div id="qr-reader" style={{ width: '100%', borderRadius: 8, overflow: 'hidden' }} />
                <button
                  className="btn btn-outline"
                  onClick={stopScanner}
                  style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
                >
                  Cancel Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result: Valid */}
        {result.status === 'valid' && result.data && (
          <div className="gate-result-valid">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="material-icons" style={{ color: '#2e7d32', fontSize: 28 }}>check_circle</span>
              <strong style={{ color: '#2e7d32', fontSize: 16 }}>Access Granted</strong>
            </div>

            {/* Artisan profile */}
            <div className="gate-artisan-profile">
              {result.data.artisan?.profileImageUrl ? (
                <img
                  src={result.data.artisan.profileImageUrl}
                  alt="Artisan"
                  className="gate-artisan-avatar"
                />
              ) : (
                <div className="gate-artisan-avatar" style={{ background: '#c8e6c9', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', border: '2px solid #4caf50' }}>
                  <span className="material-icons" style={{ color: '#2e7d32' }}>construction</span>
                </div>
              )}
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#212121' }}>
                  {result.data.artisan?.firstName} {result.data.artisan?.lastName}
                </div>
                <div style={{ fontSize: 13, color: '#555' }}>
                  {result.data.artisan?.category?.name ?? 'Artisan'}
                </div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                  ⭐ {result.data.artisan?.rating?.toFixed(1) ?? '—'} rating
                </div>
              </div>
            </div>

            {/* Booking context */}
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: '#555' }}>
                <strong>{result.data.user?.firstName}</strong> has booked a{' '}
                <strong>{result.data.request?.category?.name}</strong> service
              </div>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                Booked: {result.data.request?.createdAt
                  ? new Date(result.data.request.createdAt).toLocaleString()
                  : '—'}
              </div>
              {result.data.accessCodeUsedAt && (
                <div style={{ fontSize: 12, color: '#e65100', marginTop: 4 }}>
                  ⚠ Code was previously used at {new Date(result.data.accessCodeUsedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result: Invalid */}
        {(result.status === 'invalid' || result.status === 'error') && (
          <div className="gate-result-invalid">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-icons" style={{ color: '#c62828', fontSize: 28 }}>cancel</span>
              <strong style={{ color: '#c62828', fontSize: 16 }}>
                {result.status === 'invalid' ? 'Access Denied' : 'Invalid Input'}
              </strong>
            </div>
            <p style={{ color: '#c62828', fontSize: 14, margin: '8px 0 0' }}>{result.error}</p>
          </div>
        )}

      </div>
    </div>
  );
}
