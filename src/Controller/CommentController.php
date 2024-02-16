<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Repository\RecetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CommentController extends AbstractController
{
    #[Route('/api_comment/{recetteId}', name: 'app_comment', methods: ['POST'])]
    public function index(int $recetteId, EntityManagerInterface $manager, RecetteRepository $recetteRepository, Request $request): Response
    {
       $user = $this->getUser();
       if (!$user) {
          return $this->json(['error' => 'Il faut être connecté pour pouvoir commenter']);
       }
       $recette = $recetteRepository->findOneBy(['id' => $recetteId]);
       if ($recette) {
          $comment = new Comment();
          $comment->setContent($request->getContent());
          $recette->addComment($comment);
          $user->addComment($comment);
          $manager->persist($comment);
          $manager->persist($recette);
          $manager->persist($user);
          $manager->flush();
       }

        return $this->json(['success' => 'Merci votre commentaire a bien été ajouté']);
    }
}
