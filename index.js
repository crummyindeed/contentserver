const path = require('path');
const fs = require("fs");
const readline = require('readline');
const publicIp = require('public-ip');

const CrummyContent = require('crummycontent');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var private_key, Content, port, config;

async function Main(){
    Content.startServer(port,async function(){
        console.log('Content Server running at ', await publicIp.v4() + ':' + port);
        if(typeof config.neighbors != 'undefined'){
            for (let i in config.neighbors) {
                let neighbor = config.neighbors[i];
                Content.connectTo(neighbor.address, neighbor.port, function () {
                    console.log("connected to:", neighbor.name);
                });
            }
        }
    })
}

rl.question('Please enter a 64 hex character private key for the Server: ', (a1) => {
    private_key = a1;
  
    rl.question("Please enter the dir that should be used for persistant storage: ", (a2) => {
      ledger_dir = path.join(a2, 'ledger');
      storage_dir = path.join(a2, 'storage');
  
      if (!fs.existsSync(ledger_dir)) {
        fs.mkdirSync(ledger_dir);
      }

      if (!fs.existsSync(storage_dir)) {
        fs.mkdirSync(storage_dir);
      }
  
      Content = new CrummyContent({
        ledger_dir: ledger_dir,
        storage_dir: storage_dir,
        private_key: private_key,
        seed_settings: {
            all: true
        }
      });
  
      rl.question("Please enter the port to listen to connections on: ", function (a3) {
        port = a3;

        rl.question("Please enter the config file path: ", function (a5) {
            config = JSON.parse(fs.readFileSync(a5));
            Main();
            rl.close();
        });
  
      });
  
    });
  
  });