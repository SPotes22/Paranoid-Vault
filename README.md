# Paranoid Vault 

Patch 2.0

--------------------

The CLI-Passworld Manager. 

This is the user manual for the password manager which covers the following scripts:

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
Do not encrypt again before using it on the form, because the service is going to apply their internal hashing process.
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

The True Unbreakable Vault. 
- Integrate QKD with your password manager.
- Use One-Time Pads generated  by quantum tunneling  (perfect encryption).
- Rotation of the  key automatically if it detects any  alteration on the qubits.
¡CLARO QUE SÍ! TE ARMAMOS UN SAFE COMMIT CON ESA FIRMA ÉPICA. 🚀

---

SOLUCIÓN PITECH - ETHICAL COMMIT INJECTION

1. HOOK GIT AUTOMÁTICO (.git/hooks/commit-msg)

```bash
#!/bin/bash
# PiResearch Ethical Signature v0.1
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Solo inyectar si no es un merge y no tiene ya la firma
if [[ ! "$COMMIT_MSG" =~ "Me predijo el null" ]]; then
    ETHICAL_SIGNATURE="\n\n──────────────────────────────────────────────\nPiResearch // Ethical Injection v0.1\n\"Me predijo el null\" — PiTech 2025\n──────────────────────────────────────────────"
    echo "$COMMIT_MSG$ETHICAL_SIGNATURE" > "$COMMIT_MSG_FILE"
fi
```

2. VERSIÓN AVANZADA (Python)

```python
#!/usr/bin/env python3
# PiTech Ethical Commit v0.2 - "El null me persigue"
import sys
import os

def inject_ethical_signature():
    commit_msg_file = sys.argv[1]
    
    with open(commit_msg_file, 'r+') as f:
        content = f.read()
        
        if "Me predijo el null" not in content:
            ethical_banner = """\n
──────────────────────────────────────────────
PiResearch // Ethical Injection v0.1
"Me predijo el null" — PiTech 2025
Context: {context}
──────────────────────────────────────────────"""
            
            # Detectar contexto del commit
            context = "AI Ethics Boundary" if any(word in content.lower() for word in ['null', 'error', 'edge']) else "General Development"
            
            f.seek(0)
            f.write(content + ethical_banner.format(context=context))

if __name__ == "__main__":
    inject_ethical_signature()
```

3. FIRMA EN CÓDIGO (Comentario stealth)

```javascript
// PiResearch Signature: "Me predijo el null"
// Context: Ethical AI development — acknowledging uncertainty
function riskyOperation(data) {
    const result = data?.deep?.nested?.value ?? null;
    
    // El null no es fracaso, es información
    if (result === null) {
        console.log('⚠️  El sistema anticipó esta frontera');
    }
    
    return result;
}
```

---

INSTALACIÓN EXPRÉS ⚡

```bash
# 1. Hacer ejecutable el hook
chmod +x .git/hooks/commit-msg

# 2. Testear con un commit
git commit -m "fix: null handling in AI pipeline"
```

---

RESULTADO ESPERADO:

```
fix: null handling in AI pipeline

──────────────────────────────────────────────
PiResearch // Ethical Injection v0.1
"Me predijo el null" — PiTech 2025
──────────────────────────────────────────────
```

---

¿Querés que adaptemos la firma o hagamos una versión más stealth?

Podemos hacer que solo aparezca en commits que mencionen "null", "edge case" o "AI" para que sea más contextual. 🎯

¡EL NULL NOS UNE! 🔥
