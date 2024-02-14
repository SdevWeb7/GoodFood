<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Entity\Recette;
use App\Repository\RecetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

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

   #[Route('/api_delete_recette/{id}', name: "api_delete_recipe", methods: ['POST'])]
   public function delete_recipe(int $id, RecetteRepository $repository, EntityManagerInterface $manager) : JsonResponse {
      $user = $this->getUser();
      $recette = $repository->findOneBy(['id' => $id]);

      if ($recette->getUser() !== $user) {
         return $this->json(['error' => 'Problème d\'utilisateur']);
      }

      if (file_exists($this->getParameter('imagesRecettes') . $recette->getImage())) {
         unlink($this->getParameter('imagesRecettes') . $recette->getImage());
      }

      foreach ($recette->getIngredients() as $ingredient) {
         $manager->remove($ingredient);
      }
      $user->removeRecette($recette);
      $manager->remove($recette);
      $manager->persist($user);
      $manager->flush();

      return $this->json([]);
   }

   #[Route('/api_add_recette', name: "api_add_recipe", methods: ['POST'])]
   public function add_recipe(Request $request, SerializerInterface $serializer, EntityManagerInterface $manager) : JsonResponse {
      $user = $this->getUser();
      if (!$user) {
         return $this->json(['error' => 'Utilisateur introuvable']);
      }
      $recette = $serializer->deserialize($request->request->get("recette"), Recette::class, 'json', ['groups' => 'api:show:recette']);
      $ingredients = json_decode($request->request->get('ingredients'), true);

      foreach ($ingredients as $i) {
         $ingredient = new Ingredient();
         $ingredient->setName($i['name']);
         $ingredient->setQuantity($i['quantity']);
         $recette->addIngredient($ingredient);
         $manager->persist($ingredient);
      }

      $image = $request->files->get("image");
      $fileName = md5(uniqid()) . '.' . $image->guessExtension();
      $image->move($this->getParameter('imagesRecettes'), $fileName);

      $recette->setImage($fileName);
      $user->addRecette($recette);
      $manager->persist($recette);
      $manager->persist($user);
      $manager->flush();

      $this->addFlash('success', 'La recette a bien été ajoutée');
      return $this->json([]);
   }

   #[Route('/api_update_recette', name: "api_update_recipe", methods: ['POST'])]
   public function update_recipe() : JsonResponse {
      return $this->json([]);
   }
}
