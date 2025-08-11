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
derivePassword.js
- Uses argon2id (raw output) to derive bytes from (master + info) and maps bytes to a password string.
- Requires `argon2` npm package.
*/
const argon2 = require('argon2');

async function deriveBytesArgon2(master, info, outLen = 64, opts = {}) {
  // use info as salt (utf8)
  const salt = Buffer.from(info, 'utf8');
  const timeCost = opts.timeCost || 3; // iterations
  const memoryCost = opts.memoryCost || 1 << 16; // 65536 KiB (~64 MiB)
  const parallelism = opts.parallelism || 1;
  const hashLength = outLen;

  // argon2.hash with raw: true returns Buffer
  const buf = await argon2.hash(master, {
    type: argon2.argon2id,
    salt,
    timeCost,
    memoryCost,
    parallelism,
    hashLength,
    raw: true
  });
  return Buffer.from(buf);
}

function bytesToPassword(bytes, length = 16, charset = null) {
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIGITS = '0123456789';
  const SYMBOLS = '!@#$%&*()-_=+[]{};:,.<>?';
  if (!charset) charset = LOWER + UPPER + DIGITS + SYMBOLS;
  const passChars = [];
  for (let i = 0; i < length; i++) {
    const idx = bytes[i] % charset.length;
    passChars.push(charset[idx]);
  }
  if (length >= 4) {
    passChars[0] = UPPER[ bytes[length + 0] % UPPER.length ];
    passChars[1] = LOWER[ bytes[length + 1] % LOWER.length ];
    passChars[2] = DIGITS[ bytes[length + 2] % DIGITS.length ];
    passChars[3] = SYMBOLS[ bytes[length + 3] % SYMBOLS.length ];
  }
  return passChars.join('');
}

async function derivePassword(master, site, username = '', options = {}) {
  const version = options.version || 'v1';
  const counter = options.counter || 1;
  const length = options.length || 16;
  const iters = options.timeCost || 3;
  const mem = options.memoryCost || (1<<16);
  const info = `${site}|${username}|${version}|${counter}`;
  const bytes = await deriveBytesArgon2(master, info, Math.max(64, length + 16), { timeCost: iters, memoryCost: mem, parallelism: options.parallelism || 1 });
  return bytesToPassword(bytes, length, options.charset);
}

module.exports = { derivePassword };
