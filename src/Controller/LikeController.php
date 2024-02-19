<?php

namespace App\Controller;

use App\Entity\Like;
use App\Repository\RecetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LikeController extends AbstractController
{
    #[Route('/api_like/{recetteId}', name: 'app_like')]
    public function index(int $recetteId, RecetteRepository $recetteRepository, EntityManagerInterface $manager): Response
    {
       $user = $this->getUser();
       if (!$user) {
          return $this->json(['error' => 'Il faut être connecté pour pouvoir liker']);
       }
       $recette = $recetteRepository->findOneBy(['id' => $recetteId]);
       if (!$recette) {
          return $this->json(['error' => 'La recette est introuvable']);
       }

       $mustLike = true;
       $likes = $recette->getLikes();
       foreach ($likes as $like) {
         if ($like->getUser()->getEmail() === $user->getEmail()) {
            $user->removeLike($like);
            $recette->removeLike($like);
            $manager->remove($like);
            $mustLike = false;
         }
       }
       if ($mustLike) {
          $like = new Like();
          $user->addLike($like);
          $recette->addLike($like);
          $manager->persist($like);
       }

       $manager->persist($user);
       $manager->persist($recette);
       $manager->flush();

       if ($mustLike) {
         return $this->json(['success' => 'Merci d\'avoir liké !']);
       }
       return $this->json(['info' => 'Nous sommes désolé que vous n\'appréciez pas la recette']);

    }
}
