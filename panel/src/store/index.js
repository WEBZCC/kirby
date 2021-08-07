import { createStore } from "vuex";

// store modules
import blocks from "./modules/blocks.js";
import content from "./modules/content.js";
import drawers from "./modules/drawers.js";
import notification from "./modules/notification.js";

export default {
  install(app) {
    const store = createStore({
      state() {
        return {
          dialog: null,
          drag: null,
          fatal: null,
          isLoading: false
        }
      },
      mutations: {
        SET_DIALOG(state, dialog) {
          state.dialog = dialog;
        },
        SET_DRAG(state, drag) {
          state.drag = drag;
        },
        SET_FATAL(state, html) {
          state.fatal = html;
        },
        START_LOADING(state) {
          state.isLoading = true;
        },
        STOP_LOADING(state) {
          state.isLoading = false;
        }
      },
      actions: {
        dialog(context, dialog) {
          context.commit("SET_DIALOG", dialog);
        },
        drag(context, drag) {
          context.commit("SET_DRAG", drag);
        },
        fatal(context, html) {
          context.commit("SET_FATAL", html);
        },
        isLoading(context, loading) {
          context.commit(loading === true ? "START_LOADING" : "STOP_LOADING");
        }
      },
      modules: {
        blocks: blocks,
        content: content,
        drawers: drawers,
        notification: notification
      }
    });

    window.panel.$store = store;
    app.use(store);
  }
}
