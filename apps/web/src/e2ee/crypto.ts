import sodium from 'libsodium-wrappers-sumo';

export const generateKeyPair = async () => {
  await sodium.ready;
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey),
    privateKey: sodium.to_base64(keyPair.privateKey),
  };
};

export const encryptMessage = async (
  message: string,
  publicKey: string,
  privateKey: string
) => {
  await sodium.ready;
  const pk = sodium.from_base64(publicKey);
  const sk = sodium.from_base64(privateKey);
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const encrypted = sodium.crypto_box_easy(
    message,
    nonce,
    pk,
    sk
  );
  return {
    encryptedMessage: sodium.to_base64(encrypted),
    nonce: sodium.to_base64(nonce),
  };
};

export const decryptMessage = async (
  encryptedMessage: string,
  nonce: string,
  publicKey: string,
  privateKey: string
) => {
  await sodium.ready;
  const em = sodium.from_base64(encryptedMessage);
  const n = sodium.from_base64(nonce);
  const pk = sodium.from_base64(publicKey);
  const sk = sodium.from_base64(privateKey);
  const decrypted = sodium.crypto_box_open_easy(
    em,
    n,
    pk,
    sk
  );
  return sodium.to_utf8(decrypted);
};