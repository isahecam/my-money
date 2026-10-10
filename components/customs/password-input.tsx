"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = Omit<React.ComponentProps<typeof InputGroupInput>, "type">;

export function PasswordInput({ className, ...props }: Readonly<PasswordInputProps>) {
  const [isVisible, setIsVisible] = useState(false);
  const label = isVisible ? "Ocultar contraseña" : "Mostrar contraseña";

  return (
    <InputGroup className={className} data-disabled={props.disabled}>
      <InputGroupInput {...props} type={isVisible ? "text" : "password"} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          title={label}
          aria-label={label}
          aria-controls={props.id}
          disabled={props.disabled}
          onClick={() => setIsVisible((visible) => !visible)}>
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
