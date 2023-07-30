## cert-req
> Una vez clonado el repositorio, recuerda hacer un npm install para actualizar los paquetes de node.

> También acuerdate de copiar el archivo .env.example a .env y ajustar todas las variables de entorno. En este punto es importante las variables para ajustar los archivos de certificados.

> Para desarrollo, generar autofirmados desde la siguiente página https://regery.com/en/security/ssl-tools/self-signed-certificate-generator

> Y por ultimo, para ejecutar ls ejemplo usar la instrucción *node app.js*  para la página estática y la API y *node cert.js* para iniciar otra instancia de express que implemente la api get-cert la cual requiere validación de certificado de usuario.
