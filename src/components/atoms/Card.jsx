import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  padding = 'md',
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: ''
  }

  const baseClasses = `bg-white rounded-xl border border-gray-200 shadow-sm ${paddingClasses[padding]} ${className}`

  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2, shadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.2 }}
        className={`${baseClasses} cursor-pointer`}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default Card