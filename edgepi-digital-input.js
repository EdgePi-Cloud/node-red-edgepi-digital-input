module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DigitalInputNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    let dinPin = config.dinPin;

    initializeNode(config).then((din) => {
      node.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input recieved" });
        try {
          dinPin = msg.payload ?? dinPin;
          msg = { payload: await din.digitalInputState(dinPin - 1) };
        } catch (error) {
          msg = { payload: error };
          console.error(error);
        }
        send(msg);
        done?.();
      });
    });

    function initializeNode(config) {
      const transport =
        config.transport === "Network"
          ? `tcp://${config.tcpAddress}:${config.tcpPort}`
          : "ipc:///tmp/edgepi.pipe";

      try {
        const din = new rpc.DinService(transport);
        console.info("Digital Input node initialized on:", transport);
        node.status({ fill: "green", shape: "ring", text: "d-in initialized" });
        return din;
      } catch (error) {
        console.error(error);
        node.status({
          fill: "red",
          shape: "ring",
          text: "Initialization error",
        });
      }
    }
  }

  RED.nodes.registerType("digital-in", DigitalInputNode);
};
