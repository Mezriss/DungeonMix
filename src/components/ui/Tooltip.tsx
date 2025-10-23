import { Tooltip as TooltipComponent } from "@base-ui-components/react/tooltip";
import ArrowSvg from "@/assets/ArrowSvg";

import styles from "@/styles/Tooltip.module.css";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right" | "inline-end" | "inline-start";
};

export default function Tooltip({ children, text, side }: TooltipProps) {
  return (
    <TooltipComponent.Root delay={100}>
      <TooltipComponent.Trigger aria-label={text} render={<div />}>
        {children}
      </TooltipComponent.Trigger>
      <TooltipComponent.Portal>
        <TooltipComponent.Positioner sideOffset={10} side={side || "top"}>
          <TooltipComponent.Popup className={styles.popup}>
            <TooltipComponent.Arrow className={styles.arrow}>
              <ArrowSvg />
            </TooltipComponent.Arrow>
            {text}
          </TooltipComponent.Popup>
        </TooltipComponent.Positioner>
      </TooltipComponent.Portal>
    </TooltipComponent.Root>
  );
}
