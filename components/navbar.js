import {
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "components/chakraNextLink";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const Searchbar = (props) => {
  const [search, setSearch] = useState("");

  return (
    <Box {...props}>
      <InputGroup size="md">
        <Input
          pr="6.5rem"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca utenti o eventi..."
          type="search"
        />
        <InputRightElement w="6.5rem">
          <Button
            h="1.75rem"
            leftIcon={<SearchIcon />}
            onClick={() => console.log(search)}
            size="sm"
          >
            Cerca
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

const UserMenu = ({ user }) => {
  const router = useRouter();

  return (
    <Menu>
      <MenuButton as={Button} minW={0} rounded="full" variant="link">
        <Avatar
          size="sm"
          src="https://avatars.dicebear.com/api/male/beard/username.svg"
        />
      </MenuButton>
      <MenuList alignItems={"center"}>
        <br />
        <Center>
          <Avatar
            size="2xl"
            src="https://avatars.dicebear.com/api/male/beard/username.svg"
          />
        </Center>
        <br />
        <Center>
          <p>{user.username}</p>
        </Center>
        <br />
        <MenuDivider />
        <MenuItem onClick={() => router.push("/updateUser")}>
          Aggiorna Account
        </MenuItem>
        <MenuItem onClick={() => router.push("/updatePassword")}>
          Aggiorna Password
        </MenuItem>
        <MenuItem onClick={() => router.push("/api/user/logout")}>
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const ShowLogin = ({ user }) => {
  if (!user) return null;

  const { data: userData, isLoading } = user;
  if (isLoading) return <Spinner />;

  return userData ? (
    <UserMenu user={userData} />
  ) : (
    <Link href="/login" variant="solid">
      Login
    </Link>
  );
};

const PagesList = (props) => {
  const links = [
    { href: "/myEvents", text: "myEvents" },
    { href: "/myGarage", text: "myGarage" },
    { href: "/myAgenda", text: "myAgenda" },
  ];

  return (
    <Stack {...props}>
      {links.map(({ href, text }) => (
        <Link href={href} variant="ghostText" key={href}>
          {text}
        </Link>
      ))}
    </Stack>
  );
};

const Navbar = ({ user, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const searchbar = useDisclosure();
  const menu = useDisclosure();

  return (
    <Box
      px={4}
      bg={useColorModeValue("green.300", "green.500")}
      shadow={useColorModeValue("xl", "xl-dark")}
      {...rest}
    >
      <Flex justify="space-between" h={16}>
        <Flex align="center" gap={2}>
          <IconButton
            {...menu.getButtonProps()}
            display={{ lg: "none" }}
            icon={menu.isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={() => {
              menu.onToggle();
              searchbar.onClose();
            }}
          />

          <Link href="/">
            <Image width={200} height={200} alt="duck" src="/images/icon.png" />
          </Link>
          {user && user?.data !== null ? (
            <Box display={{ base: "none", lg: "flex" }} px={3}>
              <PagesList direction="row" spacing={6} />
            </Box>
          ) : null}
        </Flex>

        <HStack spacing={3}>
          <IconButton
            aria-label="toggleColorMode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            isRound
            onClick={toggleColorMode}
            variant="ghost"
          />

          <IconButton
            {...searchbar.getButtonProps()}
            display={{ md: "none" }}
            icon={searchbar.isOpen ? <CloseIcon /> : <SearchIcon />}
            onClick={() => {
              searchbar.onToggle();
              menu.onClose();
            }}
          />

          <Box display={{ base: "none", md: "flex" }}>
            <Searchbar />
          </Box>

          <ShowLogin user={user} />
        </HStack>
      </Flex>

      <Collapse animateOpacity in={searchbar.isOpen}>
        <Box display={{ md: "none" }} pb={4}>
          <Searchbar />
        </Box>
      </Collapse>

      {user && user?.data !== null ? (
        <Collapse animateOpacity in={menu.isOpen}>
          <Box display={{ lg: "none" }} pb={4}>
            <PagesList direction="column" spacing={3} />
          </Box>
        </Collapse>
      ) : null}
    </Box>
  );
};

export default Navbar;
