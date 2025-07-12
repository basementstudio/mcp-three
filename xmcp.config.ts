import { type XmcpConfig } from "xmcp";

// Custom webpack plugin to add shebang to the output bundle
class ShebangPlugin {
  apply(compiler: any) {
    compiler.hooks.compilation.tap('ShebangPlugin', (compilation: any) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ShebangPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets: any) => {
          const webpack = compiler.webpack;
          const { RawSource, ConcatSource } = webpack.sources;

          for (const [filename, source] of Object.entries(assets)) {
            if (filename.endsWith('.js')) {
              const shebangSource = new RawSource('#!/usr/bin/env node\n');
              const combinedSource = new ConcatSource(shebangSource, source);

              compilation.updateAsset(filename, combinedSource);
            }
          }
        }
      );
    });
  }
}

export default {
  stdio: true,
  webpack: (config) => {
    // Add the shebang plugin to automatically add #!/usr/bin/env node to the output
    config.plugins = config.plugins || [];
    config.plugins.push(new ShebangPlugin());

    return config;
  }
} satisfies XmcpConfig;
