CREATE TABLE "public"."Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."Folder"
ADD CONSTRAINT "Folder_projectId_fkey"
FOREIGN KEY ("projectId")
REFERENCES "public"."Project"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "public"."Folder"
ADD CONSTRAINT "Folder_parentId_fkey"
FOREIGN KEY ("parentId")
REFERENCES "public"."Folder"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "public"."File"
ADD CONSTRAINT "File_projectId_fkey"
FOREIGN KEY ("projectId")
REFERENCES "public"."Project"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "public"."File"
ADD CONSTRAINT "File_folderId_fkey"
FOREIGN KEY ("folderId")
REFERENCES "public"."Folder"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;