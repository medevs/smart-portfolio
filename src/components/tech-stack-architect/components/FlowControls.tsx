import React, { useState } from 'react';
import { Undo2, Redo2, FileDown, Save, Download, Image, CheckCircle, Loader2 } from 'lucide-react';
import { SaveStackDialog } from './SaveStackDialog';

interface FlowControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onShowTemplates: () => void;
  onSaveStack: (name: string) => void;
  onExportJson: () => void;
  onExportImage: () => void;
  onValidateStack: () => void;
  isValidating: boolean;
}

const FlowControls: React.FC<FlowControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onShowTemplates,
  onSaveStack,
  onExportJson,
  onExportImage,
  onValidateStack,
  isValidating,
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-4">
      {/* Left group - History controls */}
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-md ${
            canUndo ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400'
          } text-white transition-colors`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-md ${
            canRedo ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400'
          } text-white transition-colors`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={20} />
        </button>
      </div>

      {/* Center group - Main actions */}
      <div className="flex gap-2">
        <button
          onClick={onValidateStack}
          disabled={isValidating}
          className={`px-4 py-2 ${
            isValidating 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white rounded-md flex items-center gap-2 transition-colors`}
          title="Validate Stack"
        >
          {isValidating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              <span>Validate</span>
            </>
          )}
        </button>
        <button
          onClick={() => setSaveDialogOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
          title="Save Stack"
        >
          <Save size={20} />
          <span>Save</span>
        </button>
      </div>

      {/* Right group - Export actions */}
      <div className="flex gap-2">
        <button
          onClick={onShowTemplates}
          className="p-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          title="Load Template"
        >
          <FileDown size={20} />
        </button>
        <button
          onClick={onExportJson}
          className="p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          title="Export JSON"
        >
          <Download size={20} />
        </button>
        <button
          onClick={onExportImage}
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          title="Export Image"
        >
          <span role="img" aria-label="Export image">
            <Image size={20} aria-hidden="true" />
          </span>
        </button>
      </div>
      <SaveStackDialog 
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={onSaveStack}
      />
    </div>
  );
};

export default FlowControls;
