import nanoexpress from "nanoexpress";

let app = require("./server").default;

if (module.hot) {
  module.hot.accept("./server", function() {
    console.log("🔁  HMR Reloading `./server`...");
    try {
      app = require("./server").default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info("✅  Server-side HMR Enabled!");
}

const port = process.env.PORT || 3000;

app.listen(port, function(err) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`> Started on port ${port}`);
});

export default app;
