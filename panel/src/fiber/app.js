
import { h, resolveComponent } from "vue";
import Fiber from "./index";

export default {
  name: "Fiber",
  data() {
    return {
      page: window.fiber,
      key: null
    };
  },
  created() {
    Fiber.init({
      page: window.fiber,
      csrf: window.fiber.$system.csrf,
      swap: async ({ page, preserveState }) => {
        this.page = page;
        this.key = preserveState ? this.key : Date.now();
      }
    });
  },
  render() {
    if (this.page.$view.component) {
      const component = resolveComponent(this.page.$view.component);

      if (component) {
        return h(component, this.page.$view.props);
      }
    }
  }
}