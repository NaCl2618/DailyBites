/**
 * RecipeCard Component
 *
 * Displays a recipe card in the my-recipes list
 */

'use client';

import { SavedRecipe } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Clock, ChefHat, Baby, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface RecipeCardProps {
  recipe: SavedRecipe;
  onDelete?: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/my-recipes/${recipe._id}`}>
        <div className="relative w-full h-48">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/my-recipes/${recipe._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-500 transition-colors line-clamp-2">
            {recipe.title}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.cookingTime}분
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <ChefHat className="w-3 h-3" />
            {difficultyLabels[recipe.difficulty]}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Baby className="w-3 h-3" />
            {recipe.ageRange}
          </Badge>
        </div>

        {recipe.userNote && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{recipe.userNote}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-2">
          {recipe.ingredients.slice(0, 4).map((ingredient, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {ingredient.name}
            </span>
          ))}
          {recipe.ingredients.length > 4 && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              +{recipe.ingredients.length - 4}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/my-recipes/${recipe._id}`}>자세히 보기</Link>
        </Button>
        {onDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm('이 레시피를 삭제하시겠습니까?')) {
                onDelete(recipe._id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
