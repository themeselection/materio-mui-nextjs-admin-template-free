const config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
    corePlugins: {
        preflight: false
    },
    important: '#__next',
    plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
    theme: {
        extend: {}
    }
};
export default config;
