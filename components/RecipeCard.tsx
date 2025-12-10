import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, Star } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, index }) => {
  // Use a stable, high-quality food image from picsum if one isn't provided/generated yet
  const displayImage = recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/600/400`;

  return (
    <div 
        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
        onClick={() => onClick(recipe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
            src={displayImage} 
            alt={recipe.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
        />
        <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur text-olive-700 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                {recipe.category}
            </span>
        </div>
        <div className="absolute bottom-3 right-3">
             <div className="flex items-center bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                <Star size={14} className="text-yellow-500 fill-current mr-1" />
                <span className="text-xs font-bold text-gray-800">{recipe.rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-500 ml-1">({recipe.votes})</span>
             </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-olive-700 transition-colors">
            {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
            {recipe.summary}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500 text-xs">
             <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>30-45 min</span>
             </div>
             <div className="flex items-center">
                <Users size={14} className="mr-1" />
                <span>4 pers</span>
             </div>
        </div>
      </div>
    </div>
  );
};