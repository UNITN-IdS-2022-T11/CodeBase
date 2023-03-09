import {
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field } from "formik";

export const FormFields = ({ list }) => {
  return (
    <>
      {list.map(({ name, label, placeholder, type }) => (
        <Field name={name} key={name}>
          {({ field, form }) => (
            <FormControl isInvalid={form.errors[name] && form.touched[name]}>
              <FormLabel>{label}</FormLabel>
              <Input {...field} placeholder={placeholder} type={type} />
              <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>
          )}
        </Field>
      ))}
    </>
  );
};

export const FormLayout = ({ children, title, bottom }) => {
  return (
    <Container
      maxW="lg"
      px={{ base: "0", sm: "8" }}
      py={{ base: "12", md: "24" }}
    >
      <Stack spacing="8">
        <VStack textAlign="center">{title}</VStack>

        <Box
          px={{ base: "4", sm: "10" }}
          py={{ base: "0", sm: "8" }}
          bg={{ sm: useColorModeValue("blackAlpha.200", "whiteAlpha.200") }}
          borderRadius={{ base: "none", sm: "xl" }}
          shadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }}
        >
          {children}
        </Box>

        <VStack textAlign="center">{bottom}</VStack>
      </Stack>
    </Container>
  );
};
