import { Component, type ErrorInfo, type ReactNode } from "react";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Codexa UI error", error, info); }
  render() {
    if (this.state.failed) return <main className="flex min-h-screen items-center justify-center bg-[#0B0B0C] p-6 text-center text-white"><div><h1 className="text-2xl font-bold">Something went wrong</h1><p className="mt-2 text-sm text-zinc-400">Reload the page to restore your workspace.</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-violet-600 px-4 py-2 text-sm">Reload Codexa</button></div></main>;
    return this.props.children;
  }
}
