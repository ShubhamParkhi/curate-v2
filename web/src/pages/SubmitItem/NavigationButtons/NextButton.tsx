import React from "react";
import { Button } from "@kleros/ui-components-library";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubmitItemContext } from "context/SubmitItemContext";

interface INextButton {
  nextRoute: string;
}

const NextButton: React.FC<INextButton> = ({ nextRoute }) => {
  const navigate = useNavigate();
  const { fieldOne, isPolicyRead } = useSubmitItemContext();
  const location = useLocation();

  const isButtonDisabled =
    (location.pathname.includes("/submit-item/item-field1") && !fieldOne) ||
    (location.pathname.includes("/submit-item/policy") && !isPolicyRead);

  return <Button disabled={isButtonDisabled} onClick={() => navigate(nextRoute)} text="Next" />;
};

export default NextButton;
