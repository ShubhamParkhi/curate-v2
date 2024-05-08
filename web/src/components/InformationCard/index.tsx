import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { useToggle } from "react-use";
import Skeleton from "react-loading-skeleton";
import { Button, Card, Copiable } from "@kleros/ui-components-library";
import EtherscanIcon from "svgs/icons/etherscan.svg";
import { Status } from "consts/status";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "consts/chains";
import { getIpfsUrl } from "utils/getIpfsUrl";
import { isUndefined } from "utils/index";
// import { getChainIcon, getChainName } from "components/ChainIcon";
import AliasDisplay from "components/RegistryInfo/AliasDisplay";
import { getStatusColor, getStatusLabel } from "components/RegistryCard/StatusBanner";
import { Policies } from "./Policies";
import RemoveModal from "../Modal/RemoveModal";
import { DEFAULT_LIST_LOGO } from "consts/index";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  margin-bottom: 64px;
`;

const StatusContainer = styled.div<{ status: Status }>`
  display: flex;
  .dot {
    ::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }
  ${({ theme, status }) => {
    const [frontColor] = getStatusColor(status, theme);
    return `
      .front-color {
        color: ${frontColor};
      }
      .dot {
        ::before {
          background-color: ${frontColor};
        }
      }
    `;
  }};
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px ${responsiveSize(24, 32)} 12px ${responsiveSize(24, 32)};
`;

const LogoAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const TopLeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${responsiveSize(8, 16)} 0;
`;

const TopRightInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0 32px;
  flex-wrap: wrap;
  align-items: start;
  padding-top: 20px;
`;

const StyledEtherscanIcon = styled(EtherscanIcon)`
  display: flex;
  height: 16px;
  width: 16px;
`;

const StyledLogo = styled.img<{ isListView: boolean }>`
  width: ${({ isListView }) => (isListView ? "48px" : "125px")};
  height: ${({ isListView }) => (isListView ? "48px" : "125px")};
  object-fit: contain;
  margin-bottom: ${({ isListView }) => (isListView ? "0px" : "8px")};
`;

const StyledTitle = styled.h1`
  margin: 0;
`;

const StyledP = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: ${responsiveSize(20, 28)} ${responsiveSize(24, 32)};
`;

const BottomInfo = styled.div`
  display: flex;
  padding: 0 ${responsiveSize(24, 32)} 12px ${responsiveSize(24, 32)};
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
`;

const SkeletonLogo = styled(Skeleton)`
  width: 125px;
  height: 125px;
  border-radius: 62.5px;
  margin-bottom: 8px;
`;

const SkeletonTitle = styled(Skeleton)`
  width: 260px;
  height: 30px;
`;

const SkeletonDescription = styled(Skeleton)`
  width: 90%;
  height: 21px;
`;

interface IInformationCard {
  id?: string;
  title?: string;
  logoURI?: string;
  description?: string;
  chainId?: number;
  status?: Status;
  registerer?: string;
  policyURI?: string;
  explorerAddress?: string;
  className?: string;
}

const InformationCard: React.FC<IInformationCard> = ({
  id,
  title,
  logoURI,
  description,
  registerer,
  chainId = 100,
  status,
  policyURI,
  explorerAddress,
  className,
}) => {
  const [isRemoveListModalOpen, toggleRemoveListModal] = useToggle(false);
  const [imageSrc, setImageSrc] = useState(getIpfsUrl(logoURI ?? ""));
  useEffect(() => setImageSrc(getIpfsUrl(logoURI)), [logoURI]);

  return (
    <>
      <StyledCard {...{ className }}>
        <TopInfo>
          <TopLeftInfo>
            <LogoAndTitle>
              {isUndefined(logoURI) ? (
                <SkeletonLogo />
              ) : (
                <StyledLogo
                  src={imageSrc}
                  onError={() => setImageSrc(getIpfsUrl(DEFAULT_LIST_LOGO))}
                  alt="List Img"
                  isListView={false}
                />
              )}
              {isUndefined(title) ? <SkeletonTitle /> : <StyledTitle>{title}</StyledTitle>}
            </LogoAndTitle>
            {isUndefined(description) ? <SkeletonDescription /> : <StyledP>{description}</StyledP>}
          </TopLeftInfo>
          <TopRightInfo>
            <Copiable copiableContent={id ?? ""} info="Copy Registry Id">
              <StyledLabel>Id</StyledLabel>
            </Copiable>
            {explorerAddress ? (
              <a
                href={`${SUPPORTED_CHAINS[DEFAULT_CHAIN].blockExplorers?.default.url}/address/${explorerAddress}`}
                target="_blank"
                rel="noreferrer"
              >
                <StyledEtherscanIcon />
              </a>
            ) : null}
            <StatusContainer {...{ status }}>
              <label className="front-color dot">{getStatusLabel(status)}</label>
            </StatusContainer>
          </TopRightInfo>
        </TopInfo>
        <Divider />
        <BottomInfo>
          <Copiable copiableContent={registerer ?? ""}>
            <AliasDisplay address={registerer} />
          </Copiable>
          <Button variant="secondary" text={"Remove List"} onClick={toggleRemoveListModal} />
        </BottomInfo>
        <Policies policyURI={policyURI} />
      </StyledCard>
      {isRemoveListModalOpen ? <RemoveModal isItem={false} toggleModal={toggleRemoveListModal} /> : null}
    </>
  );
};

export default InformationCard;
