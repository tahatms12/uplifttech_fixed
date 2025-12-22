import React from 'react';

interface ModuleItem {
  id: string;
  title: string;
  locked?: boolean;
  lockedReason?: string;
}

interface ModuleStepperProps {
  modules: ModuleItem[];
  activeModuleId: string;
  onSelect: (moduleId: string) => void;
}

const ModuleStepper: React.FC<ModuleStepperProps> = ({ modules, activeModuleId, onSelect }) => {
  return (
    <div role="tablist" aria-label="Course modules" className="flex flex-wrap gap-2 mb-4">
      {modules.map((module) => (
        <button
          key={module.id}
          role="tab"
          aria-selected={activeModuleId === module.id}
          aria-controls={`module-panel-${module.id}`}
          className={`px-3 py-2 rounded border text-sm focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            activeModuleId === module.id ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-800 text-gray-200 border-gray-700'
          } ${module.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
          title={module.locked ? module.lockedReason : undefined}
          onClick={() => {
            if (module.locked) return;
            onSelect(module.id);
          }}
          disabled={module.locked}
        >
          {module.title} {module.locked ? '• Locked' : ''}
        </button>
      ))}
    </div>
  );
};

export default ModuleStepper;
