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


    #[ORM\ManyToOne(inversedBy: 'recettes')]
    #[Groups(['api:show:recette', 'api:show:ingredient'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:show:user', 'api:show:recette', 'api:show:ingredient', 'api:show:like', 'api:show:comment'])]
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

    #[ORM\OneToMany(targetEntity: Like::class, mappedBy: 'recette', orphanRemoval: true)]
    #[Groups(['api:show:recette'])]
    private Collection $likes;

    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'Recette', orphanRemoval: true)]
    #[Groups(['api:show:recette'])]
    private Collection $comments;

    #[ORM\OneToMany(targetEntity: Ingredient::class, mappedBy: 'recette')]
    #[Groups(['api:show:recette'])]
    private Collection $ingredients;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, Like>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(Like $like): static
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
            $like->setRecette($this);
        }

        return $this;
    }

    public function removeLike(Like $like): static
    {
        if ($this->likes->removeElement($like)) {
            // set the owning side to null (unless already changed)
            if ($like->getRecette() === $this) {
                $like->setRecette(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setRecette($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getRecette() === $this) {
                $comment->setRecette(null);
            }
        }

        return $this;
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
            $ingredient->setRecette($this);
        }

        return $this;
    }

    public function removeIngredient(Ingredient $ingredient): static
    {
        if ($this->ingredients->removeElement($ingredient)) {
            if ($ingredient->getRecette() === $this) {
                $ingredient->setRecette(null);
            }
        }

        return $this;
    }
}
