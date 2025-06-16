import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const QuickActionButton = ({ icon, label, onClick, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary text-white hover:brightness-110',
    secondary: 'bg-secondary text-white hover:brightness-110',
    success: 'bg-success text-white hover:brightness-110',
    warning: 'bg-warning text-white hover:brightness-110',
    error: 'bg-error text-white hover:brightness-110'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-16 h-16 rounded-full shadow-lg flex items-center justify-center
        transition-all duration-200 ${colorClasses[color]}
      `}
    >
      <ApperIcon name={icon} size={24} />
    </motion.button>
  )
}

export default QuickActionButton