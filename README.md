# Around the U.S. project on React, featuring authorization and registration.

Entrega de proyecto para el sprint 14 del bootcamp Practicum de Yandex.
Se ocupa React, biblioteca de Javascript para generar esta app, además de CSS para otorgarle diseño.

## Directories

GET `/` - Página principal, si no hay usuario loggeado se redirecciona a `/signin`.
En este endpoint se pueden generar tarjetas, likearlas y eliminar las generadas propias. Además de cambiar nombre, ocupación y foto de perfil del usuario.

GET `/signin` Página para registrar un usuario a través de un correo y una contraseña.

GET `/signup` Página para ingresar con usuario válido generada en el endpoint `/signin`, a partir de la validación de usuario se puede acceder al enpoint `/` con las características principales.

Toda la autorización, registro y solicitud de token van a través del servidor[https://register.nomoreparties.co](https://register.nomoreparties.co/).
