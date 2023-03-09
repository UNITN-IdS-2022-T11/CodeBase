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
import { loginSchema } from "lib/yupSchemas";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

const Recover = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.data) router.push("/");
  }, [user]);

  let invalidParameters = false;

  async function handleSubmit(values) {
    try {
      const res = await fetch("/api/user/requestRecoverPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/emailSent");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);

      invalidParameters = error.message === "Username or email invalid";
    }
  }

  const formList = [
    {
      name: "username",
      label: "Username",
      placeholder: "Username",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Email",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Password dimenticata</title>
      </Head>
      <AuthLayout
        title={<Heading>Recupera la tua Password</Heading>}
        bottom={
          <HStack justify="center">
            <Text>Non hai dimenticato le tue credenziali?</Text>
            <Link href="/login" variant="link">
              Login!
            </Link>
          </HStack>
        }
      >
        <Formik
          validationSchema={Yup.object().shape({
            username: loginSchema.username.test(
              "InvalidParameters",
              "Username o email invalidi",
              () => !invalidParameters
            ),
            email: loginSchema.email,
          })}
          initialValues={{ username: "", email: "" }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            invalidParameters = false;
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Invia email di recupero
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default Recover;
