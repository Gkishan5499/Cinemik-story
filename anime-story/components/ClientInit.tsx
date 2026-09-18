'use client';

import { useEffect } from 'react';

// Execute DOM safety patch synchronously as soon as client module JS is loaded
if (typeof window !== 'undefined') {
  try {
    const origRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child && child.parentNode !== this) {
        if (child.parentNode) {
          return child.parentNode.removeChild(child) as T;
        }
        return child;
      }
      return origRemoveChild.call(this, child) as T;
    };

    const origInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
        }
        return this.appendChild(newNode) as T;
      }
      return origInsertBefore.call(this, newNode, referenceNode) as T;
    };
  } catch (e) {
    // Ignore
  }
}

export default function ClientInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Performance Polyfill for older browsers or test environments
    const perf = window.performance as any;
    if (perf) {
      if (typeof perf.mark !== 'function') perf.mark = () => {};
      if (typeof perf.measure !== 'function') perf.measure = () => {};
      if (typeof perf.clearMarks !== 'function') perf.clearMarks = () => {};
      if (typeof perf.clearMeasures !== 'function') perf.clearMeasures = () => {};
    }
  }, []);

  return null;
}
