import React, {useState} from "react";
import {client} from "@passwordless-id/webauthn";
import {getUserCredentialKey, loginVerify} from "../backend";
import {createChallenge} from "../utils/UserOperation.ts";
import {createUserOperationSignature} from "../utils/Signature";
import {ethers} from "ethers";

function AuthenticateDevice(props) {
  const [username, setUsername] = useState("test");

  const handleAuthentication = async () => {
    try {
      const challenge = createChallenge();

      // backend request simulation
      const credentialKey = getUserCredentialKey(username);

      const authData = await client.authenticate(
        [credentialKey.id],
        challenge,
        {
          authenticatorType: "auto",
          userVerification: "required",
          timeout: 60000,
        }
      );

      /* client.authenticate() response
        {
          "credentialId":"hq-mnuFjGVNIcSXQFwWvHGLVfWp_uzIbMUvVrGpeEWI",
          "authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2MFAAAAAA==",
          "clientData":"eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiU19vZ25tT2FVNWpITWZPMEtSaWZZNXlkM0RJMm1PeER1SUloUUZZZnJMZyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImNyb3NzT3JpZ2luIjpmYWxzZX0=",
          "signature":"MEYCIQDHyZwHj5JNRDShr3pTUxNAyA2hQuQscWUCBTTPt6fxYgIhAIKoo4r8DHmG8HGtZLfLEHB0wbpYU7u5tbkTzUAwFN6D"
        }
      */

      // backend request simulation
      const authenticationParsed = await loginVerify(
        challenge,
        authData,
        credentialKey
      );

      /* authenticationParsed() response
        {
          "credentialId":"gXpQLAoYA_gRfkR6qsT2cDAwDXCEXpK40RYgKuvFiQs",
          "client":{
              "type":"webauthn.get",
              "challenge":"S_ognmOaU5jHMfO0KRifY5yd3DI2mOxDuIIhQFYfrLg",
              "origin":"http://localhost:3000",
              "crossOrigin":false
          },
          "authenticator":{
              "rpIdHash":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2M=",
              "flags":{
                "userPresent":true,
                "userVerified":true,
                "backupEligibility":false,
                "backupState":false,
                "attestedData":false,
                "extensionsIncluded":false
              },
              "counter":0
          },
          "signature":"MEQCIE7ZFWZF5vzqFGdFXOHjlBYiECSBUQxrfLdH8ACr5eHBAiAkx7ph4PTbuijm-wTkZON3pKZGVq2aW3aO5iZao0zRuQ=="
        }
      */

      // create user operation signature for account abstraction
      const signatureForOnchainValidation = createUserOperationSignature(
        challenge,
        authData,
        credentialKey
      );

      /* createUserOperationSignature() response
        {
          "id":{
              "type":"BigNumber",
              "hex":"0x712d52c553aa57b3b79b5be043263d00d47120ee4a35372ebd4ead1e5ed5800d"
          },
          "r":{
              "type":"BigNumber",
              "hex":"0x900ca1f951b3d1bc0cfa7496e069c7f939247ca14bb91d9c683ba779df82654b"
          },
          "s":{
              "type":"BigNumber",
              "hex":"0xd0ab1cbeb6e457c3fe50c022099c7f1663e19f7f8ce903d7bac7f003c75bd5b5"
          },
          "authData":{
              "0":73,
              ...
          },
          "clientDataPrefix":"{\"type\":\"webauthn.get\",\"challenge\":\"",
          "clientDataSuffix":"\",\"origin\":\"http://localhost:3000\",\"crossOrigin\":false}"
        }
      */

      let encodedSig = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "uint256", "uint256", "bytes", "string", "string"],
        [
          signatureForOnchainValidation.id,
          signatureForOnchainValidation.r,
          signatureForOnchainValidation.s,
          signatureForOnchainValidation.authData,
          signatureForOnchainValidation.clientDataPrefix,
          signatureForOnchainValidation.clientDataSuffix,
        ]
      );

      console.log(encodedSig);
      console.log(JSON.stringify(signatureForOnchainValidation));
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  return (
    <div>
      <h1>Device Authentication</h1>
      <div>
        <label>
          <strong>username:</strong>
          <input
            type="text"
            value={username}
            style={{marginLeft: "10px"}}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
      </div>

      <button onClick={() => handleAuthentication()}>
        Authenticate Device
      </button>
    </div>
  );
}

function LabelWithInput({label, value, onChange}) {
  return (
    <div style={{margin: "10px 0"}}>
      <label>
        <strong>{label}:</strong>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{marginLeft: "10px"}}
        />
      </label>
    </div>
  );
}

export default AuthenticateDevice;
