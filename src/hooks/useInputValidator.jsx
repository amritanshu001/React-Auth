import { useState } from "react";

const useInputValidator = (inputValidator) => {
  const [value, setValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const resetInput = () => {
    setValue("");
    setIsTouched(false);
  };

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const inputChangeHandler = (event) => {
    setIsTouched(true);
    setValue(event.target.value);
  };

  let inputIsValid = inputValidator(value);
  let isError = isTouched && !inputIsValid;

  return {
    inputValue: value,
    inputIsValid,
    isError,
    inputBlurHandler,
    inputChangeHandler,
    resetInput,
  };
};

export default useInputValidator;
