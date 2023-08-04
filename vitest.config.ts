import * as path from "path";
import * as VitestConfig from "vitest/config";

export default VitestConfig.defineConfig({
  test: {
    globalSetup: "./app/test-env.ts",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});
