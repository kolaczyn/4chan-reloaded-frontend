import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  url: string;
  children: ReactNode;
};

export const ImagePreview = ({ url, children }: Props) => (
  <Tooltip.Provider>
    <Tooltip.Root delayDuration={125}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content sideOffset={5}>
          <img className="w-96 rounded-lg shadow-xl" src={url} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);
