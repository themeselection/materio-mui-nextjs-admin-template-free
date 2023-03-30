import React, { Component } from "react";
import axios from "axios";
import "./eth-overview.css";
import { Card, Grid, Icon } from "semantic-ui-react";
import LatestBlocks from "../Latest-Blocks/index";
import LatestTxs from "../Latest-Txs/index";

// import api key from the env variable
const apiKey ='1YP3GTP4D3S7I4I3BHE9D3QDDTUGEU4YGV';

const endpoint = `https://api-goerli.etherscan.io/`;

class EthOverview extends Component {
  constructor() {
    super();
    this.state = {
      ethUSD: "",
      ethBTC: "",
      blockNo: "",
      latestBlock: 0,
      difficulty: "",
      marketCap: 0
    };
  }

  async componentDidMount() {
    // get the ethereum price
    axios
      .get(endpoint + `?module=stats&action=ethprice&apikey=${apiKey}`)
      .then(res => {
        const { result } = res.data;
        this.setState(
          {
            ethUSD: result.ethusd,
            ethBTC: result.ethbtc
          },
          () => {
            // get the market cap of ether in USD
            axios
              .get(endpoint + `?module=stats&action=ethsupply&apikey=${apiKey}`)
              .then(res => {
                const { result } = res.data;
                // in wei
                const priceWei = result.toString();

                // in ether
                const priceEth = priceWei.slice(0, priceWei.length - 18);
                console.log(result, priceWei, priceEth);
                // convert eth in USD
                this.setState({
                  marketCap: parseInt(priceEth) * this.state.ethUSD
                });
              });
          }
        );
      });

    // get the latest block number
    axios
      .get(endpoint + `?module=proxy&action=eth_blockNumber&apikey=${apiKey}`)
      .then(res => {
        this.setState({
          latestBlock: parseInt(res.data.result),
          blockNo: res.data.result // save block no in hex
        });

        // get the block difficulty
        axios
          .get(
            endpoint +
              `?module=proxy&action=eth_getBlockByNumber&tag=${res.data.result}&boolean=true&apikey=${apiKey}`
          )
          .then(blockDetail => {
            const { result } = blockDetail.data;

            const difficulty = parseInt(result.difficulty).toString();

            // convert difficulty in Terra Hash
            // instead of dividing it with 10^12 we'll slice it
            const difficultyTH = `${difficulty.slice(0, 4)}.${difficulty.slice(
              4,
              6
            )} TH`;

            this.setState({
              difficulty: difficultyTH
            });
          });
      });
  }

  getLatestBlocks = () => {
    if (this.state.latestBlock) {
      return <LatestBlocks latestBlock={this.state.latestBlock}></LatestBlocks>;
    }
  };

  getLatestTxs = () => {
    if (this.state.blockNo) {
      return <LatestTxs blockNo={this.state.blockNo}></LatestTxs>;
    }
  };

  render() {
    const { ethUSD, ethBTC, latestBlock, difficulty, marketCap } = this.state;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: "#1d6fa5" }}>
                    <Icon name="ethereum"></Icon> ETHER PRICE
                  </Card.Header>
                  <Card.Description textAlign="left">
                    <Icon name="usd"></Icon>
                    {ethUSD} <Icon name="at"></Icon> {ethBTC}{" "}
                    <Icon name="bitcoin"></Icon>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: "#1d6fa5" }}>
                    <Icon name="list alternate outline"></Icon> LATEST BLOCK
                  </Card.Header>
                  <Card.Description textAlign="left">
                    <Icon name="square"></Icon> {latestBlock}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: "#1d6fa5" }}>
                    <Icon name="setting"></Icon> DIFFICULTY
                  </Card.Header>
                  <Card.Description textAlign="left">
                    {difficulty}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Card>
                <Card.Content>
                  <Card.Header style={{ color: "#1d6fa5" }}>
                    <Icon name="world"></Icon> MARKET CAP
                  </Card.Header>
                  <Card.Description textAlign="left">
                    <Icon name="usd"></Icon> {marketCap}
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>{this.getLatestBlocks()}</Grid.Column>
            <Grid.Column>{this.getLatestTxs()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default EthOverview;