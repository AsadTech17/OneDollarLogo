import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import auth from '../middleware/auth.js';
import admin from '../firebaseAdmin.js';

const cloudinaryV2 = cloudinary.v2;

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        const acceptedTypes = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2', 'pdf'];
        const ext = file.originalname.split('.').pop().toLowerCase();

        if (!acceptedTypes.includes(ext)) {
            return cb(new Error(`File type ${ext} not accepted`));
        }

        cb(null, true);
    }
});

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


router.post('/upload-brand-files', auth, upload.single('file'), async (req, res) => {
    try {
        const { uid } = req.user;
        const { useCase } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        if (!useCase) {
            return res.status(400).json({
                success: false,
                message: 'Use case is required'
            });
        }

        const sessionId = req.body.sessionId || uuidv4();

        const cloudinaryPath = `1dollarlogo/brand-references/${uid}/${sessionId}`;

        const uploadStream = cloudinaryV2.uploader.upload_stream(
            {
                folder: cloudinaryPath,
                resource_type: 'auto',
                public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload file to cloud storage'
                    });
                }

                try {
                    const fileMetadata = {
                        id: result.public_id,
                        name: req.file.originalname,
                        size: req.file.size,
                        type: req.file.mimetype,
                        url: result.secure_url,
                        cloudinaryId: result.public_id,
                        useCase: useCase,
                        uploadedAt: new Date().toISOString(),
                        sessionId: sessionId
                    };

                    const userRef = admin.firestore().collection('users').doc(uid);
                    const userDoc = await userRef.get();

                    if (!userDoc.exists) {
                        await userRef.set({
                            uploadedFiles: [fileMetadata],
                            createdAt: new Date()
                        });
                    } else {
                        await userRef.update({
                            uploadedFiles: admin.firestore.FieldValue.arrayUnion(fileMetadata)
                        });
                    }

                    res.status(200).json({
                        success: true,
                        message: 'File uploaded successfully',
                        data: fileMetadata
                    });
                } catch (firestoreError) {
                    console.error('Firestore error:', firestoreError);
                    res.status(500).json({
                        success: false,
                        message: 'File uploaded but database save failed',
                        error: firestoreError.message
                    });
                }
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
});

router.get('/brand-files/:uid', auth, async (req, res) => {
    try {
        const { uid } = req.params;

        if (req.user.uid !== uid) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const userRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const uploadedFiles = userDoc.data().uploadedFiles || [];

        res.status(200).json({
            success: true,
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Fetch files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch uploaded files',
            error: error.message
        });
    }
});


router.delete('/brand-files/:uid/:fileId', auth, async (req, res) => {
    try {
        const { uid, fileId } = req.params;

        if (req.user.uid !== uid) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const userRef = admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const uploadedFiles = userDoc.data().uploadedFiles || [];
        const fileToDelete = uploadedFiles.find(f => f.id === fileId);

        if (!fileToDelete) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        try {
            await cloudinary.uploader.destroy(fileToDelete.cloudinaryId);
        } catch (cloudError) {
            console.error('Cloudinary delete error:', cloudError);
        }

        const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
        await userRef.update({
            uploadedFiles: updatedFiles
        });

        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete file',
            error: error.message
        });
    }
});

export default router;
