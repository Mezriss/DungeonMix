import ArrowSvg from "@/assets/ArrowSvg";
import { Tooltip } from "@base-ui-components/react/tooltip";
import styles from "@/styles/Tooltip.module.css";

type TooltipProps = {
  children: React.ReactNode;
  text: string;
};

export default function TooltipComponent({ children, text }: TooltipProps) {
  return (
    <Tooltip.Root delay={100}>
      <Tooltip.Trigger aria-label={text} render={<div />}>
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={10}>
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
