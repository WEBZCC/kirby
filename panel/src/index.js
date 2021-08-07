import { createApp, h } from 'vue'

import Api from "./config/api.js";
import App from "./fiber/app.js";
import Errors from "./config/errors.js";
import Events from "./config/events.js";
import Fiber from "./fiber/plugin.js";
import Helpers from "./helpers/index.js";
import I18n from "./config/i18n.js";
import Libraries from "./config/libraries.js";
import Plugins from "./config/plugins.js";
import Store from "./store/index.js";

// Global styles
import "./styles/variables.css"
import "./styles/reset.css"
import "./styles/utilities.css"

// Create app instance
const app = createApp({
  created() {
    window.panel.plugins.created.forEach((plugin) => plugin(this));
    this.$store.dispatch("content/init");
  },
  render: () => h(App)
});

// Vue.config.productionTip = false;
// Vue.config.devtools = true;

app.use(Errors);
app.use(Events);
app.use(Helpers);
app.use(Libraries);
app.use(I18n);

import "./config/components.js";

app.use(Api);
app.use(Store);
app.use(Fiber);
app.use(Plugins);

// Actually mount to DOM
window.panel.$vue = window.panel.app = app;
app.mount('#app')
