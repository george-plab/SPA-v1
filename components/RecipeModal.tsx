import React, { useState } from 'react';
import { Recipe } from '../types';
import { X, Sparkles, ChefHat, Flame, ImagePlus, Star } from 'lucide-react';
import { generateRecipeImage } from '../services/geminiService';
import { AdSenseBanner } from './AdSenseBanner';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onRate: (rating: number) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onRate }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [userHasRated, setUserHasRated] = useState(false);

  if (!recipe) return null;

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    const newImage = await generateRecipeImage(recipe.title);
    if (newImage) {
        setGeneratedImage(newImage);
    }
    setIsGeneratingImage(false);
  };

  const handleRate = (score: number) => {
    if (!userHasRated) {
        onRate(score);
        setUserHasRated(true);
    }
  };

  const currentImage = generatedImage || recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/800/600`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" 
            aria-hidden="true" 
            onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Hero Image Section */}
          <div className="relative h-64 sm:h-80 bg-gray-200">
             <img 
                src={currentImage} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-24">
                <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold tracking-wider text-white uppercase bg-olive-600 rounded-md">
                    {recipe.category}
                </span>
                <div className="flex justify-between items-end">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white shadow-sm">
                        {recipe.title}
                    </h2>
                    
                    {/* Rating display in header */}
                    <div className="hidden sm:flex flex-col items-end text-white">
                        <div className="flex items-center space-x-1">
                            <Star className="fill-yellow-400 text-yellow-400 w-6 h-6" />
                            <span className="text-2xl font-bold">{recipe.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs opacity-80">{recipe.votes} votos</span>
                    </div>
                </div>
             </div>
             
             {/* AI Image Generation Button */}
             <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white text-olive-800 text-xs font-bold py-2 px-3 rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
             >
                {isGeneratingImage ? (
                    <Sparkles className="animate-spin w-4 h-4 text-purple-600" />
                ) : (
                    <ImagePlus className="w-4 h-4" />
                )}
                {isGeneratingImage ? 'Generando...' : 'Crear Foto AI'}
             </button>
          </div>

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            
            {/* Rating Mobile (visible only on small screens) */}
            <div className="sm:hidden flex items-center justify-between mb-6 bg-olive-50 p-4 rounded-lg">
                <span className="font-bold text-gray-700">Valoración media:</span>
                <div className="flex items-center space-x-1">
                    <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />
                    <span className="text-xl font-bold text-gray-800">{recipe.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({recipe.votes})</span>
                </div>
            </div>

            <p className="text-gray-600 italic text-lg mb-8 border-l-4 border-olive-400 pl-4">
                {recipe.fullDescription || recipe.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div className="bg-olive-50 p-6 rounded-xl">
                    <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 font-serif">
                        <ChefHat className="mr-2 text-olive-600" /> Ingredientes
                    </h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex items-start text-gray-700 text-sm">
                                <span className="h-2 w-2 mt-1.5 mr-2 rounded-full bg-olive-400 flex-shrink-0"></span>
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Steps */}
                <div>
                    <h3 className="flex items-center text-xl font-bold text-gray-800 mb-4 font-serif">
                        <Flame className="mr-2 text-orange-500" /> Elaboración
                    </h3>
                    <ol className="space-y-6">
                        {recipe.steps.map((step, idx) => (
                            <li key={idx} className="relative pl-6">
                                <span className="absolute left-0 top-0 text-3xl font-serif font-bold text-olive-200 -z-10 leading-none">
                                    {idx + 1}
                                </span>
                                <p className="text-gray-700 text-sm pt-1 leading-relaxed">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Banner Publicidad Pequeño */}
            <div className="mt-8 flex justify-center">
                <div className="w-full max-w-lg">
                    <p className="text-[10px] text-center text-gray-300 mb-1 uppercase tracking-widest">Publicidad</p>
                    <AdSenseBanner format="horizontal" slotId="8765432109" className="bg-gray-50 min-h-[90px]" />
                </div>
            </div>

            {/* Voting Section */}
            <div className="mt-6 border-t border-gray-200 pt-8">
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                    <h4 className="text-lg font-bold text-gray-700 mb-2">
                        {userHasRated ? '¡Gracias por tu voto!' : '¿Qué te ha parecido esta receta?'}
                    </h4>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                disabled={userHasRated}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleRate(star)}
                                className={`transition-transform duration-200 ${userHasRated ? 'cursor-default' : 'hover:scale-110'}`}
                            >
                                <Star 
                                    className={`w-8 h-8 ${
                                        star <= (hoverRating || (userHasRated ? recipe.rating : 0)) // Logic: Show hover, or if rated show rating
                                            ? 'fill-yellow-400 text-yellow-400' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            </button>
                        ))}
                    </div>
                    {userHasRated && (
                        <p className="text-green-600 text-sm mt-2 animate-fade-in">
                            Voto registrado correctamente
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                    Cerrar Receta
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};