import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const CategoryProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(useParams().category);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const categories = ['Electronics', 'Books', 'PYQs', 'Instruments', 'Essentials'];

  // Items from backend
  useEffect(() =>{
    async function fetchProducts() {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/item/get-item-by-category/${selectedCategory}`);
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            console.log(data);
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchProducts();
  },[selectedCategory])

  // Filter products
  useEffect(() => {
    let filtered = products.filter(product => 
      product.category === selectedCategory &&
      (product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);


  const parseImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.warn("imageUrl is null or undefined");
      return [];
    }

    const urlString = Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : imageUrl;

    if (typeof urlString === "string") {
      try {
        let cleanedUrlString = urlString
          .replace(/^"\s*{/, "[") 
          .replace(/}\s*"$/, "]") 
          .replace(/\\"/g, '"') 
          .trim();

        const parsed = JSON.parse(cleanedUrlString);
        console.log("Parsed URLs:", parsed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.warn("JSON parse failed for:", urlString, e.message);
        const urlMatches = urlString.match(/https?:\/\/[^\s"',\]]+/g);
        if (urlMatches && urlMatches.length > 0) {
          console.log("Extracted URLs with regex:", urlMatches);
          return urlMatches;
        }
        console.log("Treating as single URL:", urlString);
        return [urlString];
      }
    }

    if (Array.isArray(urlString)) {
      console.log("imageUrl is already an array:", urlString);
      return urlString;
    }

    console.warn("imageUrl is not a string or array:", urlString);
    return [urlString]; 
  };

  const getFirstImageUrl = (imageUrl) => {
    const parsedUrls = parseImageUrl(imageUrl);
    const firstUrl = parsedUrls.length > 0 ? parsedUrls[0] : "";
    console.log("First image URL:", firstUrl);
    return firstUrl;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F47C26] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF4DC]">
      <Navbar/>   
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full px-14 sm:px-6 lg:px-16 py-4 bg-[#FFF4DC]">
          <div className="flex flex-col w-full md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedCategory} Products
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products available
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-[#F47C26] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C26] focus:border-transparent"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C26] focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#F47C26] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#F47C26] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <img
                  className={`object-cover ${
                    viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
                  }`}
                  src={getFirstImageUrl(product.imageUrl)}
                  alt={product.title}
                  onError={(e) => {
                    console.error("Image load failed for:", product.title, getFirstImageUrl(product.imageUrl));
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
                <div className="p-4 flex-1">
                  <h5 className="text-lg font-semibold text-[#333333] mb-2">
                    {product.title}
                  </h5>
                  <p className="text-[#333333] text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-[#333333] font-semibold text-lg mb-3">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => console.log(`Navigate to /item/${product.id}`)}
                      className="bg-[#F47C26] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm"
                    >
                      Explore This
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;