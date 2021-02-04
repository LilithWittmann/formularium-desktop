// import exsisting pub/priv key and set it up with the key backend

import * as kbpgp from "kbpgp";

const keytar = require("keytar");
const { promisify } = require("util");

class PGPClient {
  constructor() {
    this.pgpKey = null;
  }

  async createNewKeypair(user, passphrase) {
    let key = await kbpgp.KeyManager.generate_rsa({
      userid: "Bo Jackson <user@example.com>"
    });

    return await this.importKey(
      await key.export_pgp_public(),
      await key.export_pgp_private(),
      passphrase
    );
  }

  async loadKey(passphrase) {
    let privateEncryptedKeyStr = await keytar.getPassword(
      "formularium",
      "privateKey"
    );

    let that = this;

    await kbpgp.KeyManager.import_from_armored_pgp(
      {
        armored: await keytar.getPassword("formularium", "publicKey")
      },
      function(err, imported) {
        imported.merge_pgp_private(
          {
            armored: privateEncryptedKeyStr
          },
          function(err) {
            console.log(err);
            imported.unlock_pgp(
              {
                passphrase: passphrase
              },
              function(err) {
                console.log(err);
                let ring = new kbpgp.keyring.KeyRing();
                ring.add_key_manager(imported);
                console.log(ring);
                that.pgpKey = ring;
              }
            );
          }
        );
      }
    );

    return true;
  }

  getPublicKey() {
    return this.publicKey;
  }

  isKeyActive() {
    if (this.pgpKey !== null) {
      return true;
    }
    return false;
  }

  async decrypt(message) {
    const aunbox = promisify(kbpgp.unbox).bind(kbpgp);
    let plaintext = await aunbox({ keyfetch: this.pgpKey, armored: message });
    console.log(plaintext[0].toString());
    return plaintext[0].toString();
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
