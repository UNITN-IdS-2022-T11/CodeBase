import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);

const emailSchema = Yup.string()
  .required("Un indirizzo email è richiesto!")
  .email("Invalid email");

const usrLoginSchema = Yup.string()
  .required("L'username è richiesto!")
  .max(24, "Username too long! (max: 24)")
  .matches(/^[\w\-\_\.]*$/, "Username contains invalid chararcters");

const pwdLoginSchema = Yup.string()
  .required("Questo campo è essenziale!")
  .matches(/^[\w\!\@\#\$\%\^\&\*\.\-]*$/, "Password contains invalid character")
  .max(64, "Password too long! (max: 64)");

const usrRegSchema = Yup.string()
  .required("L'username è richiesto!")
  .min(3, "Username too short! (min: 3)")
  .max(24, "Username too long! (max: 24)")
  .matches(/^[\w\-\_\.]*$/, "Username contains invalid chararcter");

const pwdRegSchema = Yup.string()
  .password()
  .required("Questo campo è essenziale!")
  .matches(/^[\w\!\@\#\$\%\^\&\*\.\-]*$/, "Password contains invalid character")
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password too long! (max: 64)")
  .minLowercase(1, "Password must contain at least 1 lowercase letter")
  .minUppercase(1, "Password must contain at least 1 uppercase letter")
  .minSymbols(1, "Password must contain at least 1 symbol letter")
  .minNumbers(1, "Password must contain at least 1 number letter");

const eventNameSchema = Yup.string()
  .required("Questo campo è richiesto!")
  .min(6, "Nome evento troppo corto! (min: 6)")
  .max(32, "Nome evento troppo lungo! (max: 32)");

const eventDescSchema = Yup.string()
  .required("Questo campo è richiesto!")
  .min(6, "Descrizione evento troppo corta! (min: 6)")
  .max(1000, "Descrizione evento troppo lunga! (max: 1000)");

const eventLocationShema = Yup.string()
  .required("Questo campo è richiesto!")
  .matches(
    /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
    "Formato posizione invalido"
  );

const eventPriceSchema = Yup.number()
  .required("Questo campo è richiesto!")
  .max(250, "Prezzo evento troppo alto! (max: 250)");

const eventDateSchema = Yup.date().required("Questo campo è richiesto!");

const eventMaxParticipantsSchema = Yup.number()
  .required("Questo campo è richiesto!")
  .min(2, "Numero partecipanti troppo basso! (min: 2)")
  .max(2500, "Numero partecipanti troppo alto! (max: 2500)");

const carDescriptionSchema = Yup.string()
  .required("Questo campo è richiesto!")
  .max(1000, "Descrizione auto troppo lunga! (max: 1000)");

export const loginSchema = {
  email: emailSchema,
  username: usrLoginSchema,
  password: pwdLoginSchema,
};

export const regSchema = {
  email: emailSchema,
  username: usrRegSchema,
  password: pwdRegSchema,
};

export const eventSchema = {
  name: eventNameSchema,
  description: eventDescSchema,
  location: eventLocationShema,
  cost: eventPriceSchema,
  date: eventDateSchema,
  maxParticipants: eventMaxParticipantsSchema,
};

export const carSchema = {
  description: carDescriptionSchema,
};

export const secretCodeSchema = Yup.string()
  .matches(/^[a-f0-9]{32}$/, "Secret code wrongly formatted")
  .required("Secret code is required!");

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const MAX_FILE_SIZE = 10000000;

export const imageSchema = Yup.mixed()
  .required("Image is required")
  .test("fileType", "Please use png, jpeg or gif", (value) =>
    SUPPORTED_FORMATS.includes(value?.type)
  )
  .test(
    "fileSize",
    "File is too large (max: 10MB)",
    (value) => value?.size <= MAX_FILE_SIZE
  );
