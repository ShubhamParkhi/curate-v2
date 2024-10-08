import { Card, CustomTimeline, _TimelineItem1 } from "@kleros/ui-components-library";
import React, { useMemo } from "react";
import styled, { css, Theme, useTheme } from "styled-components";
import Header from "./Header";
import { useItemRequests } from "queries/useRequestsQuery";
import { RequestDetailsFragment, Ruling, Status } from "src/graphql/graphql";
import { formatDate } from "utils/date";
import CheckIcon from "assets/svgs/icons/check-circle-outline.svg";
import ClosedIcon from "assets/svgs/icons/close-circle.svg";
import { HistorySkeletonCard } from "../StyledSkeleton";
import Party from "./Party";
import { landscapeStyle } from "styles/landscapeStyle";

const Container = styled(Card)`
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: start;
  padding: 22px 32px;
  gap: 54px;
`;

const StyledTimeline = styled(CustomTimeline)`
  width: 100%;
  margin-bottom: 30px;
  .party-wrapper {
    max-height: none;
    ${landscapeStyle(
      () => css`
        max-height: 32px;
      `
    )}
  }
`;

const StyledLabel = styled.label`
  align-self: center;
  padding-bottom: 32px;
`;

interface IHistory {
  itemId: string;
  isItem?: boolean;
}

const History: React.FC<IHistory> = ({ itemId, isItem }) => {
  const theme = useTheme();
  const { data, isLoading } = useItemRequests(itemId);

  const items = useMemo(
    () =>
      data?.requests.reduce<_TimelineItem1[]>((acc, request) => {
        const history = constructItemsFromRequest(request, theme, isItem);
        acc.push(...history);
        return acc;
      }, []),
    [data]
  );

  const Component = useMemo(() => {
    if (!items || isLoading) return <HistorySkeletonCard />;
    else if (items.length === 0) return <StyledLabel>No requests yet.</StyledLabel>;

    return <StyledTimeline {...{ items }} />;
  }, [items, isLoading]);

  return (
    <Container>
      <Header />
      {Component}
    </Container>
  );
};

const constructItemsFromRequest = (
  request: RequestDetailsFragment,
  theme: Theme,
  isItem?: boolean
): _TimelineItem1[] => {
  const historyItems: _TimelineItem1[] = [];

  if (request.requestType === Status.RegistrationRequested) {
    historyItems.push({
      title: `${isItem ? "Item" : "List"} Submitted`,
      variant: theme.primaryBlue,
      subtitle: formatDate(request.submissionTime),
      rightSided: true,
      party: "",
    });

    if (request.disputed && request.challenger) {
      historyItems.push({
        title: `${isItem ? "Submission" : "Registration"} Challenged - Case ${request.disputeID}`,
        variant: theme.secondaryPurple,
        party: <Party {...{ request }} />,
        subtitle: formatDate(request.challengeTime),
        rightSided: true,
      });
    }

    if (request.resolved) {
      const included = request.disputed && request.finalRuling === Ruling.Reject ? false : true;

      historyItems.push({
        title: `${isItem ? "Item" : "List"} ${included ? "Included" : "Rejected"}`,
        variant: included ? theme.primaryBlue : theme.error,
        subtitle: formatDate(request.resolutionTime),
        rightSided: true,
        party: "",
        Icon: included ? CheckIcon : ClosedIcon,
      });
    }
  } else if (request.requestType === Status.ClearingRequested) {
    historyItems.push({
      title: "Removal Requested",
      variant: theme.primaryBlue,
      subtitle: formatDate(request.submissionTime),
      rightSided: true,
      party: <Party {...{ request }} isRemoval />,
    });

    if (request.disputed && request.challenger) {
      historyItems.push({
        title: `Removal Challenged - Case ${request.disputeID}`,
        variant: theme.secondaryPurple,
        party: <Party {...{ request }} />,
        subtitle: formatDate(request.submissionTime),
        rightSided: true,
      });
    }
    if (request.resolved) {
      const removed = request.disputed ? request.finalRuling === Ruling.Accept : request.finalRuling === null;
      historyItems.push({
        title: `${isItem ? "Item" : "List"} ${removed ? "Removed" : "Included"}`,
        variant: removed ? theme.error : theme.success,
        subtitle: formatDate(request.resolutionTime),
        rightSided: true,
        party: "",
        Icon: removed ? CheckIcon : ClosedIcon,
      });
    }
  }
  return historyItems;
};

export default History;
