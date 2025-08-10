const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  `${process.env.GOOGLE_DRIVE_CLIENT_ID}`,
  `${process.env.GOOGLE_DRIVE_CLIENT_SECRET}`,
  'http://localhost:3000'  // Solo para obtener el token
);


/* console.log(`clientId: ${process.env.GOOGLE_DRIVE_CLIENT_ID}`);
console.log(`clientSecret: ${process.env.GOOGLE_DRIVE_CLIENT_SECRET}`); */

const scopes = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata'
];

/* const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',  // ¡IMPORTANTE! Para obtener refresh_token
  scope: scopes
}); */

console.log('Visita esta URL y autoriza la aplicación:');
/* console.log(url); */
console.log('\n📋 IMPORTANTE: Después de autorizar, localhost fallará (es normal)');
console.log('🔗 Copia el CÓDIGO de la URL que aparece después de "code="');
console.log('📝 Luego descomenta las líneas de abajo y pega el código:\n');

// PASO 2: Descomenta estas líneas y pega tu código aquí:
const authCode = '4/0AVMBsJj_2BB7sXz-6vsFhCWbSs15AM68qsdXjIctKnglbhw6VRlA5kgu6bNYOFsFWRG_gg&scope=https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/drive.metadata';

oauth2Client.getToken(authCode, (err, token) => {
  if (err) {
    console.error('❌ Error obteniendo token:', err);
    return;
  }
  console.log('🎉 ¡Token obtenido exitosamente!');
  console.log('📝 Agrega esta línea a tu archivo .env:');
  console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${token.refresh_token}`);
});