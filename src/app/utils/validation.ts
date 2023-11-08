import { object, string, ref, array } from "yup";
import {
  CONFIRM_PASSWORD_ERROR_MESSAGE,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE,
  REQUIRED,
} from "../constants";


export const signUpValidationSchema = object().shape({
  email: string().required(REQUIRED).email(EMAIL_ERROR_MESSAGE),
  password: string()
    .required(REQUIRED),
  confirmPassword: string()
    .oneOf([ref("password")], CONFIRM_PASSWORD_ERROR_MESSAGE)
    .required(REQUIRED),
});

export const loginValidationSchema = object().shape({
    email: string().required(REQUIRED).email(EMAIL_ERROR_MESSAGE),
    password: string()
      .required(REQUIRED),
  });


  export const projectValidationSchema = object().shape({
    title: string().required(REQUIRED),
    tasks: array(),
    comment: string(),
  });
