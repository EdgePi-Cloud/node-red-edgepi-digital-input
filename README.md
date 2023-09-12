# node-red-edgepi-digital-input

## EdgePi digital input node that gets the state of a given input channel.

## Install
Install normally through the node-red editor or install with npm in your node-red directory
(typically located  at `~/node.red`) by running the following command:
```
npm install @edgepi-cloud/node-red-edgepi-digital-input
```

### Properties
- **RPC Server**<br> 
The connection to your EdgePi's RPC Server.
- **Channel**<br>
What channel's state you want to check.

### Inputs
Any message can be used to trigger this node.

### Outputs
- **payload** *boolean*<br>
The status of the given channel.


**NOTE:** Currently, EdgePi nodes are only available on x86 systems.



