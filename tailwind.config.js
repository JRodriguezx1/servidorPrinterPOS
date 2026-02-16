/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.html"], //busca en la raiz del proyecto la carpeta view y en todas las carpetas adentro los archivos de extension .html y .php
  theme: {
    extend: {
      screens: {
        'xsp': '530px',
        'xxs': '480px',
        'xs': '540px',
        'tlg': '992px', // Breakpoint personalizado de 992px
        'xlg': '1024px',
        '2xlg': '1280px',
        'between1200and1600': { 'raw': '(min-width: 1200px) and (max-width: 1600px)' },
      },
    },
  },
  plugins: [],
}

