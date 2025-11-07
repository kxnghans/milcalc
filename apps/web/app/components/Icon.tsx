import React from 'react';
import {
  MdRefresh,
  MdDescription,
  MdOutlineWbSunny,
  MdOutlineBedtime,
  MdComputer,
  MdFitnessCenter,
  MdAttachMoney,
  MdDirectionsRun,
} from 'react-icons/md';
import { ICONS } from '@repo/ui/icons';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  [ICONS.RESET]: MdRefresh,
  [ICONS.DOCUMENT]: MdDescription,
  [ICONS.THEME_LIGHT]: MdOutlineWbSunny,
  [ICONS.THEME_DARK]: MdOutlineBedtime,
  [ICONS.THEME_AUTO]: MdComputer,
  [ICONS.WEIGHT_LIFTER]: MdFitnessCenter,
  [ICONS.PAY]: MdAttachMoney,
  [ICONS.RETIREMENT]: MdDirectionsRun,
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} />;
};