<?php

namespace App\Entity;

use App\Repository\IngredientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

   #[ORM\ManyToMany(targetEntity: Recette::class, mappedBy: 'ingredients')]
   #[Groups(['api:show:ingredient'])]
   private Collection $recettes;

   public function __construct()
   {
       $this->recettes = new ArrayCollection();
   }


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

   /**
    * @return Collection<int, Recette>
    */
   public function getRecettes(): Collection
   {
       return $this->recettes;
   }

   public function addRecette(Recette $recette): static
   {
       if (!$this->recettes->contains($recette)) {
           $this->recettes->add($recette);
           $recette->addIngredient($this);
       }

       return $this;
   }

   public function removeRecette(Recette $recette): static
   {
       if ($this->recettes->removeElement($recette)) {
           $recette->removeIngredient($this);
       }

       return $this;
   }




}
