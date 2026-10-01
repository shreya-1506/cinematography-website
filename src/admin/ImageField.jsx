import { useEffect, useMemo, useRef, useState } from 'react';
import { formatBytes, readFileAsDataUrl, uploadAsset } from './api';

/**
 * Picks an image for a field. Three ways in:
 *   - browse the assets already in public/assets
 *   - upload a file (written to public/assets/uploads when the dev API is up,
 *     otherwise embedded in content.json as a data URL)
 *   - type or paste any path or URL
 */
export default function ImageField({ value, onChange, assets, hasApi, onAssetsChanged, kind = 'image' }) {
  const [browsing, setBrowsing] = useState(false);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const text = typeof value === 'string' ? value : '';

  const groups = useMemo(() => {
    const filtered = assets.filter((a) => {
      if (kind === 'video') return /\.(mp4|webm|mov)$/i.test(a.path);
      return !/\.(mp4|webm|mov)$/i.test(a.path);
    });
    const needle = query.trim().toLowerCase();
    const matched = needle ? filtered.filter((a) => a.path.toLowerCase().includes(needle)) : filtered;
    const map = new Map();
    for (const asset of matched) {
      if (!map.has(asset.group)) map.set(asset.group, []);
      map.get(asset.group).push(asset);
    }
    return [...map.entries()];
  }, [assets, query, kind]);

  useEffect(() => {
    if (!browsing) setQuery('');
  }, [browsing]);

  const onFile = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;

    setBusy(true);
    setError('');
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (hasApi) {
        const result = await uploadAsset(file.name, dataUrl);
        onChange(result.path);
        if (onAssetsChanged) onAssetsChanged();
      } else {
        // No dev server: embed it. Warn when that will bloat content.json.
        if (dataUrl.length > 400 * 1024) {
          setError(
            'Embedded at ' +
              formatBytes(dataUrl.length) +
              '. Large files bloat content.json — prefer uploading the file to /public/assets and pasting its path.',
          );
        }
        onChange(dataUrl);
      }
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setBusy(false);
    }
  };

  const isData = text.startsWith('data:');

  return (
    <div className="afield-image">
      <div className="afield-image__row">
        <div className="afield-image__preview" aria-hidden="true">
          {text ? (
            kind === 'video' ? (
              <span className="afield-image__badge">video</span>
            ) : (
              <img src={text} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.opacity = '0.15'; }} />
            )
          ) : (
            <span className="afield-image__empty">none</span>
          )}
        </div>

        <div className="afield-image__controls">
          <input
            type="text"
            className="afield__input"
            value={isData ? '(embedded file)' : text}
            readOnly={isData}
            placeholder="/assets/stills/example.svg or https://…"
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="afield-image__buttons">
            <button type="button" className="abtn abtn--sm" onClick={() => setBrowsing((v) => !v)}>
              {browsing ? 'Close' : 'Browse'}
            </button>
            <button
              type="button"
              className="abtn abtn--sm"
              onClick={() => fileRef.current && fileRef.current.click()}
              disabled={busy}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </button>
            {text ? (
              <button type="button" className="abtn abtn--sm abtn--quiet" onClick={() => onChange('')}>
                Clear
              </button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={kind === 'video' ? 'video/mp4,video/webm' : 'image/*'}
            hidden
            onChange={onFile}
          />
        </div>
      </div>

      {error ? <p className="afield__warn">{error}</p> : null}

      {browsing ? (
        <div className="afield-image__browser">
          <input
            type="search"
            className="afield__input afield-image__search"
            placeholder="Filter assets…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {groups.length === 0 ? (
            <p className="afield__hint">
              {assets.length
                ? 'No assets match that filter.'
                : 'Asset browsing needs the dev server. Run npm run dev, or paste a path above.'}
            </p>
          ) : (
            groups.map(([group, items]) => (
              <div className="afield-image__group" key={group}>
                <p className="afield-image__group-name">
                  {group} <span>{items.length}</span>
                </p>
                <div className="afield-image__grid">
                  {items.map((asset) => (
                    <button
                      type="button"
                      key={asset.path}
                      className={'afield-image__thumb' + (asset.path === text ? ' is-active' : '')}
                      title={asset.path + ' · ' + formatBytes(asset.bytes)}
                      onClick={() => {
                        onChange(asset.path);
                        setBrowsing(false);
                      }}
                    >
                      {kind === 'video' ? (
                        <span className="afield-image__badge">mp4</span>
                      ) : (
                        <img src={asset.path} alt="" loading="lazy" />
                      )}
                      <span className="afield-image__thumb-name">{asset.path.split('/').pop()}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
