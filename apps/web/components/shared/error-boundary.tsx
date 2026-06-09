"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[400px] flex-col items-center justify-center border border-gray-300 bg-white p-12 text-center"
        >
          <p className="text-5xl font-medium tracking-tight text-gray-300">
            Something broke.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-8 border border-black bg-black px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-editorial"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
