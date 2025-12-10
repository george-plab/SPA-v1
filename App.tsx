import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { Recipe, RecipeCategory } from './types';
import { generateRecipes } from './services/geminiService';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>(RecipeCategory.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    const data = await generateRecipes();
    setRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleRateRecipe = (rating: number) => {
    if (!selectedRecipe) return;

    const updatedRecipes = recipes.map(recipe => {
        if (recipe.id === selectedRecipe.id) {
            // Calculate new weighted average
            const newVotes = recipe.votes + 1;
            const newRating = ((recipe.rating * recipe.votes) + rating) / newVotes;
            
            return {
                ...recipe,
                votes: newVotes,
                rating: Number(newRating.toFixed(1)) // Keep one decimal
            };
        }
        return recipe;
    });

    setRecipes(updatedRecipes);
    
    // Update the selected recipe reference so the modal shows the new stats immediately
    const updatedSelectedRecipe = updatedRecipes.find(r => r.id === selectedRecipe.id);
    if (updatedSelectedRecipe) {
        setSelectedRecipe(updatedSelectedRecipe);
    }
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesCategory = selectedCategory === RecipeCategory.ALL || recipe.category.toLowerCase() === selectedCategory.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        recipe.title.toLowerCase().includes(searchLower) || 
        recipe.summary.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchLower));
      
      return matchesCategory && matchesSearch;
    });
  }, [recipes, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-sans">
      <Navbar 
        onCategorySelect={setSelectedCategory} 
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
      />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-olive-900 mb-4">
                Dieta Mediterránea
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre los sabores auténticos del Mediterráneo generados por Inteligencia Artificial.
                Salud, tradición y sabor en cada plato.
            </p>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-olive-600 animate-spin mb-4" />
                <p className="text-olive-700 font-medium animate-pulse">
                    El Chef AI está creando el menú...
                </p>
            </div>
        )}

        {/* Empty/Error State */}
        {!loading && recipes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 mb-4">No se pudieron cargar las recetas en este momento.</p>
                <button 
                    onClick={fetchRecipes}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-olive-600 hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-500"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
                </button>
            </div>
        )}

        {/* Content Grid */}
        {!loading && recipes.length > 0 && (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 capitalize">
                        {selectedCategory === RecipeCategory.ALL ? 'Carta Completa' : 
                         selectedCategory === RecipeCategory.PRIMERO ? 'Primeros Platos' :
                         selectedCategory === RecipeCategory.SEGUNDO ? 'Segundos Platos' : 'Postres'}
                    </h2>
                    <span className="text-sm text-gray-500 bg-olive-50 px-3 py-1 rounded-full">
                        {filteredRecipes.length} recetas encontradas
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map((recipe, index) => (
                        <RecipeCard 
                            key={recipe.id} 
                            recipe={recipe} 
                            onClick={setSelectedRecipe}
                            index={index}
                        />
                    ))}
                </div>

                 {filteredRecipes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron recetas con esos criterios.</p>
                        <button 
                            onClick={() => {setSearchQuery(''); setSelectedCategory(RecipeCategory.ALL);}}
                            className="mt-4 text-olive-600 hover:text-olive-800 font-medium underline"
                        >
                            Ver todas las recetas
                        </button>
                    </div>
                 )}
            </>
        )}
      </main>

      {/* AdSense Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseBanner className="bg-gray-50 border border-gray-200 rounded-lg p-2" />
      </div>

      {/* Modal */}
      {selectedRecipe && (
        <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)}
            onRate={handleRateRecipe}
        />
      )}
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Cocina Mediterránea AI. Generado con Gemini 2.5.
          </p>
      </footer>
    </div>
  );
}