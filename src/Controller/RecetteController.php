<?php

namespace App\Controller;

use App\Repository\RecetteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RecetteController extends AbstractController
{
   #[Route('/api_mes_recettes', name: 'api_mes_recettes')]
   public function myRecipes(RecetteRepository $repository): Response
   {
      $recettes = $repository->findBy(['user' => $this->getUser()]);

      return $this->json($recettes, 200, [], ['groups' => 'api:show:recettes']);
   }

   #[Route('/api_recettes/{page}/{perPage}', name: 'api_recettes')]
   public function recipes(RecetteRepository $repository, int $page, int $perPage): Response
   {
      $offset = ($page-1) * $perPage;
      $recettes = $repository->findBy([], [], $perPage, $offset);
      $totalCount = $repository->createQueryBuilder('r')
         ->select('COUNT(r.id)')
         ->getQuery()
         ->getSingleScalarResult();

      return $this->json(['recettes' => $recettes, 'totalRecettes' => $totalCount], 200, [], ['groups' => 'api:show:recettes']);
   }
}
