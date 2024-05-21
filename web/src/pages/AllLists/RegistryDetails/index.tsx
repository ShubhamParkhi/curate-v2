import React, { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import InformationCard from "components/InformationCard";
import Tabs from "./Tabs";
import List from "./List";
import History from "components/HistoryDisplay";
import { useRegistryDetailsContext } from "context/RegistryDetailsContext";
import { useRegistryDetailsQuery } from "queries/useRegistryDetailsQuery";
import { useItemDetailsQuery } from "queries/useItemDetailsQuery";
import { mapFromSubgraphStatus } from "components/RegistryCard/StatusBanner";

const RegistryDetails: React.FC = () => {
  const { id } = useParams();

  const [listAddress, itemId] = id?.split("-");
  const [, registryAddress] = itemId.split("@");

  const { data: itemDetails, refetch: refetchItemDetails } = useItemDetailsQuery(itemId?.toLowerCase());
  const { data: registryDetails, refetch: refetchRegistryDetails } = useRegistryDetailsQuery(
    listAddress?.toLowerCase()
  );

  const refetch = () => {
    refetchItemDetails();
    refetchRegistryDetails();
  };

  const {
    title,
    status,
    logoURI,
    policyURI,
    description,
    registerer,
    disputed,
    setRegistryDetails,
    itemID: registryAsitemId,
  } = useRegistryDetailsContext();

  useEffect(() => {
    if (itemDetails && registryDetails) {
      setRegistryDetails({
        ...registryDetails.registry,
        ...itemDetails.item,
        registerer: registryDetails?.registry?.registerer,
      });
    }
  }, [itemDetails, registryDetails, setRegistryDetails]);

  return (
    <div>
      <InformationCard
        id={listAddress}
        {...{
          title,
          logoURI,
          description,
          policyURI,
          status: mapFromSubgraphStatus(status, disputed),
          itemId: registryAsitemId,
          refetch,
        }}
        registryAddress={registryAddress}
        registerer={registerer?.id}
        explorerAddress={listAddress}
      />
      <Tabs />
      <Routes>
        <Route path="list/:page/:order/:filter" element={<List registryAddress={listAddress} />} />
        <Route path="history" element={<History itemId={itemId} />} />
        <Route path="*" element={<Navigate to="list/1/desc/all" replace />} />
      </Routes>
    </div>
  );
};

export default RegistryDetails;
