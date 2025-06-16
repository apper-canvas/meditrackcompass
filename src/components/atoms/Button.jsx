import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:brightness-110 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:brightness-110 focus:ring-secondary',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-error text-white hover:brightness-110 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  const content = (
    <>
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && <ApperIcon name={icon} className="w-4 h-4 mr-2" />}
      {children}
      {!loading && icon && iconPosition === 'right' && <ApperIcon name={icon} className="w-4 h-4 ml-2" />}
    </>
  )

  if (disabled || loading) {
    return (
      <button className={buttonClasses} disabled {...props}>
        {content}
      </button>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      {...props}
    >
      {content}
    </motion.button>
  )
}

export default Button