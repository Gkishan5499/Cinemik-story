'use client';

import { useState, useEffect } from 'react';
import { categoriesAPI } from '@/lib/api';

interface CategorySelectorProps {
  onCategorySelect: (category: string) => void;
  defaultCategory?: string;
  allowCustom?: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

export default function CategorySelector({
  onCategorySelect,
  defaultCategory = 'Horror',
  allowCustom = true,
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryDesc, setCustomCategoryDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.list();
      setCategories(response.categories || []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    onCategorySelect(categoryName);
    setShowCustomInput(false);
  };

  const handleCreateCustomCategory = async () => {
    if (!customCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesAPI.create({
        name: customCategoryName,
        description: customCategoryDesc,
      });
      
      setCategories([...categories, response.category]);
      handleCategorySelect(customCategoryName);
      setCustomCategoryName('');
      setCustomCategoryDesc('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <label className='block text-gray-400 text-sm font-medium mb-3'>
        Category
      </label>

      {loading ? (
        <div className='text-gray-400 text-sm'>Loading categories...</div>
      ) : (
        <>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mb-4'>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`px-3 py-2 rounded border-2 transition text-sm ${
                  selectedCategory === cat.name
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-gray-600 hover:border-gray-500 text-gray-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {allowCustom && (
            <div className='mt-4 pt-4 border-t border-gray-700'>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className='text-red-400 hover:text-red-300 text-sm font-medium'
              >
                {showCustomInput ? '✕ Close' : '+ Create Custom Category'}
              </button>

              {showCustomInput && (
                <div className='mt-3 p-3 bg-gray-900/50 rounded border border-gray-700'>
                  <input
                    type='text'
                    placeholder='Category name'
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 mb-2'
                  />
                  <textarea
                    placeholder='Description (optional)'
                    value={customCategoryDesc}
                    onChange={(e) => setCustomCategoryDesc(e.target.value)}
                    rows={2}
                    className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 mb-2'
                  />
                  <button
                    onClick={handleCreateCustomCategory}
                    disabled={loading || !customCategoryName.trim()}
                    className='w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded text-white text-sm font-medium transition'
                  >
                    Create Category
                  </button>
                </div>
              )}
            </div>
          )}

          {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        </>
      )}
    </div>
  );
}
