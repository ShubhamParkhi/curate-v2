import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import Skeleton from "react-loading-skeleton";
import PolicyIcon from "svgs/icons/policy.svg";
import { responsiveSize } from "styles/responsiveSize";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { MAIN_CURATE_ADDRESS } from "src/consts";
import { Link } from "react-router-dom";

const ShadeArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 24px ${responsiveSize(24, 32)};
  margin-top: 16px;
  background-color: ${({ theme }) => theme.mediumBlue};

  ${landscapeStyle(
    () => css`
      flex-direction: row;
      justify-content: space-between;
    `
  )};
`;

const StyledP = styled.p`
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.primaryBlue};
  ${landscapeStyle(
    () => css`
      margin-bottom: 0;
    `
  )};
`;

const StyledA = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledPolicyIcon = styled(PolicyIcon)`
  width: 16px;
  fill: ${({ theme }) => theme.primaryBlue};
`;

const LinkContainer = styled.div`
  display: flex;
  gap: ${responsiveSize(16, 24)};
  flex-wrap: wrap;
`;

interface IPolicies {
  policyURI: string;
  isItem?: boolean;
}

export const Policies: React.FC<IPolicies> = ({ policyURI, isItem }) => {
  const { data: parentRegistryDetails } = useRegistryDetailsQuery(MAIN_CURATE_ADDRESS);

  return (
    <ShadeArea>
      <StyledP>Make sure you read and understand the Policies</StyledP>
      <LinkContainer>
        {!isItem ? (
          <>
            {parentRegistryDetails ? (
              <StyledA to={`/attachment/?url=${getIpfsUrl(parentRegistryDetails.registry.policyURI ?? "")}`}>
                <StyledPolicyIcon />
                Curation Policy
              </StyledA>
            ) : (
              <Skeleton width={116} />
            )}
          </>
        ) : null}
        {policyURI ? (
          <StyledA to={`/attachment/?url=${getIpfsUrl(policyURI)}`}>
            <StyledPolicyIcon />
            List Policy
          </StyledA>
        ) : (
          <Skeleton width={80} />
        )}
      </LinkContainer>
    </ShadeArea>
  );
};
