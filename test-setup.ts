export default async () => {
  // // Set reference to mongod in order to close the server during teardown.
  // globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  // if (globalThis.IS_REACT_ACT_ENVIRONMENT) {
  //   console.log("act environment set");
  // }
  Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
    get() {
      if (typeof globalThis.self !== "undefined") {
        return globalThis.self["IS_REACT_ACT_ENVIRONMENT"];
      }
    },
    set(value) {
      if (typeof globalThis.self !== "undefined") {
        globalThis.self["IS_REACT_ACT_ENVIRONMENT"] = value;
      }
    },
  });

  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  console.log("test set up complete");
};
