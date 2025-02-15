"use client"

import React, { useState } from 'react';
import { Undo2, Redo2, CheckCircle, Keyboard } from 'lucide-react';
import ShortcutsHelp from './ShortcutsHelp';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onValidate: () => void;
}

const Toolbar = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onValidate,
}: ToolbarProps) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 z-10">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1.5 rounded-md ${
            canUndo
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1.5 rounded-md ${
            canRedo
              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        <button
          onClick={onValidate}
          className="p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Validate Stack"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowShortcuts(true)}
          className="p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>
      <ShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
};

export default Toolbar;
