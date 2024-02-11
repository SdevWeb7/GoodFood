<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240211174951 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE recette ADD COLUMN image VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__recette AS SELECT id, user_id, name, description, duration, process, more FROM recette');
        $this->addSql('DROP TABLE recette');
        $this->addSql('CREATE TABLE recette (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, duration INTEGER NOT NULL, process VARCHAR(255) NOT NULL, more VARCHAR(255) DEFAULT NULL, CONSTRAINT FK_49BB6390A76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO recette (id, user_id, name, description, duration, process, more) SELECT id, user_id, name, description, duration, process, more FROM __temp__recette');
        $this->addSql('DROP TABLE __temp__recette');
        $this->addSql('CREATE INDEX IDX_49BB6390A76ED395 ON recette (user_id)');
    }
}
