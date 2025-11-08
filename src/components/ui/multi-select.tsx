'use client';

import { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  placeholder?: string;
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
  popularOptions?: string[];
}

export function MultiSelect({
  placeholder,
  selected,
  onChange,
  className,
  popularOptions = [],
}: MultiSelectProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue && !selected.includes(inputValue)) {
      onChange([...selected, inputValue]);
      setInputValue('');
    }
  };

  const handleRemove = (valueToRemove: string) => {
    onChange(selected.filter((value) => value !== valueToRemove));
  };
  
  const handlePopularClick = (option: string) => {
     if (!selected.includes(option)) {
      onChange([...selected, option]);
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" variant="secondary" size="icon" onClick={handleAdd}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      {popularOptions.length > 0 && (
         <div className="space-y-2">
             <p className="text-xs text-muted-foreground">Or click to add popular tags:</p>
            <div className="flex flex-wrap gap-1.5">
            {popularOptions.map((option) => (
                <Button 
                    type='button' 
                    key={option} 
                    variant={selected.includes(option) ? 'default' : 'outline'}
                    size="sm"
                    className='rounded-full text-xs h-7'
                    onClick={() => handlePopularClick(option)}
                >
                    {option}
                </Button>
            ))}
            </div>
         </div>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selected.map((value) => (
            <Badge key={value} variant="secondary" className="text-sm">
              {value}
              <button
                type="button"
                onClick={() => handleRemove(value)}
                className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
