import React from "react";
import { IFieldInput } from ".";
import StyledField from "./StyledField";

const NumberInput: React.FC<IFieldInput> = ({ fieldProp, handleWrite }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleWrite(event.target.value);
  };
  return (
    <StyledField
      type="number"
      value={fieldProp.value}
      onChange={handleChange}
      variant={"info"}
      message={fieldProp.description}
    />
  );
};

export default NumberInput;
