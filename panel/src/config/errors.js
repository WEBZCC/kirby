export default {
  install(app) {
    app.config.errorHandler = error => {
      if (window.panel.$config.debug) {
        window.console.error(error);
      }

      window.panel.$store.dispatch("notification/error", {
        message: error.message || "An error occurred. Please reload the Panel."
      });
    };

    window.panel = window.panel || {};
    window.panel.error = (notification, msg) => {
      if (window.panel.$config.debug) {
        window.console.error(notification + ": " + msg);
      }

      window.panel.$store.dispatch(
        "error",
        notification + ". See the console for more information."
      );
    };

    window.panel.deprecated = (msg) => {
      console.warn("Deprecated: " + msg);
    }
  }
}