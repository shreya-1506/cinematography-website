import { useEffect, useRef, useState } from 'react';
import { adminUser, hasCredentials, lockoutRemaining, signIn } from './auth';

const REASON_TEXT = {
  'signed-out': '',
  expired: 'Your session expired. Sign in again.',
  idle: 'Signed out after 30 minutes of inactivity.',
};

export default function SignIn({ onSignedIn, reason }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(() => lockoutRemaining());
  const userRef = useRef(null);

  const configured = hasCredentials();

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  // Count a lockout down so the form re-enables on its own.
  useEffect(() => {
    if (locked <= 0) return undefined;
    const id = setInterval(() => {
      const next = lockoutRemaining();
      setLocked(next);
      if (next <= 0) setError('');
    }, 500);
    return () => clearInterval(id);
  }, [locked]);

  const submit = async (event) => {
    event.preventDefault();
    if (busy || locked > 0) return;

    setBusy(true);
    setError('');
    try {
      const result = await signIn(username, password);
      if (result.ok) {
        onSignedIn();
        return;
      }
      setError(result.error);
      setLocked(result.lockedForMs || 0);
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  const notice = reason ? REASON_TEXT[reason] : '';

  return (
    <div className="agate">
      <form className="agate__card" onSubmit={submit}>
        <p className="agate__eyebrow">Content editor</p>
        <h1 className="agate__title">Sign in</h1>

        {!configured ? (
          <>
            <p className="agate__text">No credentials are configured yet. Run:</p>
            <pre className="agate__code">npm run admin:credentials</pre>
            <p className="agate__text">
              Paste the three lines it prints into <code>.env</code>, then restart the dev server.
            </p>
          </>
        ) : (
          <>
            {notice ? <p className="agate__notice">{notice}</p> : null}

            <label className="agate__label" htmlFor="admin-user">
              Username
            </label>
            <input
              id="admin-user"
              ref={userRef}
              type="text"
              className="afield__input"
              autoComplete="username"
              value={username}
              disabled={busy || locked > 0}
              onChange={(event) => {
                setUsername(event.target.value);
                setError('');
              }}
            />

            <label className="agate__label" htmlFor="admin-pass">
              Password
            </label>
            <input
              id="admin-pass"
              type="password"
              className="afield__input"
              autoComplete="current-password"
              value={password}
              disabled={busy || locked > 0}
              onChange={(event) => {
                setPassword(event.target.value);
                setError('');
              }}
            />

            {error ? (
              <p className="afield__warn" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="abtn abtn--primary"
              disabled={busy || locked > 0 || !username || !password}
            >
              {busy ? 'Checking…' : locked > 0 ? 'Locked (' + Math.ceil(locked / 1000) + 's)' : 'Sign in'}
            </button>

            <p className="agate__small">
              Signed-in sessions last 8 hours and lock after 30 minutes idle.
              {adminUser ? '' : ''}
            </p>
          </>
        )}
      </form>
    </div>
  );
}
