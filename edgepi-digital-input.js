module.exports = function (RED) {
    const rpc = require('@edgepi-cloud/edgepi-rpc')
  
    function DigitalInputNode(config) {
      // Create new node instance with user config
      RED.nodes.createNode(this, config);
      const node = this;
      const ipc_transport = "ipc:///tmp/edgepi.pipe"
      const tcp_transport = `tcp://${config.tcpAddress}:${config.tcpPort}`
      const transport = (config.transport === "Network") ? tcp_transport : ipc_transport;  
      node.DinPin = config.DinPin;
    
      // init new din instance
      const din = new rpc.DinService(transport)
  
      if (din){
        console.info("Digital Input node initialized on:", transport);
        node.status({fill:"green", shape:"ring", text:"d-in initialized"});
      }
  
      // Input event listener
      node.on('input', async function(msg,send,done){
        node.status({fill:"green", shape:"dot", text:"input recieved"});
        try{
          const response = await din.digital_input_state(rpc.DINPins[node.DinPin])
          msg.payload = response;
        }
        catch(error){
          msg.payload = error;
          console.error(error)
        }
        
        send(msg)
        
        if (done) {
          done();
        }
      });
  
      node.on('close', (done) => {
        node.status({ fill: 'grey', shape: 'ring', text: 'digital input node terminated' });
        done();
      });
    }
    
    RED.nodes.registerType('edgepi-digital-input-node', DigitalInputNode);
    
  };