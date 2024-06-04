import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Link, useLocation } from "react-router-dom";
import { useOpenContext } from "../MobileHeader";
import { IPFS_GATEWAY, MAIN_CURATE_ADDRESS } from "consts/index";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { isUndefined } from "utils/index";

const Container = styled.div`
  display: flex;
  gap: 0px;
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
      gap: calc(4px + (16 - 4) * ((100vw - 375px) / (1250 - 375)));
    `
  )};
`;

const LinkContainer = styled.div`
  display: flex;
  min-height: 32px;
  align-items: center;
`;

const Title = styled.h1`
  display: block;

  ${landscapeStyle(
    () => css`
      display: none;
    `
  )};
`;

const StyledLink = styled(Link)<{ isActive: boolean }>`
  color: ${({ theme }) => theme.primaryText};
  text-decoration: none;
  font-size: 16px;

  font-weight: ${({ isActive }) => (isActive ? "600" : "normal")};

  ${landscapeStyle(
    () => css`
      color: ${({ theme }) => theme.white};
    `
  )};
`;

const Explore: React.FC = () => {
  const location = useLocation();
  const { toggleIsOpen } = useOpenContext();
  const { data: mainCurate } = useRegistryDetailsQuery(MAIN_CURATE_ADDRESS);

  const links = useMemo(
    () => [
      { to: "/", text: "Home", isLoading: false },
      {
        to: `${IPFS_GATEWAY}${mainCurate?.registry.policyURI}`,
        text: "Curation Policy",
        isLoading: isUndefined(mainCurate),
      },
    ],
    [mainCurate]
  );

  return (
    <Container>
      <Title>Explore</Title>
      {links.map(({ to, text, isLoading }) => (
        <LinkContainer key={text}>
          <StyledLink to={to} onClick={() => !isLoading && toggleIsOpen()} isActive={location.pathname.startsWith(to)}>
            {text}
          </StyledLink>
        </LinkContainer>
      ))}
    </Container>
  );
};

export default Explore;
