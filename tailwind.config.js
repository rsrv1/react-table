/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fadeIn: { from: { opacity: 0, transform: 'scale(.95)' } },
                fadeOut: { to: { opacity: 0, transform: 'scale(.95)' } },
            },
            animation: {
                fadeIn: 'fadeIn 0.1s ease-out',
                fadeOut: 'fadeOut 0.15s ease-out forwards',
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
}
