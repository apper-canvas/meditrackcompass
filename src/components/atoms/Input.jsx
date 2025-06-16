import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  error,
  icon,
  placeholder,
  value,
  onChange,
  className = '',
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const hasValue = value && value.toString().length > 0
  const shouldFloat = focused || hasValue

  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 
    ${error ? 'border-error focus:border-error' : 'border-gray-300 focus:border-primary'}
    focus:outline-none bg-white
    ${icon ? 'pl-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
  `

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${shouldFloat 
              ? 'top-2 text-xs text-primary bg-white px-1 -ml-1' 
              : 'top-3 text-base text-gray-500'
            }
            ${icon && !shouldFloat ? 'left-12' : ''}
          `}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Icon */}
      {icon && (
        <div className="absolute left-4 top-3 text-gray-400">
          <ApperIcon name={icon} size={20} />
        </div>
      )}

      {/* Input */}
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        className={inputClasses}
        {...props}
      />

      {/* Password Toggle */}
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3 text-gray-400 hover:text-primary"
        >
          <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input