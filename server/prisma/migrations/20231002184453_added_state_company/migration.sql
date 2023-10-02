-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "website" TEXT,
    "applicationDate" DATETIME,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Company" ("applicationDate", "createdAt", "description", "id", "location", "name", "userId", "website") SELECT "applicationDate", "createdAt", "description", "id", "location", "name", "userId", "website" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
CREATE INDEX "user_id_index" ON "Company"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
