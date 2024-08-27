import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRegistryItemsQuery } from "queries/useRegistryAllItemsQuery";
import { json2csv } from "json-2-csv";
import ExportIcon from "svgs/icons/export.svg";

const StyledLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: end;
  gap: 8px;
  text-decoration: none;
  color: ${({ theme }) => theme.primaryBlue};
  margin-top: 48px;
  align-self: flex-end;
  cursor: pointer;
`;

const StyledExportIcon = styled(ExportIcon)`
  path {
    stroke: ${({ theme }) => theme.primaryBlue};
  }
`;

const ItemsDownloadLabel: React.FC<{ registryAddress?: string }> = ({ registryAddress }) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const { data: items, refetch, isRefetching } = useRegistryItemsQuery(registryAddress);

  useEffect(() => {
    if (!items || !ref.current) return;
    setIsPreparing(true);
    const flattenedItems = items.flatMap((item) => {
      let isFirstRow = true;

      return item.props.map((prop) => {
        // Create the row with the item details for the first row, otherwise leave them empty
        const row = {
          id: isFirstRow ? item.id : "",
          status: isFirstRow ? item.status : "",
          disputed: isFirstRow ? item.disputed : "",
          propLabel: prop.label,
          propDescription: prop.description,
          propValue: prop.value,
          propIsIdentifier: prop.isIdentifier,
          propType: prop.type,
        };

        isFirstRow = false;

        return row;
      });
    });
    const csvData = json2csv(flattenedItems);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = ref.current;

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${registryAddress}.csv`);
      link.click();
    }

    setIsPreparing(false);
  }, [items]);

  return (
    <StyledLink onClick={() => refetch()} aria-disabled={isRefetching} ref={ref}>
      {isRefetching || isPreparing ? (
        <>Exporting list...</>
      ) : (
        <>
          Export as csv <StyledExportIcon />
        </>
      )}
    </StyledLink>
  );
};

export default ItemsDownloadLabel;
