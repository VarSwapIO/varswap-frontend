import { Skeleton } from '@mantine/core'
import React from 'react'

const SkeletonBG = ({ width = '50%', height = 28, circle, radius, className }: { className?: string, height: string | number, width?: string | number, circle?: boolean, radius?: string | number }) => {
  return (
    <Skeleton
      style={{ '--mantine-color-body': 'transparent', '--mantine-color-dark-4': '#1E293B' }}
      height={height}
      width={width}
      circle={circle}
      radius={radius}
      className={className}
    />
  )
}

export default SkeletonBG