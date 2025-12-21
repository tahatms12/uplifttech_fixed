import React from 'react';

interface ModuleStepperProps {
  modules: { id: string; title: string }[];
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
          className={`px-3 py-2 rounded border ${
            activeModuleId === module.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'
          } focus-visible:ring-2 focus-visible:ring-indigo-400`}
          onClick={() => onSelect(module.id)}
        >
          {module.title}
        </button>
      ))}
    </div>
  );
};

export default ModuleStepper;
