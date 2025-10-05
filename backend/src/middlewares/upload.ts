import multer from 'multer';
import path from 'path';

// Storage en memoria - procesaremos el buffer sin escribir a disco
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) => {
    const allowed = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Tipo de archivo no permitido'));
    }
    cb(null, true);
  }
});
