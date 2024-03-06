import logo from './logoq.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Countdown from 'react-countdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Blockies from 'react-blockies';
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, BN, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from './idl.json';
import { Alert } from 'react-bootstrap';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Buffer } from 'buffer';
import { v4 } from 'uuid'
window.Buffer = Buffer;
require('@solana/wallet-adapter-react-ui/styles.css');


const wallets = [ new PhantomWalletAdapter() ]
const { SystemProgram, Keypair } = web3;
const opts = {
  preflightCommitment: "processed"
}
var renew = false;
var mytime;
const programID = new PublicKey("9abegPWEJVgaJ5kmNiDCfh93iMCovugQY4ToznvXDkWV");
const CLOCK_PROGRAM_ID = new PublicKey('SysvarC1ock11111111111111111111111111111111');
function App() {
  const wallet = useWallet()
  const [walletKey, setWalletKey] = useState(null);
  const [buttonText, setButtonText] = useState('Subscribe');
  const [functionCompleted, setFunctionCompleted] = useState(false);



  const qetProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };

  const connectWallet = async () => {
    const provider = qetProvider();
    if (provider) {
      try {
        const response = await provider.connect();
        const pubKey = await provider.publicKey;
        console.log("userspubkey", response.publicKey.toString());
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        console.log("here failll");
      }
    }
  };

  useEffect(() => connectWallet, []);


  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );


    return provider;
  }


  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>Time's up!</span>;
    } else {
      // Render a countdown
      return (
        <span id="mycontttasd">
          {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
        </span>
      );
    }
  };



   
  async function subnow() {
        const provider = await getProvider();
        /* create the program interface combining the idl, program ID, and provider */
        const program = new Program(idl, programID, provider);
        const pubKey = await provider.publicKey;
        
        var [myacc] = await web3.PublicKey.findProgramAddressSync([Buffer.from("solsub"), provider.wallet.publicKey.toBuffer()], programID);
        console.log("myaccjj" + myacc);

    

        try {
          /* interact with the program via rpc */
          var j = await program.account.subdetalis.fetch(myacc);
          //var v2 = await program.account.subdetalis.all();
         
          
          mytime = parseInt(j.subtime*1000);

          console.log("i will update - >   " + mytime);


          setFunctionCompleted(true);
          setButtonText('Renew');
          renew = true;
          if(j.subtime*1000 + 1000000000 < Date.now()) {
            renew = false;
          console.log("come here xx!");
            setButtonText('Renew');
            try {
              const program = new Program(idl, programID, provider);
              const cprice = new BN(1000000000);
              console.log("initalization progreess has been started.");
   
              const tx = await program.rpc.renew(cprice, {
                accounts: {
                 buyer: myacc,
                  receiver: new PublicKey('HdwzqmZbNVanLU56sKmgwdWjgZReHf9ESuD7GfGUkErc'),
                  user: provider.wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                  clock: new PublicKey('SysvarC1ock11111111111111111111111111111111'),
                },
              });

               console.log("txx", tx);
               let mylink = "https://solana.fm/tx/"+tx; 
               toast(({ closeToast }) => <div> Your message has been send <a target="_blank" href={mylink}>check from solana.fm </a></div>);
  
  
  
            } catch (err) {
              console.log("Transaction error: ", err);
            }
          }



        } catch (err) {

          console.log("j" + j);
          console.log("This account need initialize first ", err);
          
          

          try {
            const program = new Program(idl, programID, provider);
            const cprice = new BN(1000000000);
            console.log("initalization progreess has been started.");
 
            const tx = await program.rpc.subscribe(cprice, {
              accounts: {
                buyer: myacc,
                receiver: new PublicKey('HdwzqmZbNVanLU56sKmgwdWjgZReHf9ESuD7GfGUkErc'),
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
                clock: CLOCK_PROGRAM_ID,
              },
            });



             console.log("txx", tx);
             let mylink = "https://solana.fm/tx/"+tx; 
             toast(({ closeToast }) => <div> Your message has been send <a target="_blank" href={mylink}>check from solana.fm 😎</a></div>);



          } catch (err) {
            console.log("Transaction error: ", err);
          }




     
            


        

         
        }

        

}
  async function logout() {
      wallet.disconnect();
  }
        if (!wallet.connected) {
          
          return (
            <Container>
             <Row>
               <Col>
                         { <center> <img className="App-logo" src={logo} /> </center> }
                         {<center><p className=""> SecureSolInsure</p></center>}
                         {<center><p className=""> Hemen sigortalı olun güvende olun </p></center>}
                        <div style={{ display: 'flex', justifyContent:'center', marginTop:'30px' }}> <WalletMultiButton /> </div>
               </Col>
             </Row>
           </Container>
          )
        } else {

          console.log('im here for call subnow');
          subnow();
          console.log("my time" + mytime);
          return (
            <div className="App">
              <div>
              { <center> <img className="App-logo" src={logo} /> </center> }
                {<h2 id="swtab"> Hemen Sigortalı Olun </h2>}
                <h5>Sigorta türü</h5>
<select id="insurance-type" name="insurance-type">
    <option value="kasko">Kasko</option>
    <option value="sağlık">Sağlık Sigortası</option>
    <option value="seyahat">Seyahat Sigortası</option>
    <option value="konut">Konut Sigortası</option>
    
</select>
        <h5>Sigorta başlangıç tarihi</h5>
         <label>
           <input type="date" date="date" />
         </label>
         <h5>Sigorta bitiş tarihi</h5>
         <label>
         <input type="date" date="date" />
         </label>
        

                
                <Button variant="outline-secondary" className="subbtn" onClick={subnow}>{buttonText}</Button>
                <Button variant="outline-secondary" className="subbtn" onClick={logout}>logout</Button>
                <br></br>


                
               
                 
                 

                  {renew ? (
                    //premium users will show here
                    <h1 class="mycontentt">SecureSolInsure</h1>
                    ) : (
                    <h1 class="mycontentt">Nothing seen here, You need subscribe first!</h1>
                  )}



             {functionCompleted && <Countdown  date={mytime + 259200000 } renderer={renderer} />}



                   
               


               <ToastContainer
                  position="bottom-left"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  theme="dark"
                  />

              </div>
            </div>
          );
        }



      }



const AppWithProvider = () => (
  <ConnectionProvider endpoint="https://api.devnet.solana.com">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;