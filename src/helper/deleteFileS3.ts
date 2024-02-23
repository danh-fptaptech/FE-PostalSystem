import { json } from "stream/consumers";
import s3 from "./aws-config";
const deleteFileS3 = async (file:string) => {
    try {
        const fileParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || '',
            Key: file
        };
        await s3.deleteObject(fileParams).promise();
        return JSON.stringify({message:"Xoá file thành công", status:"ok"});
    }
    catch (error) {
        console.error('Lỗi khi xóa tệp:', error);
        return JSON.stringify({message:"Xoá file thành công", status:"fail"});
    }
}
export default deleteFileS3;