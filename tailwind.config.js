/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fadeIn: { from: { opacity: 0, transform: 'scale(.95)' } },
                fadeOut: { to: { opacity: 0, transform: 'scale(.95)' } },
                borealisBar: {
                    '0%': {
                        left: '0%',
                        right: '100%',
                        width: '0%',
                    },
                    '10%': {
                        left: '0%',
                        right: '65%',
                        width: '55%',
                    },
                    '90%': {
                        right: '0%',
                        left: '35%',
                        width: '105%',
                    },
                    '100%': {
                        left: '100%',
                        right: '0%',
                        width: '0%',
                    },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.1s ease-out',
                fadeOut: 'fadeOut 0.15s ease-out forwards',
                borealisBar: 'borealisBar 1.5s linear infinite',
            },
        },
    },
    plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/line-clamp')],
}
