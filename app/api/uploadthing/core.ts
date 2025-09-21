import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f(["image", "pdf"])
    .onUploadComplete(async ({ file }) => {
      return { key: file.key, name: file.name, type: file.type, ufsUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
