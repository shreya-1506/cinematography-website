import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Node from './ValueEditor';
import SignIn from './SignIn';
import { SECTIONS } from './schema';
import { sessionState, signOut, touchSession } from './auth';
import {
  deleteContent,
  downloadJson,
  formatBytes,
  listAssets,
  probeApi,
  readFileAsText,
  saveContent,
} from './api';
import {
  clearDraft,
  contentDefaults,
  fetchPublished,
  readDraft,
  toEditable,
  toOverrides,
  writeDraft,
} from '@/content/store';
import { clone } from '@/content/merge';
import '@/styles/admin.css';

export default function Admin() {
  // Sign-on state. When no credentials are configured the editor stays locked
  // and tells you how to create them, rather than silently opening.
  const [auth, setAuth] = useState(() => sessionState());

  const [doc, setDoc] = useState(null);
  const [published, setPublished] = useState({});
  const [api, setApi] = useState(null);
  const [assets, setAssets] = useState([]);
  const [active, setActive] = useState(SECTIONS[0].key);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState('');
  const importRef = useRef(null);

  /* ------------------------------------------------------------- loading */
  useEffect(() => {
    if (!auth.valid) return undefined;
    let cancelled = false;
    (async () => {
      const [pub, probe] = await Promise.all([fetchPublished(), probeApi()]);
      if (cancelled) return;
      setPublished(pub);
      setApi(probe);
      const draft = readDraft();
      setDoc(toEditable(pub, draft));
      setDirty(Boolean(draft));
      if (probe) setAssets(await listAssets());
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.valid]);

  const refreshAssets = useCallback(async () => {
    if (api) setAssets(await listAssets());
  }, [api]);

  /* --------------------------------------------------- draft autosaving */
  useEffect(() => {
    if (!doc || !dirty) return undefined;
    const id = setTimeout(() => {
      const ok = writeDraft(toOverrides(doc));
      if (!ok) {
        setError('Draft could not be saved locally — browser storage is full. Publish or export now.');
      }
    }, 600);
    return () => clearTimeout(id);
  }, [doc, dirty]);

  /* ------------------------------------------------------ session upkeep */
  useEffect(() => {
    if (!auth.valid) return undefined;

    // Real interaction pushes the idle deadline out.
    const bump = () => touchSession();
    const events = ['pointerdown', 'keydown', 'focusin'];
    events.forEach((name) => window.addEventListener(name, bump, { passive: true }));

    // And a slow poll notices expiry or idle timeout without a reload.
    const id = setInterval(() => {
      const next = sessionState();
      if (!next.valid) setAuth(next);
    }, 30000);

    return () => {
      events.forEach((name) => window.removeEventListener(name, bump));
      clearInterval(id);
    };
  }, [auth.valid]);

  /* ------------------------------------------ warn before losing a draft */
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const overrides = useMemo(() => (doc ? toOverrides(doc) : {}), [doc]);
  const overrideSize = useMemo(() => JSON.stringify(overrides).length, [overrides]);
  const changedSections = useMemo(() => new Set(Object.keys(overrides)), [overrides]);

  const sections = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return SECTIONS;
    return SECTIONS.filter(
      (s) => s.label.toLowerCase().includes(needle) || s.key.toLowerCase().includes(needle),
    );
  }, [query]);

  const update = useCallback((key, next) => {
    setDoc((current) => ({ ...current, [key]: next }));
    setDirty(true);
    setStatus('');
  }, []);

  /* ------------------------------------------------------------ actions */

  const publish = async () => {
    setError('');
    try {
      const result = await saveContent(overrides);
      setPublished(overrides);
      clearDraft();
      setDirty(false);
      setStatus('Published to ' + result.file + ' (' + formatBytes(result.bytes) + '). Reload the site to see it.');
    } catch (err) {
      setError('Could not publish: ' + (err.message || err));
    }
  };

  const exportJson = () => {
    downloadJson(overrides);
    setStatus('content.json downloaded. Put it in /public (or your host’s root) and redeploy.');
  };

  const importJson = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    try {
      const parsed = JSON.parse(await readFileAsText(file));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('That file is not a content JSON object');
      }
      setDoc(toEditable(parsed, null));
      setDirty(true);
      setStatus('Imported ' + file.name + '. Nothing is live until you publish.');
    } catch (err) {
      setError('Could not import: ' + (err.message || err));
    }
  };

  const discardDraft = () => {
    clearDraft();
    setDoc(toEditable(published, null));
    setDirty(false);
    setStatus('Draft discarded. Showing what is currently published.');
  };

  const resetSection = () => {
    if (!doc) return;
    setDoc((current) => ({ ...current, [active]: clone(contentDefaults[active]) }));
    setDirty(true);
    setStatus('');
  };

  const resetEverything = async () => {
    setError('');
    try {
      if (api) await deleteContent();
      clearDraft();
      setPublished({});
      setDoc(toEditable({}, null));
      setDirty(false);
      setStatus('Everything is back to the built-in defaults.');
    } catch (err) {
      setError('Could not reset: ' + (err.message || err));
    }
  };

  if (!auth.valid) {
    return <SignIn reason={auth.reason} onSignedIn={() => setAuth(sessionState())} />;
  }

  if (!doc) {
    return (
      <div className="aloading">
        <p>Loading content…</p>
      </div>
    );
  }

  const ctx = { doc, assets, hasApi: Boolean(api), refreshAssets };
  const activeSection = SECTIONS.find((s) => s.key === active) || SECTIONS[0];

  return (
    <div className="admin">
      {/* ------------------------------------------------------- toolbar */}
      <header className="admin__bar">
        <div className="admin__brand">
          <span className="admin__brand-mark">PP</span>
          <span>
            <span className="admin__brand-title">Content editor</span>
            <span className="admin__brand-sub">
              {(auth.user ? auth.user + ' · ' : '') +
                (api ? 'saves to disk' : 'static mode — export to publish')}
            </span>
          </span>
        </div>

        <div className="admin__actions">
          <span className={'admin__dirty' + (dirty ? ' is-dirty' : '')}>
            {dirty ? 'Unsaved draft' : 'No pending changes'}
          </span>

          <a className="abtn abtn--sm" href="#/?preview=draft" target="_blank" rel="noreferrer">
            Preview draft
          </a>

          <button type="button" className="abtn abtn--sm" onClick={() => importRef.current?.click()}>
            Import
          </button>
          <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importJson} />

          <button type="button" className="abtn abtn--sm" onClick={exportJson}>
            Export JSON
          </button>

          {api ? (
            <button type="button" className="abtn abtn--sm abtn--primary" onClick={publish} disabled={!dirty}>
              Publish
            </button>
          ) : null}

          <button
            type="button"
            className="abtn abtn--sm abtn--quiet"
            onClick={() => {
              if (dirty && !window.confirm('You have an unsaved draft. Sign out anyway?')) return;
              signOut();
              setAuth(sessionState());
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {status ? <p className="admin__flash">{status}</p> : null}
      {error ? <p className="admin__flash admin__flash--error">{error}</p> : null}

      {!api ? (
        <p className="admin__note">
          The dev API is not running, so changes stay in this browser. Use <strong>Export JSON</strong>,
          commit the file to <code>public/content.json</code>, and redeploy.
        </p>
      ) : null}

      <div className="admin__body">
        {/* ----------------------------------------------------- sidebar */}
        <nav className="admin__nav" aria-label="Content sections">
          <input
            type="search"
            className="afield__input admin__search"
            placeholder="Find a section…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ul>
            {sections.map((section) => (
              <li key={section.key}>
                <button
                  type="button"
                  className={'admin__nav-item' + (section.key === active ? ' is-active' : '')}
                  onClick={() => setActive(section.key)}
                >
                  <span className="admin__nav-label">{section.label}</span>
                  {changedSections.has(section.key) ? (
                    <span className="admin__nav-dot" title="Changed from defaults" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>

          <div className="admin__nav-foot">
            <p className="admin__stat">
              Override size <strong>{formatBytes(overrideSize)}</strong>
            </p>
            {dirty ? (
              <button type="button" className="abtn abtn--sm abtn--quiet" onClick={discardDraft}>
                Discard draft
              </button>
            ) : null}
            <button type="button" className="abtn abtn--sm abtn--danger" onClick={resetEverything}>
              Reset everything
            </button>
          </div>
        </nav>

        {/* ------------------------------------------------------ editor */}
        <main className="admin__editor">
          <div className="admin__editor-head">
            <div>
              <h2 className="admin__editor-title">{activeSection.label}</h2>
              <p className="admin__editor-hint">{activeSection.hint}</p>
            </div>
            <button type="button" className="abtn abtn--sm abtn--quiet" onClick={resetSection}>
              Reset this section
            </button>
          </div>

          <Node
            path={active}
            label={activeSection.label}
            value={doc[active]}
            onChange={(next) => update(active, next)}
            ctx={ctx}
            depth={0}
          />
        </main>
      </div>
    </div>
  );
}
