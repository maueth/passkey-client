import {BigNumber, ethers} from "ethers";
import {utils} from "@passwordless-id/webauthn";
import {AsnParser} from "@peculiar/asn1-schema";
import {ECDSASigValue} from "@peculiar/asn1-ecc";
import base64url from "base64url";

export const createUserOperationSignature = (
  challenge,
  authData,
  credentialKey
) => {
  const signature = getMessageSignature(authData.signature);

  /* getMessageSignature() response 
    [
      {
          "type":"BigNumber",
          "hex":"0x1370c5a196e98d1799b00d6cce635e8ca18b32a1f8f238074174d6272f3d8e5e"
      },
      {
          "type":"BigNumber",
          "hex":"0xd220be7d6b1f7080d295687cc5e7915c0ccce5364639ec47203668f2c0148fd0"
      }
    ]
  */

  const clientDataJSON = new TextDecoder().decode(
    utils.parseBase64url(authData.clientData)
  );

  /* clientDataJSON
    {
      "type":"webauthn.get",
      "challenge":"S_ognmOaU5jHMfO0KRifY5yd3DI2mOxDuIIhQFYfrLg",
      "origin":"http://localhost:3000",
      "crossOrigin":false
    }
  */

  /* 36 */
  const challengePos = clientDataJSON.indexOf(challenge);

  /* {"type":"webauthn.get","challenge":" */
  const challengePrefix = clientDataJSON.substring(0, challengePos);

  /* ","origin":"http://localhost:3000","crossOrigin":false} */
  const challengeSuffix = clientDataJSON.substring(
    challengePos + challenge.length
  );

  const authenticatorData = new Uint8Array(
    utils.parseBase64url(authData.authenticatorData)
  );

  return {
    id: BigNumber.from(
      ethers.utils.keccak256(new TextEncoder().encode(credentialKey.id))
    ),
    r: signature[0],
    s: signature[1],
    authData: authenticatorData,
    clientDataPrefix: challengePrefix,
    clientDataSuffix: challengeSuffix,
  };
};

const getMessageSignature = (authResponseSignature) => {
  const parsedSignature = AsnParser.parse(
    base64url.toBuffer(authResponseSignature),
    ECDSASigValue
  );

  let rBytes = new Uint8Array(parsedSignature.r);
  let sBytes = new Uint8Array(parsedSignature.s);

  if (shouldRemoveLeadingZero(rBytes)) {
    rBytes = rBytes.slice(1);
  }

  if (shouldRemoveLeadingZero(sBytes)) {
    sBytes = sBytes.slice(1);
  }

  // r and s values
  return [BigNumber.from(rBytes), BigNumber.from(sBytes)];
};

function shouldRemoveLeadingZero(bytes) {
  return bytes[0] === 0x0 && (bytes[1] & (1 << 7)) !== 0;
}
