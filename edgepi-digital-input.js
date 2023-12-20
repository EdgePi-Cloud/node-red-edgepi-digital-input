module.exports = function (RED) {
  const rpc = require("@edgepi-cloud/edgepi-rpc");

  function DigitalInputNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    setInitialConfigs(config).then((din) => {
      node.on("input", async function (msg, send, done) {
        node.status({ fill: "green", shape: "dot", text: "input recieved" });
        try {
          msg.payload = await din.digitalInputState(rpc.DINPins[msg.payload]);
        } catch (error) {
          msg.payload = error;
          console.error(error);
        }
        send(msg);
        if (done) {
          done();
        }
      });
    });

    async function setInitialConfigs(config) {
      const ipc_transport = "ipc:///tmp/edgepi.pipe";
      const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`;
      const transport =
        config.transport === "Network" ? tcp_transport : ipc_transport;
      node.DinPin = config.DinPin;

      try {
        const din = new rpc.DinService(transport);
        console.info("Digital Input node initialized on:", transport);
        node.status({ fill: "green", shape: "ring", text: "d-in initialized" });
        await din.digitalInputState(rpc.DINPins[config.DinPin]);
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
