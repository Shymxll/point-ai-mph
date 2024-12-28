'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from './scroll-area';

export type ComboboxOptions = {
    value: string;
    label: string;
};


interface ComboboxProps {
    options: ComboboxOptions[];
    selected: string | string[]; // Updated to handle multiple selections
    className?: string;
    placeholder?: string;
    onChange?: (
        value: ComboboxOptions
    ) => void; // Updated to handle multiple selections
    onCreate?: (value: string) => void;
}

export function Combobox({
    options = [],
    selected ,
    className,
    placeholder,
    onChange,
    onCreate,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState<string>('');
    const [value, setValue] = React.useState<string>('');

    // Ensure selected is always an array if mode is 'multiple'
    const selectedItems = Array.isArray(selected) ? selected : [selected];

    return (
        <div className={cn('block', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        key={'combobox-trigger'}
                        type='button'
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between border-primary'
                    >
                        {selectedItems.length === 0 || (selectedItems.length === 1 && selectedItems[0] === '') ? (
                            <span>{placeholder}</span>
                        ) : (
                            <span>{selectedItems.join(', ')}</span>
                        )}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-72 max-w-sm p-0'>

                    <Command
                        filter={(value, search) => {
                            if (value.includes(search)) return 1;
                            return 0;
                        }}
                    // shouldFilter={true}
                    >
                        <CommandInput
                            placeholder={placeholder ?? 'Cari Item...'}
                            value={query}
                            onValueChange={(value: string) => setQuery(value)}
                        />
                        <CommandEmpty
                            onClick={() => {
                                if (onCreate) {
                                    onCreate(query);
                                    setQuery('');
                                }
                            }}
                            className='flex cursor-pointer items-center justify-center gap-1 italic'
                        >
                            <p>Create: </p>
                            <p className='block max-w-48 truncate font-semibold text-primary'>
                                {query}
                            </p>
                        </CommandEmpty>
                        <ScrollArea>
                            <div className='max-h-80'>
                                <CommandGroup>
                                    <CommandList>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue);
                                                    setOpen(false);
                                                    if (onChange) {
                                                        onChange(option);
                                                    }
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === option.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                            </div>
                        </ScrollArea>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default Combobox;