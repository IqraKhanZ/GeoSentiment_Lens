import React from 'react';
import { ExternalLink } from 'lucide-react';

export function BoltBadge() {
  return (
    <a
      href="https://bolt.new"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
      title="Built with Bolt.new"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
        </div>
        <span>Built with Bolt.new</span>
        <ExternalLink className="h-3 w-3 opacity-75" />
      </div>
    </a>
  );
}