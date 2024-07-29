'use client';

import { type PropsWithChildren, type ButtonHTMLAttributes, forwardRef } from 'react';



export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  block?: boolean;
  text?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const ButtonPrimary = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const {
    children,
    className = '',
    block = false,
    text = '',
    onClick = () => void 0,
    disabled = false,
    ...attrProps
  } = props;

  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <button
      role="button"
      {...attrProps}
      ref={ref}
      disabled={disabled}
      onClick={handleClick}
     
    >
      {children || text}
    </button>
  );
});

ButtonPrimary.displayName = 'Button';

export default ButtonPrimary;
