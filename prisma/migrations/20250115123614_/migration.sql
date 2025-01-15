-- CreateTable
CREATE TABLE "LoggedInUser" (
    "id" TEXT NOT NULL,
    "verifiedOtp" BOOLEAN NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LoggedInUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoggedInUser_userId_key" ON "LoggedInUser"("userId");

-- AddForeignKey
ALTER TABLE "LoggedInUser" ADD CONSTRAINT "LoggedInUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
