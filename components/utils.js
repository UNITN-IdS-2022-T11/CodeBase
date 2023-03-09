import { Textarea, chakra } from "@chakra-ui/react";
import NextImage from "next/image";
import ResizeTextarea from "react-textarea-autosize";

export const ChakraNextImage = chakra(NextImage, {
  baseStyle: { maxH: 120, maxW: 120 },
  shouldForwardProp: (prop) =>
    [
      "width",
      "height",
      "src",
      "alt",
      "quality",
      "placeholder",
      "blurDataURL",
      "loader",
    ].includes(prop),
});

/**
 * @see https://github.com/chakra-ui/chakra-ui/issues/670#issuecomment-969444392
 */
export const AutoResizeTextarea = (props, ref) => {
  return (
    <Textarea
      ref={ref}
      as={ResizeTextarea}
      overflow="hidden"
      w="100%"
      minH="unset"
      resize="none"
      minRows={1}
      {...props}
    />
  );
};

AutoResizeTextarea.displayName = "AutoResizeTextarea";
