import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {ethers} from 'ethers';
import tokenJson from '../assets/MyERC20Votes.json';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  provider;
  wallet: ethers.Wallet | undefined;
  tokenAddress: string | undefined;
  ERC20VOTE_ADDRESS: string | undefined
  BALLOT_ADDRESS: string | undefined
  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined
  etherBalance : number | undefined;
  tokenBalance : number | undefined;
  votePower : number | undefined;
  signerAddress: string | undefined
  
  constructor(private http: HttpClient) {
    this.provider = ethers.providers.getDefaultProvider('goerli');
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans) => {
      this.ERC20VOTE_ADDRESS = ans.result
      console.log(`ERC20Votes ${this.ERC20VOTE_ADDRESS}`)
    })
    this.http.get<any>("http://localhost:3000/ballot-address").subscribe((ans) => {
      this.BALLOT_ADDRESS = ans.result
      console.log(`Ballot ${this.BALLOT_ADDRESS}`)
    })
  }

  connectMetamask() {
    
  }

  createWallet() {
    this.http.get<any>("http://localhost:3000/token-address").subscribe((ans: { result: string | undefined; }) => {
      this.tokenAddress = ans.result;
      if(this.tokenAddress) {
        this.wallet = ethers.Wallet.createRandom().connect(this.provider);
        this.tokenContract = new ethers.Contract(this.tokenAddress, tokenJson.abi, this.wallet);
        this.wallet.getBalance().then((balanceBN: ethers.BigNumber) => {
          this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBN));
        });
        this.tokenContract["balanceOf"](this.wallet.address).then((tokenBalanceBN: ethers.BigNumber) => {
          this.tokenBalance = parseFloat(ethers.utils.formatEther(tokenBalanceBN));
        });
        this.tokenContract["getVotes"](this.wallet.address).then((votesBN: ethers.BigNumber) => {
          this.votePower = parseFloat(ethers.utils.formatEther(votesBN));
        });
      }
    });
  }

	claimTokens() {
		this.http.post<any>('http://localhost:3000/claim-tokens', {address: this.signerAddress, amount: '10'}).subscribe((ans: any) => {
			console.log({ ans })
		})
	}

  connectBallot(address: string) {
    this.getBallotInfo();
  }

  delegate() {

  }

  castVote() {

  }

  getBallotInfo() {

  }

}
