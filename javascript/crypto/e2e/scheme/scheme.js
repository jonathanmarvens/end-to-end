// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Defines an encryption or signing scheme.
 */

goog.provide('e2e.scheme.Scheme');



/**
 * @typedef {{then: function(...):e2e.scheme.CryptoPromise_,
 *     catch: function(...):e2e.scheme.CryptoPromise_}}
 * @private
 */
e2e.scheme.CryptoPromise_;


/**
 * Crypto scheme for encryption or signing.
 * @constructor
 */
e2e.scheme.Scheme = function() {
  this.useWebCrypto = this.useWebCrypto && e2e.scheme.Scheme.USE_WEB_CRYPTO;
  this.useHardwareCrypto = this.useHardwareCrypto &&
    e2e.scheme.Scheme.USE_HARDWARE_CRYPTO;
  if (this.useWebCrypto && 'crypto' in goog.global) {
    this.crypto = goog.global.crypto;
    if ('subtle' in this.crypto) {
      this.crypto = this.crypto.subtle;
    }
    this.useWebCrypto = 'encrypt' in this.crypto;
  }
};

/**
 * @define {boolean} Whether to use webcrypto when available.
 */
e2e.scheme.Scheme.USE_WEB_CRYPTO = true;

/**
 * @define {boolean} Whether to use a hardware device for crypto when available.
 */
e2e.scheme.Scheme.USE_HARDWARE_CRYPTO = false;

/**
 * Crypto object as used by the Scheme.
 * @type {{encrypt: function(...):e2e.scheme.CryptoPromise_,
 *     decrypt: function(...):e2e.scheme.CryptoPromise_}}
 */
e2e.scheme.Scheme.prototype.crypto;


/**
 * @param {e2e.ByteArray} plaintext
 * @return {!e2e.async.Result.<e2e.cipher.ciphertext.CipherText>}
 */
e2e.scheme.Scheme.prototype.encrypt = function(plaintext) {
  if (this.useWebCrypto) {
    return this.encryptWebCrypto(plaintext);
  } else {
    return this.encryptJavaScript(plaintext);
  }
};


/**
 * @param {e2e.cipher.ciphertext.CipherText} ciphertext
 * @return {!e2e.async.Result.<e2e.ByteArray>}
 */
e2e.scheme.Scheme.prototype.decrypt = function(ciphertext) {
  if (this.useWebCrypto) {
    return this.decryptWebCrypto(ciphertext);
  } else {
    return this.decryptJavaScript(ciphertext);
  }
};


/**
 * JavaScript implementation of the scheme.
 * @param {e2e.ByteArray} plaintext
 * @return {!e2e.async.Result.<e2e.cipher.ciphertext.CipherText>}
 */
e2e.scheme.Scheme.prototype.encryptJavaScript;


/**
 * WebCrypto implementation of the scheme.
 * @param {e2e.ByteArray} plaintext
 * @return {!e2e.async.Result.<e2e.cipher.ciphertext.CipherText>}
 */
e2e.scheme.Scheme.prototype.encryptWebCrypto;


/**
 * JavaScript implementation of the scheme.
 * @param {e2e.cipher.ciphertext.CipherText} ciphertext
 * @return {!e2e.async.Result.<e2e.ByteArray>}
 */
e2e.scheme.Scheme.prototype.decryptJavaScript;


/**
 * WebCrypto implementation of the scheme.
 * @param {e2e.cipher.ciphertext.CipherText} ciphertext
 * @return {!e2e.async.Result.<e2e.ByteArray>}
 */
e2e.scheme.Scheme.prototype.decryptWebCrypto;
