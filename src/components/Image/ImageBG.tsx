import { useMantineColorScheme } from '@mantine/core';
import Image, { ImageProps } from 'next/image';
import React, { useEffect } from 'react'

const ImageBG = ({ alt, ...props }: ImageProps) => {
  const { colorScheme } = useMantineColorScheme();
  const image_error = colorScheme === 'dark' ? '' : ''
  const image_blur = colorScheme === 'dark' ? '' : ''
  const [src, setSrc] = React.useState(props?.src || '/images/features/image-placeholder.png');

  useEffect(() => {
    if (props?.src !== src) {
      setSrc(props?.src)
    }
  }, [props?.src])

  return (
    <Image
      {...props}
      src={src}
      alt={alt} // To fix lint warning
      onError={() => setSrc('/images/features/image-placeholder.png')}
      blurDataURL="/images/features/image-placeholder.png"
    />
  );
}

export default ImageBG