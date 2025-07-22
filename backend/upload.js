import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno primero
dotenv.config();

const folderId = process.env.DRIVE_FOLDER_ID;

const __dirname = fileURLToPath (import.meta.url);
const __filename = path.dirname(__dirname);

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const filePath = path.join(__dirname, '../src/assets/imgs/logoDev.png');

async function uploadFile(req, res) {
    try{
        const response = await drive.files.create({
            requestBody: {
                name: "LogoDev.png",
                mimeType: 'image/png',
                parents: [folderId],
                media: {
                    mimeType: 'image/png',
                    body: fs.createReadStream(filePath)
                },
                fields: "id",
            }
        });
        console.log(response.data);

    } catch(error) {
        console.error('Error in uploadFile:', error);
        res.status(500).send('Internal Server Error');
        return;
    }
}

async function createPublicUrl() {
    try {
        const response = await drive.permissions.create({
            fileId: "1zKsHheQUIVU_UO3PKDsSorwgRzuqgsqR",
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        const result = await drive.files.get({
            fileId: "1zKsHheQUIVU_UO3PKDsSorwgRzuqgsqR",
            fields: 'webViewLink, webContentLink',
        });
        console.log('Permission response:', response.data);
        console.log('File links:', result.data);
    } catch (error) {
        console.error('Error in createPublicUrl:', error);
        throw new Error('Failed to create public URL');
    }
}

async function createFolder() {
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  
  const fileMetadata = {
    name: 'ApriDrive-Test',
    mimeType: 'application/vnd.google-apps.folder',
  };
  try {
    const file = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });
    console.log('Folder Id:', file.data.id);
    return file.data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

uploadFile();
/* createFolder(); */
/* createPublicUrl(); */