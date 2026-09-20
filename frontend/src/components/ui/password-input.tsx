import { Eye, EyeClosed, Lock } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { Input, type InputProps } from './input'

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'icon' | 'suffix'>>(
  function PasswordInput(props, ref) {
    const [visible, setVisible] = useState(false)
    const Toggle = visible ? Eye : EyeClosed

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        icon={Lock}
        suffix={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            className="cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
          >
            <Toggle size={16} />
          </button>
        }
        {...props}
      />
    )
  },
)
