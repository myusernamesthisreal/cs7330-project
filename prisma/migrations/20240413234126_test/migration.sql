-- CreateTable
CREATE TABLE `Degree` (
    `name` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`, `level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `courseNumber` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isCore` BOOLEAN NOT NULL,

    PRIMARY KEY (`courseNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DegreeCourses` (
    `degreeName` VARCHAR(191) NOT NULL,
    `degreeLevel` VARCHAR(191) NOT NULL,
    `courseNumber` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`degreeName`, `degreeLevel`, `courseNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Instructor` (
    `id_number` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `sectionNumber` VARCHAR(191) NOT NULL,
    `courseNumber` VARCHAR(191) NOT NULL,
    `instructorId` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `num_students` INTEGER NOT NULL,

    PRIMARY KEY (`sectionNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningObjective` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseObjective` (
    `courseNumber` VARCHAR(191) NOT NULL,
    `learningObjectiveId` INTEGER NOT NULL,

    PRIMARY KEY (`courseNumber`, `learningObjectiveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseEvaluation` (
    `learningObjectiveId` INTEGER NOT NULL,
    `sectionNumber` VARCHAR(191) NOT NULL,
    `degreeName` VARCHAR(191) NOT NULL,
    `degreeLevel` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `paragraph` VARCHAR(191) NOT NULL,
    `numAs` INTEGER NOT NULL,
    `numBs` INTEGER NOT NULL,
    `numCs` INTEGER NOT NULL,
    `numFs` INTEGER NOT NULL,

    PRIMARY KEY (`learningObjectiveId`, `sectionNumber`, `degreeName`, `degreeLevel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DegreeCourses` ADD CONSTRAINT `DegreeCourses_degreeName_degreeLevel_fkey` FOREIGN KEY (`degreeName`, `degreeLevel`) REFERENCES `Degree`(`name`, `level`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DegreeCourses` ADD CONSTRAINT `DegreeCourses_courseNumber_fkey` FOREIGN KEY (`courseNumber`) REFERENCES `Course`(`courseNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_courseNumber_fkey` FOREIGN KEY (`courseNumber`) REFERENCES `Course`(`courseNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `Instructor`(`id_number`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseObjective` ADD CONSTRAINT `CourseObjective_courseNumber_fkey` FOREIGN KEY (`courseNumber`) REFERENCES `Course`(`courseNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseObjective` ADD CONSTRAINT `CourseObjective_learningObjectiveId_fkey` FOREIGN KEY (`learningObjectiveId`) REFERENCES `LearningObjective`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseEvaluation` ADD CONSTRAINT `CourseEvaluation_learningObjectiveId_fkey` FOREIGN KEY (`learningObjectiveId`) REFERENCES `LearningObjective`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseEvaluation` ADD CONSTRAINT `CourseEvaluation_sectionNumber_fkey` FOREIGN KEY (`sectionNumber`) REFERENCES `Section`(`sectionNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseEvaluation` ADD CONSTRAINT `CourseEvaluation_degreeName_degreeLevel_fkey` FOREIGN KEY (`degreeName`, `degreeLevel`) REFERENCES `Degree`(`name`, `level`) ON DELETE RESTRICT ON UPDATE CASCADE;
