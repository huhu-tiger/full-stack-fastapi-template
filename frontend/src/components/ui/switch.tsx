import { Switch as ChakraSwitch } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface SwitchProps extends ChakraSwitch.RootProps {}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  function Switch(props, ref) {
    return (
      <ChakraSwitch.Root ref={ref} {...props}>
        <ChakraSwitch.Control>
          <ChakraSwitch.Thumb />
        </ChakraSwitch.Control>
      </ChakraSwitch.Root>
    )
  },
)