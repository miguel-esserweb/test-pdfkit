/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ['pdfkit', ...(config.externals || [])];
    }

    config.resolve.alias['pdfkit'] = path.resolve(__dirname, 'node_modules/pdfkit/js/data');

    config.module.rules.push({
      test: /\.(ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/fonts/',
          publicPath: '/_next/static/fonts/',
        },
      },
    });

    return config;
  },
};

export default nextConfig;