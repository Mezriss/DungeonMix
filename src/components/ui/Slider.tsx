import { Slider as SliderComponent } from "@base-ui-components/react/slider";

import styles from "@/styles/Slider.module.css";

type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
};

export default function Slider({ value, min, max, onChange, onCommit }: Props) {
  return (
    <SliderComponent.Root
      value={value}
      min={min}
      max={max}
      onValueChange={onChange}
      onValueCommitted={onCommit}
    >
      <SliderComponent.Control className={styles.control}>
        <SliderComponent.Track className={styles.track}>
          <SliderComponent.Indicator className={styles.indicator} />
          <SliderComponent.Thumb className={styles.thumb} />
        </SliderComponent.Track>
      </SliderComponent.Control>
    </SliderComponent.Root>
  );
}
