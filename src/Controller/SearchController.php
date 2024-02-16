<?php

namespace App\Controller;

use App\Repository\RecetteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SearchController extends AbstractController
{
    #[Route('/api_search_recette/{name}', name: 'app_search')]
    public function index(string $name, RecetteRepository $recetteRepository): Response
    {
        $recettes = $recetteRepository->createQueryBuilder('r')
          ->andWhere('r.name LIKE :name')
          ->setParameter('name', '%'.$name.'%')
          ->setMaxResults(8)
          ->getQuery()
          ->getResult();

        return $this->json($recettes, 200, [], ['groups' => 'api:show:recette']);
    }
}
