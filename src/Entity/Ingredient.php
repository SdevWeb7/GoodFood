<?php

namespace App\Entity;

use App\Repository\IngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: IngredientRepository::class)]
class Ingredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'string')]
    #[Assert\Length(min: 2, max: 30)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $name = null;

   #[ORM\Column(type: 'string')]
   #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
   private ?string $quantity = null;

   #[ORM\ManyToOne(inversedBy: 'ingredients')]
   #[Groups(['api:show:user', 'api:show:ingredient'])]
   private ?Recette $recette = null;


   public function getId(): ?int
    {
        return $this->id;
    }


   public function getName () : ?string {
      return $this -> name;
   }

   public function setName (?string $name) : self {
      $this -> name = $name;
      return $this;
   }

   public function getQuantity () : ?string {
      return $this -> quantity;
   }

   public function setQuantity (?string $quantity) : self {
      $this -> quantity = $quantity;
      return $this;
   }

   public function getRecette(): ?Recette
   {
       return $this->recette;
   }

   public function setRecette(?Recette $recette): static
   {
       $this->recette = $recette;

       return $this;
   }


}
