
CREATE DATABASE IF NOT EXISTS gestion_clubs;
USE gestion_clubs;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    type_utilisateur ENUM('etudiant', 'admin_club', 'admin_systeme'),
    informations_academiques TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des clubs
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    description TEXT,
    regles TEXT,
    id_admin_club INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_admin_club) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des membres des clubs
CREATE TABLE membres_club (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    club_id INT,
    role_dans_club VARCHAR(50),
    date_adhesion DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- Table des candidatures
CREATE TABLE candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    club_id INT,
    date_candidature DATE,
    statut ENUM('en_attente', 'accepte', 'refuse') DEFAULT 'en_attente',
    commentaire TEXT,
    date_reponse DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- Table des entretiens
CREATE TABLE entretiens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidature_id INT,
    date_entretien DATE,
    heure_entretien TIME,
    lien_rencontre VARCHAR(255),
    commentaire_admin TEXT,
    FOREIGN KEY (candidature_id) REFERENCES candidatures(id) ON DELETE CASCADE
);

-- Table des événements
CREATE TABLE evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT,
    titre VARCHAR(100),
    description TEXT,
    date_evenement DATE,
    heure_evenement TIME,
    lieu VARCHAR(255),
    est_public BOOLEAN DEFAULT FALSE,
    limite_participants INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

-- Table des inscriptions aux événements
CREATE TABLE inscriptions_evenement (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evenement_id INT,
    user_id INT,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evenement_id) REFERENCES evenements(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    contenu TEXT,
    type_notification ENUM('entretien', 'candidature', 'evenement'),
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
