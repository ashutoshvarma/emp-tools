import styled from "styled-components";
import { ethers } from "ethers";
import { Typography, Box, Tooltip } from "@material-ui/core";

import EmpState from "../../containers/EmpState";
import DvmState from "../../containers/DvmState";
import Collateral from "../../containers/Collateral";

import { DOCS_MAP } from "../../constants/docLinks";

const Label = styled.span`
  color: #999999;
`;

const Status = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Link = styled.a`
  color: white;
  font-size: 14px;
`;

const fromWei = ethers.utils.formatUnits;

const DisputeParams = () => {
  const { empState } = EmpState.useContainer();
  const { strikePrice } = empState;

  const sPrice =
    strikePrice !== null
      ? fromWei(strikePrice.toString()).toString()
      : strikePrice;

  return (
    <Box>
      <Typography variant="h5">Strike Price</Typography>

      <Typography variant="h4">{sPrice}</Typography>
    </Box>
  );
};

export default DisputeParams;
