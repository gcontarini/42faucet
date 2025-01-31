import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'bootswatch/dist/minty/bootstrap.min.css'
import './App.css';
import Faucet from './artifacts/contracts/Faucet.sol/Faucet.json'
import Token from './artifacts/contracts/myERC20.sol/myERC20.json'
import NavBar from './components/NavBar';
import Balance from './components/Balance';
import Transfer from './components/Transfer';
import Footer from './components/Footer';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
  
  const [account, setAccount] = useState('')
  const [connected, setConnection] = useState(false)
  const [newAddress, setNewAddress] = useState('')
  const [contractBalance, setContractBalance] = useState('')
  const [tokenBalance, setTokenBalance] = useState('')
  

  const requestAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any"); 
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAccount = await signer.getAddress()
    const initial = signerAccount.substring(0, 4)
    const final = signerAccount.substring(39)
    setAccount(`${initial}...${final}`)
    setConnection(true)
    console.log("Account:", signerAccount);

  }

  const handleTransfer = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Faucet.abi, signer)
      try {
        await contract.transfer(newAddress)
        setNewAddress('')
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchTokenBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      try {
        console.log(contract);
        const data = await contract.totalAvailable()
        const balance = data._hex
        const convertedBalance = parseInt(balance, 16)
        convertedBalance.toString()
        setTokenBalance(convertedBalance)
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, Faucet.abi, provider)
      try {
        console.log(contract);
        const data = await contract.getbalance()
        const balance = data._hex
        const convertedBalance = parseInt(balance, 16)
        const ethBalance = convertedBalance/1000000000000000000
        ethBalance.toString()
        setContractBalance(ethBalance)
      } catch (error) {
        console.log(error);
      }
    }
  }

useEffect(() => {
  fetchBalance()
  fetchTokenBalance()
}, [])

  return (
    <div className="App">
        <NavBar connected={connected} onClick={requestAccount} address={account}/>
        <Balance balance={contractBalance} tokenBalance={tokenBalance}/>
        <Transfer connected={connected} onClick={handleTransfer} newAddress={newAddress} setNewAddress={setNewAddress} address={contractAddress} tokenAddress={tokenAddress}/>
        <Footer />
    </div>
  );
}

export default App;
