import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton, useColorMode } from '@chakra-ui/react';
import React from 'react';

function DarkModeIconButton({
  ...rest
}: React.ComponentPropsWithoutRef<typeof IconButton>) {
  const { colorMode, toggleColorMode } = useColorMode();

  const isDark = colorMode === 'dark';

  const { 'aria-label': ariaLabel, ...otherProps } = rest;

  return (
    <IconButton
      onClick={toggleColorMode}
      icon={isDark ? <MoonIcon /> : <SunIcon />}
      aria-label={ariaLabel}
      {...otherProps}
    />
  );
}

export default DarkModeIconButton;
