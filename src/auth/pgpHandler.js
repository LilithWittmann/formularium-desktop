// import exsisting pub/priv key and set it up with the key backend
const openpgp = require("openpgp");

const keytar = require("keytar");

class PGPClient {
  constructor() {
    this.privateKey = null;
    this.publicKey = null;
  }

  async createNewKeypair(user, passphrase) {
    const key = await openpgp.generateKey({
      userIds: [{ name: user.name, email: user.email }], // you can pass multiple user IDs
      rsaBits: 4096, // RSA key size
      passphrase: passphrase // protects the private key
    });

    return await this.importKey(
      key.publicKeyArmored,
      key.privateKeyArmored,
      passphrase
    );
  }

  async loadKey(passphrase) {
    let privateEncryptedKeyStr = await keytar.getPassword(
      "formularium",
      "privateKey"
    );
    console.log(privateEncryptedKeyStr);
    let privateEncryptedKey = await openpgp.readArmoredKeys([
      privateEncryptedKeyStr
    ]);
    console.log(privateEncryptedKey);
    let unlocked = await openpgp.decryptKey({
      privateKey: privateEncryptedKey,
      passphrase: passphrase
    });
    console.log(unlocked);
    console.log(unlocked.isDecrypted());
    this.privateKey = unlocked;
    this.publicKey = await keytar.getPassword("formularium", "publicKey");
    return true;
  }

  getPublicKey() {
    return this.publicKey;
  }

  isKeyActive() {
    if (this.privateKey !== null) {
      return true;
    }
  }

  async decrypt(message) {
    const plaintext = await openpgp.decrypt({
      message: await openpgp.readArmoredMessage(message), // parse armored message
      privateKeys: this.privateKey // for decryption
    });

    return plaintext;
  }

  async importKey(publicKey, privateKey, passphrase) {
    await keytar.setPassword("formularium", "publicKey", publicKey);

    await keytar.setPassword("formularium", "privateKey", privateKey);

    console.log("stored");

    await this.loadKey(passphrase);

    return this.publicKey;
  }

  preloadBindings() {
    var that = this;
    return {
      createNewKeypair(user, passphrase) {
        return that.createNewKeypair(user, passphrase);
      },
      loadKey(passphrase) {
        return that.loadKey(passphrase);
      },
      importKey(publicKey, privateKey, passphrase) {
        return that.importKey(publicKey, privateKey, passphrase);
      },
      getPublicKey() {
        return that.getPublicKey();
      },
      isKeyActive() {
        return that.isKeyActive();
      },
      decrypt(message) {
        return that.decrypt(message);
      }
    };
  }
}

export default PGPClient;
