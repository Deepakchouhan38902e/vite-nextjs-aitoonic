import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Sparkles, Bot, Search, Save, Plus, X, LogOut, Upload, Check, Link as LinkIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface EditingItem {
  id?: string;
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  type?: 'tool' | 'category' | 'agent';
  image_url?: string;
  image_alt?: string;
  url?: string;
  category_id?: string;
  capabilities?: string[];
  api_endpoint?: string;
  pricing_type?: string;
  status?: string;
  is_available_24_7?: boolean;
  user_count?: number;
  has_fast_response?: boolean;
  is_secure?: boolean;
  is_featured?: boolean;
  is_verified?: boolean;
  agent_features?: string[];
  how_to_use?: string;
  features?: any[];
  useCases?: any[];
  pricing?: any[];
  [key: string]: any;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tools' | 'categories' | 'agents'>('categories');
  const [items, setItems] = useState<EditingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<EditingItem[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<EditingItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsLoggedIn(true);
          setUser(session.user);
        } else {
          toast.error('Please log in to access the admin panel');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
      } else if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchItems();
      if (activeTab === 'tools') {
        fetchCategories();
      }
    }
  }, [activeTab, isLoggedIn]);

  useEffect(() => {
    // Filter items based on search term
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
        return;
      }
      
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data: items, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching items:', error);
        toast.error(`Failed to fetch ${activeTab}`);
        return;
      }
      
      setItems(items || []);
      setFilteredItems(items || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (item: EditingItem): string | null => {
    if (!item.name?.trim()) return 'Name is required';
    if (!item.description?.trim()) return 'Description is required';
    
    if (activeTab === 'tools') {
      if (!item.url?.trim()) return 'Tool URL is required';
      if (!item.category_id) return 'Category is required';
    }
    
    return null;
  };

  const handleSave = async () => {
    if (!editingItem) return;

    // Validate form
    const validationError = validateForm(editingItem);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);
    try {
      // Prepare base data
      let dataToSave: any = {
        name: editingItem.name?.trim(),
        description: editingItem.description?.trim(),
        seo_title: editingItem.seo_title?.trim() || null,
        seo_description: editingItem.seo_description?.trim() || null,
      };

      // Add specific fields based on type
      if (activeTab === 'tools') {
        dataToSave = {
          ...dataToSave,
          url: editingItem.url?.trim(),
          category_id: editingItem.category_id,
          features: editingItem.features || [],
          useCases: editingItem.useCases || [],
          pricing: editingItem.pricing || [],
          how_to_use: editingItem.how_to_use?.trim() || null,
          image_url: editingItem.image_url?.trim() || null,
          image_alt: editingItem.image_alt?.trim() || null,
        };
      } else if (activeTab === 'agents') {
        dataToSave = {
          ...dataToSave,
          agent_features: editingItem.agent_features?.filter(feature => feature.trim()) || [],
          is_featured: editingItem.is_featured || false,
          is_verified: editingItem.is_verified || false,
          pricing_type: editingItem.pricing_type || 'free',
          image_url: editingItem.image_url?.trim() || null,
          image_alt: editingItem.image_alt?.trim() || null,
          status: 'active',
          capabilities: editingItem.agent_features?.filter(feature => feature.trim()) || [],
        };
      }

      let result;
      if (editingItem.id) {
        // Update existing item
        result = await supabase
          .from(activeTab)
          .update(dataToSave)
          .eq('id', editingItem.id)
          .select();
      } else {
        // Insert new item
        result = await supabase
          .from(activeTab)
          .insert([dataToSave])
          .select();
      }

      if (result.error) {
        console.error('Error saving:', result.error);
        toast.error('Error saving item: ' + result.error.message);
        return;
      }

      toast.success(`${activeTab.slice(0, -1)} saved successfully!`);
      fetchItems();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error saving item');
    } finally {
      setSaving(false);
    }
  };

  const addAgentFeature = () => {
    if (!editingItem) return;
    const agentFeatures = editingItem.agent_features || [];
    setEditingItem({
      ...editingItem,
      agent_features: [...agentFeatures, '']
    });
  };

  const removeAgentFeature = (index: number) => {
    if (!editingItem?.agent_features) return;
    const agentFeatures = [...editingItem.agent_features];
    agentFeatures.splice(index, 1);
    setEditingItem({ ...editingItem, agent_features });
  };

  const updateAgentFeature = (index: number, value: string) => {
    if (!editingItem?.agent_features) return;
    const agentFeatures = [...editingItem.agent_features];
    agentFeatures[index] = value;
    setEditingItem({ ...editingItem, agent_features });
  };

  // Don't render the admin panel if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Toaster position="top-right" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
          <p className="text-slate-400">Please log in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  activeTab === 'categories' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Categories</span>
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  activeTab === 'tools' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Tools</span>
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  activeTab === 'agents' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span>Agents</span>
              </button>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <span className="text-sm">Welcome, {user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="md:col-span-1 card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Items</h2>
              <button
                onClick={() => setEditingItem({ type: activeTab.slice(0, -1) as any })}
                className="p-2 text-primary-500 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>

            {loading ? (
              <div className="text-center text-slate-400">Loading...</div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditingItem(item)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      editingItem?.id === item.id
                        ? 'bg-primary-500/20 border border-primary-500'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      {activeTab === 'agents' && item.is_verified && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{item.description}</p>
                  </button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="text-center text-slate-400 py-8">
                    {searchTerm ? 'No items found matching your search' : 'No items found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Edit Form */}
          <div className="md:col-span-2">
            {editingItem && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {editingItem.id ? 'Edit Item' : 'New Item'}
                  </h2>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary disabled:opacity-50"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
                  </button>
                </div>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={editingItem.name || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                          placeholder="Enter name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                          placeholder="Enter description"
                          required
                        />
                      </div>

                      {/* Tool-specific fields */}
                      {activeTab === 'tools' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Tool URL *
                            </label>
                            <input
                              type="text"
                              value={editingItem.url || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                              placeholder="https://example.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Category *
                            </label>
                            <select
                              value={editingItem.category_id || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                              required
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Image URL
                            </label>
                            <input
                              type="text"
                              value={editingItem.image_url || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </>
                      )}

                      {/* Agent-specific fields */}
                      {activeTab === 'agents' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Pricing Type
                            </label>
                            <select
                              value={editingItem.pricing_type || 'free'}
                              onChange={(e) => setEditingItem({ ...editingItem, pricing_type: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                            >
                              <option value="free">Free</option>
                              <option value="freemium">Freemium</option>
                              <option value="paid">Paid</option>
                            </select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editingItem.is_featured || false}
                                onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                                className="rounded"
                              />
                              <span className="text-slate-300">Featured</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={editingItem.is_verified || false}
                                onChange={(e) => setEditingItem({ ...editingItem, is_verified: e.target.checked })}
                                className="rounded"
                              />
                              <span className="text-slate-300">Verified (Blue Tick)</span>
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              Image URL
                            </label>
                            <input
                              type="text"
                              value={editingItem.image_url || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="border-t border-slate-600 pt-6">
                    <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          SEO Title
                          <span className="text-xs text-slate-400 ml-2">(60 characters max)</span>
                        </label>
                        <input
                          type="text"
                          value={editingItem.seo_title || ''}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 60);
                            setEditingItem({ ...editingItem, seo_title: value });
                          }}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                          placeholder="SEO optimized title"
                        />
                        <div className="text-xs text-slate-400 mt-1">
                          {(editingItem.seo_title?.length || 0)}/60 characters
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          SEO Description
                          <span className="text-xs text-slate-400 ml-2">(160 characters max)</span>
                        </label>
                        <textarea
                          value={editingItem.seo_description || ''}
                          onChange={(e) => {
                            const value = e.target.value.slice(0, 160);
                            setEditingItem({ ...editingItem, seo_description: value });
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                          placeholder="SEO optimized description"
                        />
                        <div className="text-xs text-slate-400 mt-1">
                          {(editingItem.seo_description?.length || 0)}/160 characters
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Features (for agents) */}
                  {activeTab === 'agents' && (
                    <div className="border-t border-slate-600 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Features</h3>
                        <button
                          onClick={addAgentFeature}
                          className="text-primary-500 hover:text-primary-400"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {editingItem.agent_features?.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateAgentFeature(index, e.target.value)}
                              placeholder="Enter feature"
                              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                            />
                            <button
                              onClick={() => removeAgentFeature(index)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;