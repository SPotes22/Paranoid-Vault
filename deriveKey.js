/*
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * Este archivo hace parte de Paranoid Vault.
 * Copyright (C) 2025  Santiago Potes Giraldo
 *
 * Este programa es software libre: puede redistribuirlo y/o modificarlo
 * bajo los términos de la Licencia Pública General de GNU publicada por
 * la Free Software Foundation, ya sea la versión 3 de la Licencia, o
 * (a su elección) cualquier versión posterior.
 *
 * Este programa se distribuye con la esperanza de que sea útil,
 * pero SIN GARANTÍA ALGUNA; ni siquiera la garantía implícita
 * de COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
 * Consulte la Licencia Pública General de GNU para más detalles.
 *
 * Debería haber recibido una copia de la Licencia Pública General de GNU
 * junto con este programa. En caso contrario, consulte <https://www.gnu.org/licenses/>.
 */

/*
deriveKey.js
- Derives AES-256-GCM key from master password and stored encSalt using argon2 (raw).
*/
const argon2 = require('argon2');

async function deriveKey(masterPassword, encSaltHex) {
  const salt = Buffer.from(encSaltHex, 'hex');
  // parameters: timeCost, memoryCost, parallelism, hashLength
  const keyBuf = await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    timeCost: 3,
    memoryCost: 1<<16,
    parallelism: 1,
    hashLength: 32,
    raw: true
  });
  return Buffer.from(keyBuf);
}

module.exports = { deriveKey };
