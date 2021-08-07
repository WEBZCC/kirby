import Api from "@/api/index.js";

export default {
  install(app) {

    app.config.globalProperties.$api = window.panel.$api = Api({
      config: {
        endpoint: window.panel.$urls.api,
        onComplete: (requestId) => {
          window.panel.$api.requests = window.panel.$api.requests.filter(value => {
            return value !== requestId;
          });

          if (app.$api.requests.length === 0) {
            window.panel.$store.dispatch("isLoading", false);
          }
        },
        onError: error => {
          if (window.panel.$config.debug) {
            window.console.error(error);
          }

          // handle requests that return no auth
          if (
            error.code === 403 &&
            (error.message === "Unauthenticated" || error.key === "access.panel")
          ) {
            window.panel.$go("/logout");
          }
        },
        onParserError: (result) => {
          window.panel.$store.dispatch("fatal", result);
          throw new Error("The JSON response from the API could not be parsed");
        },
        onPrepare: (options) => {
          // if language set, add to headers
          if (window.panel.$language) {
            options.headers["x-language"] = window.panel.$language.code;
          }

          // add the csrf token to every request
          options.headers["x-csrf"] = window.panel.$system.csrf;

          return options;
        },
        onStart: (requestId, silent = false) => {
          if (silent === false) {
            window.panel.$store.dispatch("isLoading", true);
          }

          window.panel.$api.requests.push(requestId);
        },
        onSuccess: () => {
          clearInterval(app.$api.ping);
          window.panel.$api.ping = setInterval(window.panel.$api.auth.user, 5 * 60 * 1000);
        }
      },
      ping: null,
      requests: []
    });

    window.panel.$api.ping = setInterval(window.panel.$api.auth.user, 5 * 60 * 1000);
  }
};
