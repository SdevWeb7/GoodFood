<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class LoginController extends AbstractController
{
   #[Route(path: '/api_login', name: 'api_login', methods: ['POST'])]
   public function apilogin(): JsonResponse
   {
      $this->addFlash('success', 'Vous êtes connecté!');
      return $this->json([]);
   }

   #[Route(path: '/api_me', name: 'api_me', methods: ['POST'])]
   public function me(): JsonResponse
   {
      if (!$this->getUser()) {
         return $this->json([]);
      }

      return $this->json($this->getUser(), 200, [], ['groups' => 'api:show:user']);
   }

   #[Route(path: '/logout', name: 'app_logout')]
   public function logout(): void {}

}