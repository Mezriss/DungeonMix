import ArrowSvg from "@/assets/ArrowSvg";
import { Tooltip } from "@base-ui-components/react/tooltip";
import styles from "@/styles/Tooltip.module.css";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right" | "inline-end" | "inline-start";
};

export default function TooltipComponent({
  children,
  text,
  side,
}: TooltipProps) {
  return (
    <Tooltip.Root delay={100}>
      <Tooltip.Trigger aria-label={text} render={<div />}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={10} side={side || "top"}>
          <Tooltip.Popup className={styles.popup}>
            <Tooltip.Arrow className={styles.arrow}>
              <ArrowSvg />
            </Tooltip.Arrow>
            {text}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
