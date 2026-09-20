import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { controlClassName, Field } from './field'

export interface SelectOption {
  value: string
  label: ReactNode
  textValue?: string
}

export interface SelectProps {
  label?: string
  helper?: string
  error?: string
  placeholder?: string
  icon?: LucideIcon
  options: SelectOption[]
  value: string | undefined
  onValueChange: (value: string) => void
  disabled?: boolean
  name?: string
  containerClassName?: string
}

export function Select({
  label,
  helper,
  error,
  placeholder = 'Selecione',
  icon: Icon,
  options,
  value,
  onValueChange,
  disabled,
  name,
  containerClassName,
}: SelectProps) {
  const id = useId()

  return (
    <Field label={label} htmlFor={id} helper={helper} error={error} className={containerClassName}>
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled} name={name}>
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            controlClassName,
            'cursor-pointer leading-[18px] outline-none data-placeholder:text-gray-400',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
          )}
        >
          {Icon && <Icon size={16} className="shrink-0 text-gray-500" />}
          <span className="flex min-w-0 flex-1 items-center gap-2 truncate text-left">
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown size={16} className="shrink-0 text-gray-500" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-50 max-h-72 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            )}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  textValue={option.textValue}
                  className={cn(
                    'relative flex cursor-pointer items-center gap-2 rounded-md py-2 pr-9 pl-3 text-sm text-gray-800 outline-none select-none',
                    'data-highlighted:bg-gray-100 data-[state=checked]:font-medium',
                  )}
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-3 text-brand-base">
                    <Check size={16} />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </Field>
  )
}
