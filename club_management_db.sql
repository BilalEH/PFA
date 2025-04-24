
-- Création de la base de données
CREATE DATABASE ClubManagement;
USE ClubManagement;

-- Table Utilisateur
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('utilisateur', 'candidat', 'adminClub', 'adminSysteme') DEFAULT 'utilisateur',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Club
CREATE TABLE Club (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Candidature
CREATE TABLE Candidature (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    club_id INT,
    date_candidature TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'acceptee', 'refusee') DEFAULT 'en_attente',
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (club_id) REFERENCES Club(id)
);

-- Table Evenement
CREATE TABLE Evenement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT,
    titre VARCHAR(150),
    description TEXT,
    date_evenement DATE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES Club(id)
);

-- Table InscriptionEvenement
CREATE TABLE InscriptionEvenement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    evenement_id INT,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (evenement_id) REFERENCES Evenement(id)
);

-- Table Notification (facultative si système de notification)
CREATE TABLE Notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    message TEXT,
    date_notification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur(id)
);
