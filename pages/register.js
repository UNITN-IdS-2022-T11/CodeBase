import {
  Button,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthLayout, FormFields } from "components/authentication";
import Link from "components/chakraNextLink";
import Layout from "components/layout";
import { Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import { regSchema } from "lib/yupSchemas";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

const Register = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.data) router.push("/");
  }, [user]);

  let userNameTakenMsg = "";

  async function handleSubmit(values) {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/login");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);
      if (
        error.message === "Username already exists" ||
        error.message === "Username not available, try again tomorrow"
      ) {
        userNameTakenMsg = "Username già in uso.";
      }
    }
  }

  const formList = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "iltuonome@iltuodomin.io",
    },
    {
      name: "username",
      label: "Username",
      placeholder: "L'username deve essere univoco",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Perfavore, scegli una password sicura",
    },
    {
      name: "passwordConfirm",
      label: "Conferma password",
      type: "password",
      placeholder: "Conferma la tua password",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Registrati</title>
      </Head>
      <AuthLayout
        title={<Heading>Registrati</Heading>}
        bottom={
          <HStack justify="center">
            <Text>Hai già un account?</Text>
            <Link href="/login" variant="link">
              Login!
            </Link>
          </HStack>
        }
      >
        <Formik
          validationSchema={Yup.object().shape({
            email: regSchema.email,
            username: regSchema.username.test(
              "Taken",
              () => userNameTakenMsg,
              () => !userNameTakenMsg
            ),
            password: regSchema.password,
            passwordConfirm: Yup.string()
              .required("Questo campo è molto importante.")
              .oneOf([Yup.ref("password")], "Le password non corrispondono!"),
          })}
          initialValues={{
            email: "",
            username: "",
            password: "",
            passwordConfirm: "",
          }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            userNameTakenMsg = "";
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Registrati
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default Register;
