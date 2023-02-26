module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '1900px',
            },
            fontFamily: {
                vimland: ['Vimland', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                'tinted-white': '#FAFBED',
                'gray-1': '#696969',
                'gray-2': '#797979',
                'dark-gray': '#1E1E1E',
                'dull-gray': '#282828',
                valid: '#10CB2E',
                invalid: '#C22929',
                pending: '#FF6B00',
            },
            animation: {
                'reverse-spin': 'reverse-spin 1s linear infinite',
            },
            keyframes: {
                'reverse-spin': {
                    from: {
                        transform: 'rotate(360deg)',
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar-hide'),
        function ({ addVariant }) {
            addVariant('child', '& > *')
        },
    ],
}
