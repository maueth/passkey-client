import {server} from "@passwordless-id/webauthn";

const credentials = [];

export const registerVerification = async (challenge, registration) => {
  const expected = {
    challenge: challenge,
    origin: "http://localhost:3000",
  };

  const registrationParsed = await server.verifyRegistration(
    registration,
    expected
  );

  // save credentials in database
  credentials[registration.username] = registration.credential;

  return registrationParsed;
};

export const getUserCredentialKey = (username) => {
  return credentials[username];
};

export const loginVerify = async (challenge, authData, credentialKey) => {
  const expected = {
    challenge: challenge,
    origin: "http://localhost:3000",
    userVerified: true,
  };

  const authenticationParsed = await server.verifyAuthentication(
    authData,
    credentialKey,
    expected
  );

  return authenticationParsed;
};
