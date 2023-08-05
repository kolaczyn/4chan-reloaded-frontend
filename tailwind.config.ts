import type { Config } from "tailwindcss";
import aspectRatioPlugin from "@tailwindcss/aspect-ratio";

export default {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [aspectRatioPlugin],
} satisfies Config;
