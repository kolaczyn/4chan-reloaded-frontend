import * as Tooltip from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tooltipText: string | null;
};

export const QuoteTooltip = ({ tooltipText, children }: Props) => (
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={125}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-amber-50 px-2 py-0.5 rounded-sm bg-opacity-70"
          sideOffset={5}
        >
          {tooltipText}
          <Tooltip.Arrow className="bg-opacity-70 fill-amber-50" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);
