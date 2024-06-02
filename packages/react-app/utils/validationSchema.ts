import * as yup from "yup";

// Regular expression for validating a Nigerian phone number
export const phoneNumberRegex = /^(?:\+?234|0)?[789]\d{9}$/;

// Regular expression for validating an Ethereum address
const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const validationSchema = yup.object().shape({
  recipient: yup
    .string()
    .test(
      "is-valid-recipient",
      "Recipient must be a valid phone number or Ethereum address",
      (value) =>
        phoneNumberRegex.test(value ?? "") ||
        ethereumAddressRegex.test(value ?? "")
    ),
  amount: yup
    .number()
    .required("Amount is required")
    .min(0.1, "Amount must be at least 0.1 CELO"),
  additionalFee: yup.boolean().oneOf([true]),
});
