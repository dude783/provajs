const Web3 = require('web3');           //for web3 calls

const Tx = require('ethereumjs-tx'); 
   //for Tx calls
   //const EthereumTx = require('ethereumjs-tx').Transaction
 //this will directly communicate with ropsten
 // Previous video check how to get this api " Vr1GWcLG0XzcdrZHWMPu "
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

const account = '0x281496E782683732dceF61ccE8195BfaB0525342'; // account address

// private key
const privateKey = Buffer.from('4696602a775573c026e9d34d12b61627f75332323261d871ec9ac57feaeab6db', 'hex');
const contractAddress = '0x8078cf8c12c9Be001e364145D065586C39c0960A'; // Deployed manually
var abi ;
$.getJSON("test.json", function(json) {
  console.log(json); // this will show the info it in firebug console
  abi=json;
});
// interface for contract
const contract = new web3.eth.Contract(abi, contractAddress, {
  from: account,
  gasLimit: 3000000,
});


const contractFunction = contract.methods.setGuanyador(account, idAposta); // contract params

const functionAbi = contractFunction.encodeABI(); // this will generate contract function abi code

console.log("Getting gas estimate");

// this is gas estimation part, it will said you transaction gasAmmount
contractFunction.estimateGas({from: account}).then((gasAmount) => {
  estimatedGas = gasAmount.toString(16);

  console.log("Estimated gas: " + estimatedGas);

  web3.eth.getTransactionCount(account).then(_nonce => { //this will generate Nonce
    nonce = _nonce.toString(16);

    console.log("Nonce: " + nonce);
    const txParams = {
      gasPrice: estimatedGas,
      gasLimit: 3000000,
      to: contractAddress,
      data: functionAbi,
      from: account,
      nonce: '0x' + nonce
    };

    const tx = new Tx(txParams);
    tx.sign(privateKey);          // here Tx sign with private key

    const serializedTx = tx.serialize();
        //simple contract call
  //  contract.methods.get().call().then(v => console.log("Value before increment: " + v)); 
    // here performing singedTransaction 
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {
      console.log(receipt);
     })
  });
});

