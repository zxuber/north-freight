import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import fs from "fs";
import path from "path";

function fixProjectConfig() {
  return {
    name: "fix-project-config",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist/dev/mp-weixin");

      // 修复 project.config.json：新版开发者工具多平台兼容
      const configPath = path.join(dist, "project.config.json");
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          config.projectArchitecture = "multiPlatform";
          config.devPlugin = false;
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        } catch (e) {
          console.warn("Failed to fix project.config.json:", e);
        }
      }

      // 新版开发者工具需要的多平台占位文件
      const miniappJson = {
        miniVersion: "v2", name: "north-freight", version: "0.0.1", versionCode: 100,
        "mini-ohos": { sdkVersion: "0.5.1" },
        "mini-android": {
          resourcePath: "", sdkVersion: "1.6.24", toolkitVersion: "0.11.0",
          icons: { hdpi: "", xhdpi: "", xxhdpi: "", xxxhdpi: "" },
          splashscreen: { hdpi: "", xhdpi: "", xxhdpi: "" },
          enableVConsole: "close"
        },
        "mini-ios": {
          sdkVersion: "1.7.0", toolkitVersion: "0.0.9",
          icons: { mainIcon120: "", mainIcon180: "" },
          enableVConsole: "close"
        }
      };
      fs.writeFileSync(path.join(dist, "project.miniapp.json"), JSON.stringify(miniappJson, null, 2));

      const emptyApp = JSON.stringify({ pages: [], window: {} });
      fs.mkdirSync(path.join(dist, "miniapp/android/nativeResources"), { recursive: true });
      fs.mkdirSync(path.join(dist, "miniapp/ios"), { recursive: true });
      fs.mkdirSync(path.join(dist, "mini-ohos"), { recursive: true });
      fs.writeFileSync(path.join(dist, "miniapp/android/app.json"), emptyApp);
      fs.writeFileSync(path.join(dist, "miniapp/ios/app.json"), emptyApp);
      fs.writeFileSync(path.join(dist, "mini-ohos/app.json"), emptyApp);
    },
  };
}

export default defineConfig({
  plugins: [uni(), fixProjectConfig()],
});
