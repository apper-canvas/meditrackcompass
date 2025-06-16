import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  icon = 'Package'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
      >
        <ApperIcon name={icon} size={32} className="text-gray-400" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      
      {onAction && (
        <Button
          variant="primary"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState