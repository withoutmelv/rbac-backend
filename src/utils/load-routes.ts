
import fs from 'fs';
import path from 'path';
import Koa from 'koa';

export function loadRoutes(app: Koa, baseDir: string): void {
  const modulesDir = path.join(baseDir, 'modules');

  try {
    // 读取 modules 目录下的所有子目录（即各个模块）
    const moduleNames = fs.readdirSync(modulesDir)
      .filter((name) => fs.statSync(path.join(modulesDir, name)).isDirectory());

    moduleNames.forEach((moduleName) => {
      const routesDir = path.join(modulesDir, moduleName, 'routes');

      if (fs.existsSync(routesDir)) {
        // 读取每个模块下的 routes 目录中的所有文件
        const routeFiles = fs.readdirSync(routesDir);

        routeFiles.forEach((file) => {
          if (file.endsWith('.ts') || file.endsWith('.js')) {
            const routePath = path.join(routesDir, file);
            let routeModule;

            try {
              routeModule = require(routePath).default || require(routePath);
              app.use(routeModule.routes()).use(routeModule.allowedMethods());
              console.log(`Loaded route: ${routePath}`);
            } catch (error) {
              console.error(`Failed to load route: ${routePath}`, error);
            }
          }
        });
      } else {
        console.warn(`No routes directory found for module: ${moduleName}`);
      }
    });
  } catch (error) {
    console.error('Error loading routes:', error);
  }
}