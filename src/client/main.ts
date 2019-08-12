import { App } from "./core/App";

(async function() {
    const app = new App();
    await app.init();
    app.run();
})();