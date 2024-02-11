<?php

namespace App\DataFixtures;

use App\Entity\Recette;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class RecettesFixtures extends Fixture
{
   public function __construct (private readonly UserPasswordHasherInterface $hasher) {}

   public function load(ObjectManager $manager): void
    {
        $user = new User();
        $user->setEmail('a@a.fr');
        $user->setPassword($this->hasher->hashPassword($user, 'aaaaaa'));

        for ($i = 1 ; $i < 15 ; $i++) {
           $recette = new Recette();
           $recette->setName('Salade de '.$i);
           $recette->setDescription('Voici une grande description pour tester un petit peu'.$i);
           $recette->setProcess('Le process est un peu long car il faut tout expliquer'.$i);
           $recette->setDuration($i);

           if ($i % 2 === 0) {
              $user->addRecette($recette);
           }
           $manager->persist($recette);
        }

        $manager->persist($user);
        $manager->flush();
    }
}
