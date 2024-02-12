<?php

namespace App\Controller;

use App\Repository\RecetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RecetteController extends AbstractController
{
   #[Route('/api_recettes/{page}/{perPage}', name: 'api_recettes')]
   public function recipes(RecetteRepository $repository, int $page, int $perPage): Response
   {
      $offset = ($page-1) * $perPage;
      $recettes = $repository->findBy([], [], $perPage, $offset);
      $totalCount = $repository->createQueryBuilder('r')
         ->select('COUNT(r.id)')
         ->getQuery()
         ->getSingleScalarResult();

      return $this->json(['recettes' => $recettes, 'totalRecettes' => $totalCount], 200, [], ['groups' => 'api:show:recette']);
   }

   #[Route('/api_mes_recettes/{page}/{perPage}', name: 'api_mes_recettes')]
   public function my_recipes(RecetteRepository $repository, int $page, int $perPage): Response
   {
      if (!$this->getUser()) return $this->json([]);

      $offset = ($page-1) * $perPage;
      $recettes = $repository->findBy(['user' => $this->getUser()], [], $perPage, $offset);
      $totalCount = $repository->count(['user' => $this->getUser()]);

      return $this->json(['recettes' => $recettes, 'totalRecettes' => $totalCount], 200, [], ['groups' => 'api:show:recette']);
   }

   #[Route('/api_recette/{id}', name: "api_recette_details", methods: ['POST'])]
   public function recipe_details(int $id, RecetteRepository $repository) : JsonResponse {

      $recette = $repository->findOneBy(['id' => $id]);
      return $this->json($recette, 200, [], ['groups' => 'api:show:recette']);
   }

   #[Route('/api_add_recette', name: "api_add_recipe", methods: ['POST'])]
   public function add_recipe() : JsonResponse {
      return $this->json([]);
   }

   #[Route('/api_update_recette', name: "api_update_recipe", methods: ['POST'])]
   public function update_recipe() : JsonResponse {
      return $this->json([]);
   }

   #[Route('/api_delete_recette/{id}', name: "api_delete_recipe", methods: ['POST'])]
   public function delete_recipe(int $id, RecetteRepository $repository, EntityManagerInterface $manager) : JsonResponse {
      $user = $this->getUser();
      $recette = $repository->findOneBy(['id' => $id]);

      if ($recette->getUser() !== $user) {
         return $this->json(['error' => 'Problème d\'utilisateur']);
      }
      $user->removeRecette($recette);
      $manager->remove($recette);
      $manager->flush();

      $this->addFlash('success', 'La recette a bien été supprimée');
      return $this->json([]);
   }
}
