import React, { useState } from 'react';
import { RecipeCategory } from '../types';
import { Search, Menu, X, ChefHat, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onCategorySelect: (category: RecipeCategory) => void;
  onSearch: (query: string) => void;
  selectedCategory: RecipeCategory;
}

export const Navbar: React.FC<NavbarProps> = ({ onCategorySelect, onSearch, selectedCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCategoryClick = (category: RecipeCategory) => {
    onCategorySelect(category);
    setDropdownOpen(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-olive-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleCategoryClick(RecipeCategory.ALL)}>
            <div className="bg-olive-600 p-2 rounded-lg text-white mr-2">
                <ChefHat size={24} />
            </div>
            <span className="font-serif font-bold text-xl text-gray-800">Mediterránea</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-olive-200 rounded-full leading-5 bg-olive-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-olive-500 focus:ring-1 focus:ring-olive-500 sm:text-sm transition-colors duration-200"
                placeholder="Buscar recetas por título o ingredientes..."
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
                onClick={() => handleCategoryClick(RecipeCategory.ALL)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedCategory === RecipeCategory.ALL ? 'text-olive-700 bg-olive-100' : 'text-gray-600 hover:text-olive-600 hover:bg-olive-50'}`}
            >
                Home
            </button>
            
            <div className="relative">
                <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-olive-600 hover:bg-olive-50 transition-colors"
                >
                    Platos <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down">
                        <button
                            onClick={() => handleCategoryClick(RecipeCategory.PRIMERO)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-olive-50 w-full text-left"
                        >
                            Primeros
                        </button>
                        <button
                            onClick={() => handleCategoryClick(RecipeCategory.SEGUNDO)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-olive-50 w-full text-left"
                        >
                            Segundos
                        </button>
                        <button
                            onClick={() => handleCategoryClick(RecipeCategory.POSTRE)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-olive-50 w-full text-left"
                        >
                            Postres
                        </button>
                    </div>
                )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-olive-600 hover:bg-olive-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-4 pb-2">
             <input
                type="text"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 sm:text-sm"
                placeholder="Buscar..."
                onChange={(e) => onSearch(e.target.value)}
              />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => handleCategoryClick(RecipeCategory.ALL)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-olive-700 hover:bg-olive-50 w-full text-left">Home</button>
            <button onClick={() => handleCategoryClick(RecipeCategory.PRIMERO)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-olive-700 hover:bg-olive-50 w-full text-left">Primeros Platos</button>
            <button onClick={() => handleCategoryClick(RecipeCategory.SEGUNDO)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-olive-700 hover:bg-olive-50 w-full text-left">Segundos Platos</button>
            <button onClick={() => handleCategoryClick(RecipeCategory.POSTRE)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-olive-700 hover:bg-olive-50 w-full text-left">Postres</button>
          </div>
        </div>
      )}
    </nav>
  );
};