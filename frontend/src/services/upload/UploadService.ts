import supabase from "@/utils/supabase";

const BUCKET = "images";

/**
 * Uploads a file to Supabase Storage.
 * @param file - The file to upload
 * @param fileName - The name to save the file as (without path)
 * @param folderName - The folder inside the bucket (e.g. "room")
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
    file: File,
    fileName: string,
    folderName: string,
): Promise<string> {
    const path = `${folderName}/${fileName}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });

    if (error) {
        console.error("Error uploading image:", error);
        throw error;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Removes a file from Supabase Storage.
 * @param fileName - The name of the file (without path)
 * @param folderName - The folder inside the bucket (e.g. "room")
 */
export async function removeImage(
    fileName: string,
    folderName: string,
): Promise<void> {
    const path = `${folderName}/${fileName}`;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);

    if (error) {
        console.error("Error removing image:", error);
        throw error;
    }
}
