import styled from "styled-components";
import { ethers } from "ethers";

import { Box, Grid, Typography, Button } from "@material-ui/core";

import TotalsContainer from "../../containers/Totals";
import Collateral from "../../containers/Collateral";
import Token from "../../containers/Token";
import Etherscan from "../../containers/Etherscan";
import EmpState from "../../containers/EmpState";

import Connection from "../../containers/Connection";
import { getExchangeInfo } from "../../utils/getExchangeLinks";

const fromWei = ethers.utils.formatUnits;

const DataBox = styled(Box)`
  border: 1px solid #434343;
  padding: 1rem 1rem;
  margin: 1rem 1rem;
`;

const Label = styled.div`
  color: #999999;
`;

const Small = styled.span`
  font-size: 1rem;
`;

const LinksContainer = styled.div`
  color: #999;
`;

const SmallLink = styled.a`
  color: white;

  &:not(:first-child) {
    margin-left: 12px;
  }

  &:hover {
    color: red;
  }
`;

const White = styled.span`
  color: white;
`;

const Totals = () => {
  const { provider } = Connection.useContainer();
  const { empState } = EmpState.useContainer();
  const { strikePrice, expirationTimestamp: expiry } = empState;
  const sPrice =
    strikePrice !== null ? fromWei(strikePrice.toString()).toString() : "N/A";

  const { totalCollateral, totalTokens } = TotalsContainer.useContainer();
  const {
    symbol: collSymbol,
    address: collAddress,
  } = Collateral.useContainer();
  const { symbol: tokenSymbol, address: tokenAddress } = Token.useContainer();
  const { getEtherscanUrl } = Etherscan.useContainer();
  const exchangeInfo = getExchangeInfo(tokenSymbol);
  const defaultMissingDataDisplay = "N/A";

  if (
    totalCollateral !== null &&
    totalTokens !== null &&
    collSymbol !== null &&
    tokenSymbol !== null &&
    exchangeInfo !== undefined &&
    collAddress !== null &&
    tokenAddress !== null &&
    provider !== null &&
    expiry !== null
  ) {
    const expiryTimestamp = expiry.toString();
    const expiryDate = new Date(expiry.toNumber() * 1000).toLocaleString(
      "en-GB",
      {
        timeZone: "UTC",
        // dateStyle: "full",
        month: "short",
        year: "2-digit",
        day: "2-digit",
      }
    );

    const prettyTotalCollateral = Number(totalCollateral).toLocaleString(
      undefined,
      {
        style: "decimal",
        maximumFractionDigits: 4,
        minimumFractionDigits: 4,
      }
    );
    const prettyTotalTokens = Number(totalTokens).toLocaleString(undefined, {
      style: "decimal",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    const prettyCollSymbol = collSymbol;
    const prettyTokenSymbol = tokenSymbol;
    const getExchangeLinkCollateral = exchangeInfo.getExchangeUrl(collAddress);
    const getExchangeLinkToken = exchangeInfo.getExchangeUrl(tokenAddress);
    const exchangeName = exchangeInfo.name;

    const addTokenToMetamask = () => {
      // @ts-ignore
      provider.send("wallet_watchAsset", {
        // @ts-ignore
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol.substring(0, 4),
          name: "test",
          decimals: 18,
          image:
            "https://raw.githubusercontent.com/UMAprotocol/website/master/src/assets/images/yusd-round.png",
        },
        id: Math.round(Math.random() * 100000),
      });
    };

    return renderComponent(
      prettyTotalCollateral,
      prettyTotalTokens,
      prettyCollSymbol,
      prettyTokenSymbol,
      collAddress,
      tokenAddress,
      getExchangeLinkCollateral,
      getExchangeLinkToken,
      exchangeName,
      addTokenToMetamask,
      sPrice,
      expiryDate
    );
  } else {
    return renderComponent();
  }

  function renderComponent(
    prettyTotalCollateral: string = defaultMissingDataDisplay,
    prettyTotalTokens: string = defaultMissingDataDisplay,
    prettyCollSymbol: string = "",
    prettyTokenSymbol: string = "",
    collAddress: string = "",
    tokenAddress: string = "",
    getExchangeLinkCollateral: string = "",
    getExchangeLinkToken: string = "",
    exchangeName: string = "Uniswap",
    addTokenToMetamask: any = null,
    sPrice: string = "",
    expiryDate: string = ""
  ) {
    return (
      <Grid container spacing={0}>
        <Grid item md={6} xs={12}>
          <DataBox>
            <Typography variant="h4">
              <strong>{prettyTotalTokens}</strong>
              <Small> {prettyTokenSymbol}</Small>
            </Typography>
            <Label>
              of <White>synthetic tokens</White> outstanding
            </Label>
            <LinksContainer>
              {tokenAddress !== "" && (
                <SmallLink
                  href={getEtherscanUrl(tokenAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Etherscan
                </SmallLink>
              )}

              {getExchangeLinkToken !== "" && (
                <SmallLink
                  href={getExchangeLinkToken}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {exchangeName}
                </SmallLink>
              )}

              {tokenAddress !== "" && tokenSymbol === "yUSD-SEP20" && (
                <SmallLink href="#" onClick={addTokenToMetamask}>
                  Add to Metamask
                </SmallLink>
              )}
            </LinksContainer>
          </DataBox>
        </Grid>

        <Grid item md={6} xs={12}>
          <DataBox>
            <Typography variant="h3">
              <strong>{sPrice}</strong>
              <Small> STRIKE </Small>
            </Typography>
            <Typography variant="h6">
              <strong>{expiryDate}</strong>
              <Small> EXPIRY </Small>
            </Typography>
          </DataBox>
        </Grid>
      </Grid>
    );
  }
};

export default Totals;
