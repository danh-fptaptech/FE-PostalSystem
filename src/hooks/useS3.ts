/*
import {useCallback} from "react";
import uploadFileS3 from "@/helper/uploadFileS3";
import deleteFileS3 from "@/helper/deleteFileS3";
import {toast} from "sonner";

const useS3 = () => {
    const uploadFile = useCallback(async (file: any) => {
        try {
            return await uploadFileS3(file);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading file');
        }
    }, []);

    const deleteFile = useCallback(async (file: string) => {
        try {
            return await deleteFileS3(file);
        } catch (error) {
            console.error('Error deleting file:', error);
            toast.error('Error deleting file');
        }
    }, []);

    return { uploadFile, deleteFile };
};
export default useS3;*/
