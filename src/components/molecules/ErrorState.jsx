import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  icon = 'AlertCircle',
  title = 'Error'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>
      
      {onRetry && (
        <Button
          variant="primary"
          icon="RefreshCw"
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState