import React, { useMemo, useState } from 'react';
import type { Role } from '../../data/training/trainingCatalog';

interface RoleSelectorProps {
  roles: Role[];
  value: string;
  onChange: (roleId: string) => void;
  label?: string;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ roles, value, onChange, label }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return roles;
    return roles.filter((role) => role.name.toLowerCase().includes(normalized));
  }, [roles, query]);

  const selectedRole = roles.find((role) => role.id === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-200">{label ?? 'Role selection'}</label>
      <div className="relative">
        <button
          type="button"
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-left text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedRole ? selectedRole.name : 'Select your role'}
        </button>
        {open ? (
          <div className="absolute z-10 mt-2 w-full rounded bg-gray-900 border border-gray-700 shadow-lg">
            <div className="p-2">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search roles"
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label="Search roles"
              />
            </div>
            <ul role="listbox" className="max-h-48 overflow-y-auto">
              {filtered.map((role) => (
                <li key={role.id} role="option" aria-selected={role.id === value}>
                  <button
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      role.id === value ? 'bg-gray-800 text-white' : 'text-gray-200'
                    }`}
                    onClick={() => {
                      onChange(role.id);
                      setOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-gray-400">{role.description}</div>
                  </button>
                </li>
              ))}
              {!filtered.length ? (
                <li className="px-3 py-2 text-sm text-gray-400">No roles match your search.</li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoleSelector;
