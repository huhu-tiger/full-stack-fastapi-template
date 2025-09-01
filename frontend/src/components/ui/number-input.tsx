import { NumberInput as ChakraNumberInput } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface NumberInputRootProps extends ChakraNumberInput.RootProps {}

export const NumberInputRoot = forwardRef<
  HTMLDivElement,
  NumberInputRootProps
>(function NumberInputRoot(props, ref) {
  return <ChakraNumberInput.Root ref={ref} {...props} />
})

export interface NumberInputFieldProps extends ChakraNumberInput.InputProps {}

export const NumberInputField = forwardRef<
  HTMLInputElement,
  NumberInputFieldProps
>(function NumberInputField(props, ref) {
  return <ChakraNumberInput.Input ref={ref} {...props} />
})