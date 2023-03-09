import {
  Button,
  Checkbox,
  HStack,
  Heading,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthLayout, FormFields } from "components/authentication";
import Link from "components/chakraNextLink";
import Layout from "components/layout";
import { Field, Form, Formik } from "formik";
import { useUser } from "lib/hooks";
import { loginSchema } from "lib/yupSchemas";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

const Login = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.data) router.push("/");
  }, [user]);

  let invalidCredentials = false;
  let unverified = false;

  async function handleSubmit(values) {
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.status === 200) {
        router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development")
        console.error("An unexpected error happened occurred:", error);

      unverified = error.message === "Email not yet verified";
      invalidCredentials =
        error.message === "Invalid username and password combination";
    }
  }

  const formList = [
    {
      name: "username",
      label: "Username",
      placeholder: "Username",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <AuthLayout
        title={<Heading>Accedi al tuo account</Heading>}
        bottom={
          <HStack justify="center">
            <Text>Non hai un account?</Text>
            <Link href="/register" variant="link">
              Registrati!
            </Link>
          </HStack>
        }
      >
        <Formik
          validationSchema={Yup.object().shape({
            username: loginSchema.username
              .test(
                "Taken",
                "Username and Password combination invalid",
                () => !invalidCredentials
              )
              .test(
                "Unverified",
                "Account not yet verified",
                () => !unverified
              ),

            password: loginSchema.password
              .test(
                "Taken",
                "Username and Password combination invalid",
                () => !invalidCredentials
              )
              .test(
                "Unverified",
                "Account not yet verified",
                () => !unverified
              ),
          })}
          initialValues={{ username: "", password: "", remember: false }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values);
            await actions.validateForm();
            invalidCredentials = false;
            unverified = false;
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <VStack spacing={4}>
                <FormFields list={formList} />
                <HStack alignItems="center" justify="space-between" w="100%">
                  <Field as={Checkbox} name="remember">
                    Ricordami?
                  </Field>
                  <Link href="/recover" size="sm" variant="link">
                    Password dimenticata?
                  </Link>
                </HStack>
                <Spacer my={4} />
                <Button w="100%" isLoading={props.isSubmitting} type="submit">
                  Login
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </AuthLayout>
    </Layout>
  );
};

export default Login;
