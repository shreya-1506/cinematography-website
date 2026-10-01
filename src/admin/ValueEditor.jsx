import { useState } from 'react';
import ImageField from './ImageField';
import { hintFor, labelFor, summarize } from './schema';

/**
 * Recursive editor.
 *
 * It walks the content tree itself rather than a hand-written form, so every
 * field that exists on the site is editable, and new fields added to siteData
 * show up here automatically. Control type comes from a path hint first
 * (images, colours, dropdowns) and falls back to the value's own type.
 */

/** Build a sensible blank entry when adding to a list. */
function blankLike(sample) {
  if (Array.isArray(sample)) return [];
  if (sample === null || sample === undefined) return '';
  if (typeof sample === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(sample)) {
      if (key === 'id') {
        out[key] = 'new-' + Math.random().toString(36).slice(2, 7);
      } else {
        out[key] = blankLike(value);
      }
    }
    return out;
  }
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
}

/**
 * A React key for one row of a list.
 *
 * Keying by index makes a row inherit the previous occupant's collapsed state
 * when rows are deleted or reordered. An `id` survives edits (editing a field
 * rebuilds the object but keeps the id), so it is the stable choice where one
 * exists; primitives and id-less objects fall back to the index.
 */
function rowKey(item, index) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const id = item.id;
    if (typeof id === 'string' && id) return 'id:' + id;
    if (typeof id === 'number') return 'id:' + id;
  }
  return 'i:' + index;
}

function Scalar({ path, value, onChange, ctx }) {
  const hint = hintFor(path);
  const type = hint ? hint.type : null;

  if (type === 'image' || type === 'video') {
    return (
      <ImageField
        value={value}
        kind={type}
        onChange={onChange}
        assets={ctx.assets}
        hasApi={ctx.hasApi}
        onAssetsChanged={ctx.refreshAssets}
      />
    );
  }

  if (type === 'color') {
    const safe = typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value) ? value : '#000000';
    return (
      <div className="afield__color">
        <input
          type="color"
          value={safe}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Colour picker"
        />
        <input
          type="text"
          className="afield__input"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  if (type === 'select') {
    const options = hint.options(ctx.doc) || [];
    const known = options.includes(value);
    return (
      <select
        className="afield__input"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {!known ? <option value={value ?? ''}>{String(value ?? '')} (custom)</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <label className="afield__switch">
        <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} />
        <span className="afield__switch-track" aria-hidden="true" />
        <span className="afield__switch-text">{value ? 'On' : 'Off'}</span>
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        className="afield__input"
        value={Number.isFinite(value) ? value : ''}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === '' ? '' : Number(next));
        }}
      />
    );
  }

  const text = value ?? '';
  const multiline = type === 'textarea' || (typeof text === 'string' && text.length > 90);

  if (multiline) {
    return (
      <textarea
        className="afield__input afield__textarea"
        rows={Math.min(10, Math.max(3, Math.ceil(String(text).length / 72)))}
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      type={type === 'url' ? 'text' : 'text'}
      className="afield__input"
      value={text}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function ArrayEditor({ path, value, onChange, ctx, depth }) {
  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const removeAt = (index) => {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  };

  const duplicateAt = (index) => {
    const next = value.slice();
    const copy = JSON.parse(JSON.stringify(next[index]));
    if (copy && typeof copy === 'object' && !Array.isArray(copy) && copy.id) {
      // Ids must stay unique: they are React keys and, for several sections,
      // the thing the site animates by. Walk until we find a free one.
      const taken = new Set(
        value.filter((item) => item && typeof item === 'object').map((item) => item.id),
      );
      const stem = String(copy.id).replace(/-copy(-\d+)?$/, '');
      let candidate = stem + '-copy';
      let n = 2;
      while (taken.has(candidate)) {
        candidate = stem + '-copy-' + n;
        n += 1;
      }
      copy.id = candidate;
    }
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  const add = () => {
    const sample = value.length ? value[value.length - 1] : '';
    const fresh = blankLike(sample);
    if (fresh && typeof fresh === 'object' && !Array.isArray(fresh) && 'id' in fresh) {
      const taken = new Set(
        value.filter((item) => item && typeof item === 'object').map((item) => item.id),
      );
      while (taken.has(fresh.id)) fresh.id = 'new-' + Math.random().toString(36).slice(2, 7);
    }
    onChange(value.concat([fresh]));
  };

  return (
    <div className="alist">
      {value.length === 0 ? <p className="afield__hint">Empty list.</p> : null}

      {value.map((item, index) => (
        <Node
          key={rowKey(item, index)}
          path={path + '.' + index}
          label={
            (item && typeof item === 'object' && (item.title || item.label || item.name || item.heading)) ||
            '#' + (index + 1)
          }
          value={item}
          onChange={(next) => {
            const copy = value.slice();
            copy[index] = next;
            onChange(copy);
          }}
          ctx={ctx}
          depth={depth + 1}
          index={index}
          tools={
            <>
              <button type="button" className="aicon" title="Move up" onClick={() => move(index, index - 1)} disabled={index === 0}>
                ↑
              </button>
              <button
                type="button"
                className="aicon"
                title="Move down"
                onClick={() => move(index, index + 1)}
                disabled={index === value.length - 1}
              >
                ↓
              </button>
              <button type="button" className="aicon" title="Duplicate" onClick={() => duplicateAt(index)}>
                ⧉
              </button>
              <button type="button" className="aicon aicon--danger" title="Delete" onClick={() => removeAt(index)}>
                ×
              </button>
            </>
          }
        />
      ))}

      <button type="button" className="abtn abtn--sm abtn--add" onClick={add}>
        + Add item
      </button>
    </div>
  );
}

/**
 * One node of the tree. Objects and arrays render as collapsible groups;
 * scalars render as a labelled control.
 */
export default function Node({ path, label, value, onChange, ctx, depth = 0, tools = null, index }) {
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isGroup = isObject || isArray;

  // Top two levels start open so the section is immediately useful.
  const [open, setOpen] = useState(depth < 1 || (depth < 2 && !isArray));

  const displayLabel = label ?? labelFor(path.split('.').pop());

  if (!isGroup) {
    return (
      <div className="afield" data-depth={depth}>
        <label className="afield__label">
          <span className="afield__label-text">{displayLabel}</span>
          <span className="afield__path">{path}</span>
        </label>
        <div className="afield__control">
          <Scalar path={path} value={value} onChange={onChange} ctx={ctx} />
        </div>
        {tools ? <div className="afield__tools">{tools}</div> : null}
      </div>
    );
  }

  const count = isArray ? value.length : Object.keys(value).length;

  return (
    <section className={'agroup' + (open ? ' is-open' : '')} data-depth={depth}>
      <header className="agroup__head">
        <button type="button" className="agroup__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span className="agroup__chevron" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
          <span className="agroup__title">{displayLabel}</span>
          <span className="agroup__meta">{isArray ? count + (count === 1 ? ' item' : ' items') : summarize(value)}</span>
        </button>
        {tools ? <div className="agroup__tools">{tools}</div> : null}
      </header>

      {open ? (
        <div className="agroup__body">
          {isArray ? (
            <ArrayEditor path={path} value={value} onChange={onChange} ctx={ctx} depth={depth} />
          ) : (
            Object.keys(value).map((key) => (
              <Node
                key={key}
                path={path + '.' + key}
                label={labelFor(key)}
                value={value[key]}
                onChange={(next) => onChange({ ...value, [key]: next })}
                ctx={ctx}
                depth={depth + 1}
              />
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
