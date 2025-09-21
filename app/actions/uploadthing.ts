"use server";

import { UTApi } from "uploadthing/server";


export async function deleteFileByKey(key: string) {
    const utapi = new UTApi();
    const res = await utapi.deleteFiles(key);
    if (!("success" in res) || !res.success) {
        throw new Error("UploadThing delete failed");
    }
    return res;
}