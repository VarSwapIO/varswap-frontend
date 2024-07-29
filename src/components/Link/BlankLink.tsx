import React, { AnchorHTMLAttributes, forwardRef, PropsWithChildren } from 'react'

export interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  link?: string;
}

const BlankLink = forwardRef<HTMLAnchorElement, PropsWithChildren<Props>>((props, ref) => {
  const {
    children,
    className = '',
    link = '#',
    ...attrProps
  } = props;
  return (
    <a {...attrProps} className={`no-underline dark:text-white text-gray-500 hover:!text-mainColor font-medium  ${className ?? ''}`} ref={ref} href={link} target={'_blank'} rel="noopener noreferrer">
      {children}
    </a>
  );
});
BlankLink.displayName = 'BlankLink';
export default BlankLink