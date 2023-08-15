import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify, ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const c8Theme: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#01010',
        surface: '#e8e8e8',
        primary: '#1FC742',
        'primary-darken-1': '#025b18',
        secondary: '#03DAC6',
        'secondary-darken-1': '#018786',
        error: '#B00020',
        info: '#1fc742',
        success: '#4CAF50',
        warning: '#FB8C00',
    },
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'c8Theme',
        themes: {
            c8Theme
        },
    }
});

createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app');
