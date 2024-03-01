import moment from "moment";
import s3 from "./aws-config";
import sharp from "sharp";
import AWS from "aws-sdk";
// Helper tải lên tệp
const uploadFileS3 = async (file :any) => {
    try {
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            throw new Error('Chỉ hỗ trợ tệp ảnh jpg và png');
        }

        // Tạo tên tệp duy nhất
        const uniqueFileName = `${moment().format('MM-YY')}/${Date.now()}_${file.name}`;

        // Chuyển đổi tệp thành webp
        const convertedImage = await sharp(file.data).webp().toBuffer();

        // Tạo thông tin tệp
        const fileParams: AWS.S3.PutObjectRequest = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: uniqueFileName,
            Body: convertedImage,
            ContentType: 'image/webp',
        };

        // Tải lên tệp lên S3
        await s3.upload(fileParams).promise();


        // Trả về đường dẫn tệp đã tải lên
        return uniqueFileName;
    } catch (error) {
        console.error('Lỗi khi tải lên tệp:', error);
        throw error;
    }
};
export default uploadFileS3;