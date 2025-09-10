# Paranoid Vault 

Patch 2.0

--------------------

The CLI-Passworld Managger. 

This is the user manual for the password mannager witch cover the following scripts:

NOTE: Argon2id-based deterministic password derivation and Argon2-based key derivation/auth.

It includes scripts:

- initMaster.js
- storeEntry.js
- getEntry.js
- derivePassword.js (uses Argon2id raw)
- deriveKey.js (AES key derivation with Argon2id raw)
- migrate-to-derivable.js
- backup.js
- db.js

---

(OPTIONAL) DOES NOT INCLUDE 

- .env (create your own secret schema)

```
SECRET_DICT=sol,luna,mar,cafe,brisa,montaña,rio,sombra,fuego,viento,noche,dia,camino,trazo,clave,nexo,puerta,llave,eco,pulso, etc...
SECRET_BLOCKS=lorem,ipsum,example,supersecret, etc... 
```
---
 
#Install

```
  npm install
```
Usage:
* Init Personal Vault
```
  node initMaster.js "MyMasterPassword" 
``` 
* Store Passwords
``` 
node storeEntry.js "site" "Value" "MyMasterPassword" #simple storage
node storeEntry.js "site" "value" "MyMasterPassword" --candado   # store encrypted value
```
* Custom Password Storage  (ajustable length) 
```
  node storeEntry.js "name" "thePassword" "MyMasterPassword" --derivable --site site.example --username user --length 20
```
* Print Stored  Passwords
```
  node getEntry.js 0 "MyMasterPassword" --list
```
* Print Password by id
```
  node getEntry.js id "MyMasterPassword"
```
* Export your Passwords
```
  node backup.js export "MyMasterPassword" backup.json
```
* Import Password
```
  node backup.js import "MyMasterPassword" backup.json
```

Keep your .env and any dict files out of version control.

---

## 📌 Flow Chart Of Implementation
Esta es una explicacion Grafica de como Funciona este Pasword Mannager.
```
┌───────────────┐
│Master Password│
└───────┬───────┘
│
▼
Argon2id Derivation
│
▼
┌──────────────────────────────┐
│ Contraseña derivada final    │ ← Ej: "Do4.J#T;-AEudHlo"
└──────────────────────────────┘
│
▼
Use on the form  website
│
▼
┌──────────────────────────────┐
│ Sitio web hashea y almacena  │
│ (bcrypt, Argon2, PBKDF2...)  │
└──────────────────────────────┘
```
---
**Importante:**  
La contraseña que devuelve el sistema **ya está lista para usarse directamente en el sitio web**.  
No la vuelvas a cifrar ni a hashear antes de ponerla en el formulario, ya que el servicio aplicará su propio proceso interno.

**DISCLAIMER**
The password that Pananoid Returns **Its ready to use directly on the service website** 
Do not encrypt again before using it on the form, because the service its going to apply their internal hasing process
---

## 📂 Entry Sample
```
{
  "id": 2,
  "name": "locker-fb",
  "derived": true,
  "password": "Do4.J#T;-AEudHlo"
}
```
name: únique Identifier of the accaunt (Facebook, Gmail, AWS, etc.).

password: final derived password (safe and ready to use).

derived: enables the script to generate a hash based on your master password.

---
[![License: GPL v3 or later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Project Status: Actively Maintained](https://img.shields.io/badge/Status-Activo-success.svg)](#)
--- 
### BONUS

```
python3 Crack_Aproximation.py
``` 

How it works:

* Detects types of caracters using (minus, mayus, dígits, símbols).

* Calculates the size of the effective charset.

* Estimates entropí in bits.

* Calculates the average time to brake, given  a set of numbers and  tries  per second (gps).

* Returns information in a legible output  (Years, Days, Hours, etc.).

* Con gps = 1e12 (1 billón of tries per second, realist aproximation for an atacker with enought resources  (Hihg-end GPUs and  offline atacks)

Copyright (C) 2025 Santiago Potes Giraldo

The True Unbreakeable Vault. 
- Integrate QKD with your password mannager.
- Use One-Time Pads generated  by quantum tunneling  (perfect encryption).
- Rotation of the  key  automaticaly if detects any  alteration on the qubits.

