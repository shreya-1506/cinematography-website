import { Component } from 'react';

/**
 * Keeps a rendering fault in one section from blanking the whole page.
 * Wrapped around each section in App so the rest of the site survives.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[' + (this.props.name || 'section') + '] render failed', error, info);
  }

  render() {
    const { error } = this.state;
    const { children, name, fallback } = this.props;

    if (!error) return children;
    if (fallback) return fallback;

    return (
      <div className="section-error" role="alert">
        <p className="mono">This section could not be displayed{name ? ' (' + name + ')' : ''}.</p>
        <button type="button" className="btn btn--ghost" onClick={() => this.setState({ error: null })}>
          Try again
        </button>
      </div>
    );
  }
}
