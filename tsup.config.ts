import { defineConfig } from 'tsup';


export default defineConfig({
    entry: [
        'src/index.ts',
        '!src/test/*.ts'
    ],
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    format: ['cjs', 'esm', 'iife'],
    globalName: 'pipejs',
    bundle: true,
    treeshake: true,
    shims: true,
    skipNodeModulesBundle: true,
    target: "es2020",
    outDir: "dist",
    minify: 'terser', // Tell tsup to use Terser
    terserOptions: {
        compress: {
            defaults: true,
            inline: 3,
            passes: 2,
        },
        mangle: true,
    },
})