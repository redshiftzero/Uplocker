/* encrypt-file.js
* This contains the glue for openpgp.js to encrypt a file.
*/


// References to key material to encrypt the file with.
var pubkey =
    `-----BEGIN PGP PUBLIC KEY BLOCK-----
-----END PGP PUBLIC KEY BLOCK-----`;


var privkey =
    `-----BEGIN PGP PRIVATE KEY BLOCK-----
-----END PGP PRIVATE KEY BLOCK-----`;


var passphrase = "";


// Takes a Uint8Array encoded file and returns it encrypted as an Uint8Array
async function encryptFile(inputFile)
{
    var encrypted, options;

    options = {
        message: openpgp.message.fromBinary(inputFile),
        publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
        armor: false
    };

    return openpgp.encrypt(options).then(function(ciphertext) {
        encrypted = ciphertext.message.packets.write();
        return encrypted;
    });
}


// Takes a string and returns it encrypted
async function encryptString(inputString)
{
    var encrypted, options;

    options = {
        message: openpgp.message.fromText(inputString),
        publicKeys: (await openpgp.key.readArmored(pubkey)).keys
    };

    return openpgp.encrypt(options).then(function(ciphertext) {
        encrypted = ciphertext.data;
        return encrypted;
    });
}


// File decryption. This is only here for test purposes.
async function decryptFile(encrypted)
{
    let privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0];
    await privKeyObj.decrypt(passphrase);

    const options = {
        message: await openpgp.message.read(encrypted),
        privateKeys: privKeyObj,
        armor: false
    };

    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data;
    });
}


// String decryption. This is only here for test purposes.
async function decryptString(encrypted)
{
    let privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0];
    await privKeyObj.decrypt(passphrase);

    const options = {
        message: await openpgp.message.readArmored(encrypted),
        privateKeys: privKeyObj
    };

    return openpgp.decrypt(options).then(plaintext => {
        return plaintext.data;
    });
}


// Helper functions to load the key parameters
function loadPublicKey(publicKey) {
    pubkey = publicKey;
}


function loadPrivateKey(privateKey) {
    privkey = privateKey;
}


function loadPassphrase(keyPassphrase) {
    passphrase = keyPassphrase;
}
