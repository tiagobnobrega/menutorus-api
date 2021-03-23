-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lang" (
    "id" VARCHAR(10) NOT NULL,
    "title" VARCHAR(100) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "priceUnit" VARCHAR(6) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "businessId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuSection" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "displayMode" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "menuSectionId" INTEGER NOT NULL,
    "abstract" VARCHAR(80),
    "details" VARCHAR(500),
    "enabled" BOOLEAN NOT NULL,
    "price" DOUBLE PRECISION,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemIcon" (
    "id" SERIAL NOT NULL,
    "uri" VARCHAR(1000) NOT NULL,
    "contentType" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItemMedia" (
    "id" SERIAL NOT NULL,
    "mainMedia" BOOLEAN NOT NULL,
    "contentType" TEXT NOT NULL,
    "uri" VARCHAR(200) NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeRestriction" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSpan" (
    "id" SERIAL NOT NULL,
    "timeRestrictionId" INTEGER NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "excludeHolidays" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LangToMenu" (
    "A" VARCHAR(10) NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuSectionToTimeRestriction" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuItemToMenuItemIcon" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeRestriction.code_unique" ON "TimeRestriction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_LangToMenu_AB_unique" ON "_LangToMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_LangToMenu_B_index" ON "_LangToMenu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuSectionToTimeRestriction_AB_unique" ON "_MenuSectionToTimeRestriction"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuSectionToTimeRestriction_B_index" ON "_MenuSectionToTimeRestriction"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuItemToMenuItemIcon_AB_unique" ON "_MenuItemToMenuItemIcon"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuItemToMenuItemIcon_B_index" ON "_MenuItemToMenuItemIcon"("B");

-- AddForeignKey
ALTER TABLE "Menu" ADD FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuSection" ADD FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD FOREIGN KEY ("menuSectionId") REFERENCES "MenuSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItemMedia" ADD FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSpan" ADD FOREIGN KEY ("timeRestrictionId") REFERENCES "TimeRestriction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LangToMenu" ADD FOREIGN KEY ("A") REFERENCES "Lang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LangToMenu" ADD FOREIGN KEY ("B") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuSectionToTimeRestriction" ADD FOREIGN KEY ("A") REFERENCES "MenuSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuSectionToTimeRestriction" ADD FOREIGN KEY ("B") REFERENCES "TimeRestriction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToMenuItemIcon" ADD FOREIGN KEY ("A") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuItemToMenuItemIcon" ADD FOREIGN KEY ("B") REFERENCES "MenuItemIcon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
