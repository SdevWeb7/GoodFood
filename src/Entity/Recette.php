<?php

namespace App\Entity;

use App\Repository\RecetteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RecetteRepository::class)]
#[UniqueEntity(fields: ['name'], message: 'Cette recettes existe déjà.')]
class Recette
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api:show:user', 'api:show:recette', "api:show:ingredient"])]
    private ?int $id = null;

    #[ORM\ManyToMany(targetEntity: Ingredient::class, inversedBy: 'recettes')]
    #[Groups(['api:show:user', 'api:show:recette'])]
    private Collection $ingredients;

    #[ORM\ManyToOne(inversedBy: 'recettes')]
    #[Groups(['api:show:recette', 'api:show:ingredient'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?int $duration = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $process = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $more = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient'])]
    private ?string $image = null;

    public function __construct()
    {
        $this->ingredients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Ingredient>
     */
    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    public function addIngredient(Ingredient $ingredient): static
    {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
        }

        return $this;
    }

    public function removeIngredient(Ingredient $ingredient): static
    {
        $this->ingredients->removeElement($ingredient);

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function getProcess(): ?string
    {
        return $this->process;
    }

    public function setProcess(string $process): static
    {
        $this->process = $process;

        return $this;
    }

    public function getMore(): ?string
    {
        return $this->more;
    }

    public function setMore(?string $more): static
    {
        $this->more = $more;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }
}
