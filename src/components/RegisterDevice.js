import React, {useState} from "react";
import {client} from "@passwordless-id/webauthn";
import {registerVerification} from "../backend";
import {createChallenge} from "../utils/UserOperation.ts";

function RegisterDevice() {
  const [challenge, setChallenge] = useState(createChallenge());
  const [authenticatorType, setAuthenticatorType] = useState("publicKey");
  const [username, setUsername] = useState("test");
  const [timeout, setTimeoutValue] = useState("30 seconds");
  const [userVerification, setUserVerification] = useState("required");
  const [attestation, setAttestation] = useState("direct");
  const [debug, setDebug] = useState("true");

  let registration;

  const handleRegister = async () => {
    try {
      registration = await client.register(username, challenge, {
        authenticatorType: authenticatorType,
        userVerification: userVerification,
        timeout: 60000,
        attestation: attestation === "true",
        userHandle: "recommended to set it to a random 64 bytes value",
        debug: debug === "true",
      });

      /* client.register() response
        {
          "username":"test",
          "credential":{
              "id":"hZ9SNljA2KuWYCao_DVWqTM6pZocyeHG0UlystcApqM",
              "publicKey":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE0NCLbSORtcokPh-78ZTxUyb6xsidrxenQwI3SBy-GQmQQX1y1dNBQihRQ7PfBzFHvE4n9a2nZE7eylf_rrm7Fw==",
              "algorithm":"ES256"
          },
          "authenticatorData":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAAK3OAAI1vMYKZIsLJfHwVQMAIIWfUjZYwNirlmAmqPw1VqkzOqWaHMnhxtFJcrLXAKajpQECAyYgASFYINDQi20jkbXKJD4fu_GU8VMm-sbIna8Xp0MCN0gcvhkJIlggkEF9ctXTQUIoUUOz3wcxR7xOJ_Wtp2RO3spX_665uxc=",
          "clientData":"eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiU19vZ25tT2FVNWpITWZPMEtSaWZZNXlkM0RJMm1PeER1SUloUUZZZnJMZyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImNyb3NzT3JpZ2luIjpmYWxzZX0="
        }
      */

      // backend request simulation
      const registerData = await registerVerification(challenge, registration);

      /* registerVerification() response
        {
          "username":"test",
          "credential":{
              "id":"tZNBKaz7sOmGdbwlWLLUWXcJFrrY6icQ7ex77uGLuws",
              "publicKey":"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEXfn-aqCkn1XP2_1cXXLy_XZjEsupdEU-MkhkmqhFK6b_Ztfx2oNHqWV7-qGZBlAUFyeAMG59iyMjRRlsOCBBig==",
              "algorithm":"ES256"
          },
          "client":{
              "type":"webauthn.create",
              "challenge":"S_ognmOaU5jHMfO0KRifY5yd3DI2mOxDuIIhQFYfrLg",
              "origin":"http://localhost:3001",
              "crossOrigin":false
          },
          "authenticator":{
              "rpIdHash":"SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2M=",
              "flags":{
                "userPresent":true,
                "userVerified":true,
                "backupEligibility":false,
                "backupState":false,
                "attestedData":true,
                "extensionsIncluded":false
              },
              "counter":0,
              "aaguid":"adce0002-35bc-c60a-648b-0b25f1f05503"
          },
          "attestation":null
        }
      */
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="App">
      <h1>Device Registration</h1>
      <div>
        <LabelWithInput
          label="Username"
          value={username}
          onChange={setUsername}
        />
        <LabelWithInput
          label="Challenge"
          value={challenge}
          onChange={setChallenge}
        />
        <LabelWithInput
          label="authenticatorType"
          value={authenticatorType}
          onChange={setAuthenticatorType}
        />
        <LabelWithInput
          label="Timeout"
          value={timeout}
          onChange={setTimeoutValue}
        />
        <LabelWithInput
          label="userVerification"
          value={userVerification}
          onChange={setUserVerification}
        />
        <LabelWithInput label="debug" value={debug} onChange={setDebug} />
        <LabelWithInput
          label="attestation"
          value={attestation}
          onChange={setAttestation}
        />
      </div>
      <button onClick={() => handleRegister()}>Register Device</button>
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

export default RegisterDevice;
