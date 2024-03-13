import React from "react";
import styled, { css } from "styled-components";
import { Field } from "@kleros/ui-components-library";
import { landscapeStyle } from "styles/landscapeStyle";
import { responsiveSize } from "styles/responsiveSize";
import NavigationButtons from "../NavigationButtons";
import Header from "../Header";
import InfoCard from "components/InfoCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 84vw;

  ${landscapeStyle(
    () => css`
      width: ${responsiveSize(442, 700, 900)};
    `
  )}
`;

const FieldContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledField = styled(Field)`
  width: 100%;
`;

const StyledInfoCard = styled(InfoCard)`
  width: 100%;
`;

const Title: React.FC = () => {
  return (
    <Container>
      <Header text="Name" />
      <FieldContainer>
        <StyledField
          // onChange={handleWrite}
          placeholder="eg. Address Tags"
          value={""}
        />
        <StyledInfoCard msg="Choose a short name for the list." />
      </FieldContainer>
      <NavigationButtons prevRoute="" nextRoute="/submitList/description" />
    </Container>
  );
};
export default Title;
