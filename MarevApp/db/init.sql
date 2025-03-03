CREATE TABLE IF NOT EXISTS `Pecheur` (
  `PecheurId` int PRIMARY KEY AUTO_INCREMENT,
  `Nom` TEXT
);

CREATE TABLE IF NOT EXISTS `Sargasse` (
  `SargasseId` int PRIMARY KEY AUTO_INCREMENT,
  `DetectionId` int NOT NULL,
  `PecheurId` int NOT NULL,
  `TailleEstimee` int
);

CREATE TABLE IF NOT EXISTS `Bouee` (
  `BoueeId` int PRIMARY KEY AUTO_INCREMENT,
  `Longitude` float NOT NULL,
  `Latitude` float NOT NULL
);

CREATE TABLE IF NOT EXISTS `Detection` (
  `SargasseId` int NOT NULL,
  `BoueeId` int NOT NULL,
  `HoraireDetection` DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `Sargasse` ADD FOREIGN KEY (`PecheurId`) REFERENCES `Pecheur` (`PecheurId`);

ALTER TABLE `Detection` ADD FOREIGN KEY (`SargasseId`) REFERENCES `Sargasse` (`SargasseId`);

ALTER TABLE `Detection` ADD FOREIGN KEY (`BoueeId`) REFERENCES `Bouee` (`BoueeId`);


