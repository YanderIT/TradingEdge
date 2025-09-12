"use client";

// Import only the specific Remix icons that are actually used in the application
import {
  RiAddLine,
  RiArticleLine,
  RiBankCardLine,
  RiBookLine,
  RiCheckLine,
  RiFileCopy2Line,
  RiDashboardLine,
  RiDiscordFill,
  RiEditLine,
  RiEmotionSadFill,
  RiEyeLine,
  RiFolderLine,
  RiGithubFill,
  RiHomeLine,
  RiKey2Line,
  RiKeyLine,
  RiLineChartLine,
  RiMessage2Line,
  RiMoneyCnyCircleFill,
  RiMoneyDollarBoxLine,
  RiOrderPlayLine,
  RiRefreshLine,
  RiUserLine,
} from "react-icons/ri";

import { ReactNode } from "react";

// Map of icon names to actual icon components
const iconMap: { [key: string]: React.ElementType } = {
  RiAddLine,
  RiArticleLine,
  RiBankCardLine,
  RiBookLine,
  RiCheckLine,
  RiFileCopy2Line,
  RiDashboardLine,
  RiDiscordFill,
  RiEditLine,
  RiEmotionSadFill,
  RiEyeLine,
  RiFolderLine,
  RiGithubFill,
  RiHomeLine,
  RiKey2Line,
  RiKeyLine,
  RiLineChartLine,
  RiMessage2Line,
  RiMoneyCnyCircleFill,
  RiMoneyDollarBoxLine,
  RiOrderPlayLine,
  RiRefreshLine,
  RiUserLine,
};

export default function Icon({
  name,
  className,
  onClick,
}: {
  name: string;
  className?: string;
  onClick?: () => void;
}) {
  // Get the icon component directly from the icon map
  const IconComponent = iconMap[name];

  // Return null if no icon is found
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    return null;
  }

  // Render the icon component
  return (
    <IconComponent
      className={`${className} cursor-pointer`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    />
  );
}
