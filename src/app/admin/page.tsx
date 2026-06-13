"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Plus, 
  Loader2, 
  Trash2, 
  Edit,
  X,
  Upload
} from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
  razorpay_payment_id: string;
}

type Tab = "overview" | "products" | "orders";

const CATEGORIES = ["Seating", "Tables", "Storage", "Lighting", "Decor"];

// Add your secure admin email(s) here (Must match the one in your profile page)
const ADMIN_EMAILS = ["vserva2006@gmail.com"];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isLoading, setIsLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Add Product Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "Seating"
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // THE BOUNCER: Kick them to login if no session
      if (!session) {
        router.push("/login");
        return;
      }

      // THE VIP LIST: Kick them to the catalog if their email is not on the admin list
      const currentUserEmail = session.user.email || "";
      const isAuthorized = ADMIN_EMAILS.some(
        email => email.toLowerCase().trim() === currentUserEmail.toLowerCase().trim()
      );

      if (!isAuthorized) {
        router.push("/catalog"); 
        return;
      }
      
      // Fetch Products
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsData) setProducts(productsData);

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersData) setOrders(ordersData);

      setIsLoading(false);
    };

    fetchAdminData();
  }, [router]);

  // Handle adding a new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 2. Insert Product Data into Database
      const { data, error: insertError } = await supabase
        .from("products")
        .insert([
          { 
            name: newItem.name, 
            price: parseFloat(newItem.price), 
            category: newItem.category, 
            image_url: imageUrl 
          }
        ])
        .select();

      if (insertError) throw insertError;

      // 3. Update the UI instantly
      if (data) {
        setProducts([data[0], ...products]);
      }
      
      // Close Modal and Reset Form
      setIsAddModalOpen(false);
      setNewItem({ name: "", price: "", category: "Seating" });
      setImageFile(null);

    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please ensure your Supabase Storage bucket 'product-images' is set to Public.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto relative">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white border border-zinc-100 p-6 rounded-sm sticky top-28">
          <h2 className="text-xs uppercase tracking-widest font-medium text-zinc-400 mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${activeTab === "overview" ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-50"}`}>
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${activeTab === "products" ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-50"}`}>
              <Package className="w-4 h-4" /> Products
            </button>
            <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-sm ${activeTab === "orders" ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-50"}`}>
              <ShoppingCart className="w-4 h-4" /> Orders
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-medium tracking-tight text-zinc-900 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white border border-zinc-100 p-6 rounded-sm">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Total Revenue</p>
                <p className="text-3xl font-medium text-zinc-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-zinc-100 p-6 rounded-sm">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Total Orders</p>
                <p className="text-3xl font-medium text-zinc-900">{totalOrders}</p>
              </div>
              <div className="bg-white border border-zinc-100 p-6 rounded-sm">
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Active Products</p>
                <p className="text-3xl font-medium text-zinc-900">{totalProducts}</p>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="bg-white border border-zinc-100 rounded-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
              <h1 className="text-lg font-medium tracking-tight text-zinc-900">Product Catalog</h1>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 relative bg-zinc-100 rounded-sm overflow-hidden flex-shrink-0">
                          {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
                        </div>
                        <span className="font-medium text-zinc-900">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{product.category}</td>
                      <td className="px-6 py-4 text-zinc-900">₹{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-zinc-400 hover:text-black mr-3 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-light">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white border border-zinc-100 rounded-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-white">
              <h1 className="text-lg font-medium tracking-tight text-zinc-900">Recent Orders</h1>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900">
                        {order.razorpay_payment_id ? order.razorpay_payment_id.replace('pay_', '') : order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{order.customer_email}</td>
                      <td className="px-6 py-4 text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-zinc-900">₹{order.total_amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-medium rounded-sm">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-light">No orders have been placed yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-sm shadow-xl p-6 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-medium tracking-tight text-zinc-900 mb-6">Add New Product</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium text-zinc-500 mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                  placeholder="e.g. The Apex Chair"
                />
              </div>

              {/* Price & Category Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest font-medium text-zinc-500 mb-1">Price (₹)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                    placeholder="25000"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs uppercase tracking-widest font-medium text-zinc-500 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full border border-zinc-200 px-3 py-2 text-sm focus:border-black focus:ring-0 outline-none transition-colors bg-white"
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium text-zinc-500 mb-1">Product Image</label>
                <div className="border border-dashed border-zinc-200 rounded-sm p-4 flex items-center justify-center relative hover:border-black hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center text-center">
                    <Upload className="w-5 h-5 text-zinc-400 group-hover:text-black mb-2 transition-colors" />
                    <span className="text-xs text-zinc-500">
                      {imageFile ? imageFile.name : "Click or drag to upload an image"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white px-4 py-3 mt-4 text-xs uppercase tracking-widest font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Uploading..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}