import { createStore } from "vuex";
import User from "./modules/auth.module";

export default createStore({
  modules: {
    User
  }
});
