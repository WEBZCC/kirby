
import Fiber from "./index";
import dialog from "./dialog"
import dropdown from "./dropdown"
import search from "./search"

export default {
  install(app) {
    app.config.globalProperties.$dialog   = window.panel.$dialog   = dialog;
    app.config.globalProperties.$dropdown = window.panel.$dropdown = dropdown;
    app.config.globalProperties.$go       = window.panel.$go       = (path, options) => Fiber.go(Fiber.url(path), options);
    app.config.globalProperties.$reload   = window.panel.$reload   = (options) => Fiber.reload(options);
    app.config.globalProperties.$request  = window.panel.$request  = (...args) => Fiber.request(...args);
    app.config.globalProperties.$search   = window.panel.$search   = search;
    app.config.globalProperties.$url      = window.panel.$url      = (...args) => Fiber.url(...args);

    // Connect Fiber events to Vuex store loading state
    document.addEventListener("fiber.start", (e) => {
      if (e.detail.silent !== true) {
        window.panel.$store.dispatch("isLoading", true);
      }
    });

    document.addEventListener("fiber.finish", () => {
      if (app.$api.requests.length === 0) {
        window.panel.$store.dispatch("isLoading", false);
      }
    });
  }
};