import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals.push({
			'@prisma/client': 'commonjs @prisma/client',
			'pg': 'commonjs pg',
			'pg-native': 'commonjs pg-native',
		});
		return config;
	},
	serverExternalPackages: ['@prisma/client', 'pg'],
};

export default nextConfig;
