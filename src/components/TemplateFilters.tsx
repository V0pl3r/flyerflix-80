
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type EventType = 'all' | 'baile-funk' | 'sertanejo' | 'aniversario' | 'eletronica' | 'pagode' | 'outros';

export interface TemplateFiltersProps {
  onFilterChange: (filters: { eventType: EventType }) => void;
  selectedEventType: EventType;
}

export const eventTypeLabels: Record<EventType, string> = {
  'all': 'Todos os eventos',
  'baile-funk': 'Baile Funk',
  'sertanejo': 'Sertanejo',
  'aniversario': 'Aniversário',
  'eletronica': 'Eletrônica',
  'pagode': 'Pagode',
  'outros': 'Outros eventos'
};

const TemplateFilters = ({ onFilterChange, selectedEventType }: TemplateFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectEventType = (eventType: EventType) => {
    onFilterChange({ eventType });
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-4 px-4 md:px-8 lg:px-12 xl:px-16 border-b border-white/10">
      <div className="flex items-center gap-2">
        {/* Filter button with dropdown */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-white/20 hover:bg-white/10 text-white"
            >
              <Filter size={16} />
              <span>Filtrar por Evento</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#1e1e1e] border-white/10 text-white p-0 w-56">
            <div className="grid gap-1">
              {Object.entries(eventTypeLabels).map(([value, label]) => (
                <Button
                  key={value}
                  variant="ghost"
                  className={`justify-start px-3 py-2 w-full ${
                    selectedEventType === value 
                      ? 'bg-white/10 text-flyerflix-red' 
                      : 'text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleSelectEventType(value as EventType)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Active filter chip */}
        {selectedEventType !== 'all' && (
          <div className="bg-white/10 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
            {eventTypeLabels[selectedEventType]}
            <button 
              onClick={() => handleSelectEventType('all')} 
              className="ml-1 text-white/70 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateFilters;
