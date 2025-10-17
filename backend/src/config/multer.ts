import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const ensureDirectoryExists = (directory: string) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const diagnosticStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = path.join('uploads', 'patient/diagnostics');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const patientId = req.params.patientId || 'unknown';
    const timestamp = Date.now();
    const randomString = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);

    const filename = `diagnostic-${patientId}-${timestamp}-${randomString}${ext}`;
    cb(null, filename);
  },
});

const diagnosticFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];

  const allowedExtensions = /pdf|jpg|jpeg|png/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(
    new Error(`
       Tipo de archivo no permitido. Solo se permiten: PDF, JPEG, PNG, recibido ${file.mimetype}
      `)
  );
};

const uploadDiagnostic = multer({
  storage: diagnosticStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter: diagnosticFileFilter,
});

export default {
  uploadSingle: uploadDiagnostic.single('document'),
  uploadMultiple: uploadDiagnostic.array('documents', 5),
};
