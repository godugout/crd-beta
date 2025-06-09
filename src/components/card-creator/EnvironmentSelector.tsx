
import React from 'react';
import { Button } from '@/components/ui/button';

interface Environment {
  id: string;
  name: string;
  preset: string;
}

interface EnvironmentSelectorProps {
  environments: Environment[];
  selectedEnvironment: Environment;
  onEnvironmentSelect: (environment: Environment) => void;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  environments,
  selectedEnvironment,
  onEnvironmentSelect
}) => {
  return (
    <div>
      <h3 className="text-white font-semibold mb-3">Environments</h3>
      <div className="grid grid-cols-2 gap-2">
        {environments.map((env) => (
          <Button
            key={env.id}
            variant={selectedEnvironment.id === env.id ? "default" : "outline"}
            size="sm"
            onClick={() => onEnvironmentSelect(env)}
            className={`${
              selectedEnvironment.id === env.id
                ? 'bg-blue-600 text-white'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {env.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
