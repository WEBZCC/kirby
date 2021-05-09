import Api from "@/api/index.js";

export default {
  install(app) {

    const api = Api({
      config: {
        endpoint: window.panel.$urls.api,
        requests: [],
        ping: null,
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
        }
      }
    });

    api.config.onComplete = (requestId) => {
      api.config.requests = api.config.requests.filter(value => {
        return value !== requestId;
      });

      if (api.config.requests.length === 0) {
        window.panel.$store.dispatch("isLoading", false);
      }
    };

    api.config.onStart = (requestId, silent = false) => {
      if (silent === false) {
        window.panel.$store.dispatch("isLoading", true);
      }

      api.config.requests.push(requestId);
    };

    api.config.onSuccess = () => {
      clearInterval(api.config.ping);
      api.config.ping = setInterval(api.auth.user, 5 * 60 * 1000);
    }

    api.config.onSuccess();

    app.config.globalProperties.$api = window.panel.$api = api;

  }
};
