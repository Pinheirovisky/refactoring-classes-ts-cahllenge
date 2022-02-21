import {
  useEffect,
  useRef,
  useState,
  useCallback,
  InputHTMLAttributes,
} from "react";

import { useField } from "@unform/core";

// styles:
import { Container } from "./styles";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  name: string;
}

const Input: React.FC<InputProps> = ({
  name,
  icon: Icon,
  placeholder,
  ...rest
}: InputProps) => {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    const typesInputRef: any = inputRef.current;

    setIsFilled(!!typesInputRef?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && Icon}

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        placeholder={placeholder}
        {...rest}
      />
    </Container>
  );
};

export default Input;
