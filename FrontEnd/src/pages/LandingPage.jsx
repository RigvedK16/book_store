// import { Link } from "react-router-dom";
// import { FaCode, FaTrophy, FaUsers, FaBolt, FaShieldAlt, FaGlobe } from "react-icons/fa";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-white text-black">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-24 pb-16">
//         {/* Background gradient */}
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 -z-10"></div>
//         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl -z-10"></div>

//         <div className="container mx-auto px-4">
//           <div className="flex flex-col lg:flex-row items-center gap-12">
//             {/* Text Content */}
//             <div className="flex-1 text-center lg:text-left">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
//                 <FaBolt className="w-4 h-4" />
//                 Live Contests Every Weekend
//               </div>

//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
//                 Master Coding with{" "}
//                 <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
//                   Real-Time Challenges
//                 </span>
//               </h1>

//               <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
//                 Practice 1000+ problems, compete in live contests, and climb the global leaderboard.
//                 Support for C++, Java, Python, JavaScript & more.
//               </p>

//               <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//                 <Link
//                   to="/problems"
//                   className="btn btn-lg bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white px-8 hover:shadow-xl hover:scale-105 transition-all"
//                 >
//                   Start Practicing
//                 </Link>
//                 <Link
//                   to="/contests"
//                   className="btn btn-lg btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white px-8"
//                 >
//                   Join Contest
//                 </Link>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
//                 <div>
//                   <div className="text-2xl md:text-3xl font-bold text-emerald-600">1K+</div>
//                   <div className="text-sm text-gray-500">Problems</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl md:text-3xl font-bold text-cyan-600">50K+</div>
//                   <div className="text-sm text-gray-500">Users</div>
//                 </div>
//                 <div>
//                   <div className="text-2xl md:text-3xl font-bold text-purple-600">24/7</div>
//                   <div className="text-sm text-gray-500">Judge System</div>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Visual */}
//             <div className="flex-1 relative">
//               <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
//                 {/* Code Editor Mockup */}
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                   <span className="text-gray-400 text-sm ml-2">solution.py</span>
//                 </div>
//                 <pre className="text-sm text-gray-300 overflow-x-auto">
//                   <code>{`def two_sum(nums, target):
//     """Find two numbers that add to target"""
//     seen = {}
//     for i, num in enumerate(nums):
//         complement = target - num
//         if complement in seen:
//             return [seen[complement], i]
//         seen[num] = i
//     return []

// # Try it yourself! 🚀`}</code>
//                 </pre>

//                 {/* Run Button */}
//                 <button className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
//                   <FaBolt className="w-4 h-4" />
//                   Run Code
//                 </button>
//               </div>

//               {/* Floating Elements */}
//               <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
//               <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-60 animate-pulse delay-700"></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             Everything You Need to{" "}
//             <span className="text-emerald-600">Level Up</span>
//           </h2>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[
//               {
//                 icon: <FaCode className="w-8 h-8" />,
//                 title: "Multi-Language Support",
//                 desc: "Code in C++, Java, Python, JavaScript, and 10+ languages with instant compilation.",
//                 color: "emerald",
//               },
//               {
//                 icon: <FaTrophy className="w-8 h-8" />,
//                 title: "Live Contests",
//                 desc: "Participate in timed contests with real-time ranking and instant results.",
//                 color: "amber",
//               },
//               {
//                 icon: <FaUsers className="w-8 h-8" />,
//                 title: "Global Leaderboard",
//                 desc: "Compete with coders worldwide and track your progress over time.",
//                 color: "cyan",
//               },
//               {
//                 icon: <FaShieldAlt className="w-8 h-8" />,
//                 title: "Secure Execution",
//                 desc: "Sandboxed code execution ensures safety and fair play for all participants.",
//                 color: "purple",
//               },
//               {
//                 icon: <FaGlobe className="w-8 h-8" />,
//                 title: "Categorized Problems",
//                 desc: "Filter by difficulty, tags, and companies to target your weak areas.",
//                 color: "pink",
//               },
//               {
//                 icon: <FaBolt className="w-8 h-8" />,
//                 title: "Real-Time Feedback",
//                 desc: "Get instant verdicts on your submissions with detailed test case results.",
//                 color: "blue",
//               },
//             ].map((feature, idx) => (
//               <div
//                 key={idx}
//                 className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="card-body">
//                   <div
//                     className={`w-14 h-14 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-4`}
//                   >
//                     {feature.icon}
//                   </div>
//                   <h3 className="card-title text-lg font-bold">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">Start Coding in 3 Steps</h2>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Sign Up Free",
//                 desc: "Create your account in seconds. No credit card required.",
//               },
//               {
//                 step: "2",
//                 title: "Pick a Problem",
//                 desc: "Browse 1000+ problems filtered by difficulty and topic.",
//               },
//               {
//                 step: "3",
//                 title: "Code & Submit",
//                 desc: "Write your solution, run tests, and see instant results.",
//               },
//             ].map((item, idx) => (
//               <div key={idx} className="text-center">
//                 <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
//                   {item.step}
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">{item.title}</h3>
//                 <p className="text-gray-600">{item.desc}</p>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <Link
//               to="/signup"
//               className="btn btn-lg bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white px-10 hover:shadow-xl"
//             >
//               Create Free Account
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-gradient-to-r from-emerald-600 to-cyan-600">
//         <div className="container mx-auto px-4 text-center text-white">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Become a Better Coder?
//           </h2>
//           <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
//             Join thousands of developers who practice daily and compete in weekly contests.
//           </p>
//           <Link
//             to="/problems"
//             className="btn btn-lg bg-white text-emerald-600 border-none px-10 hover:shadow-xl hover:scale-105 transition-all"
//           >
//             Explore Problems →
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import { FaBook, FaShoppingCart, FaStar, FaTruck, FaShieldAlt, FaHeadset, FaHeart, FaSearch } from "react-icons/fa";

export default function LandingPage() {
  const categories = [
    { name: "Fiction", icon: "📚", count: "2,450+ books" },
    { name: "Non-Fiction", icon: "📖", count: "1,890+ books" },
    { name: "Technology", icon: "💻", count: "1,230+ books" },
    { name: "Self-Help", icon: "🌟", count: "980+ books" },
    { name: "Biography", icon: "👤", count: "756+ books" },
    { name: "Education", icon: "🎓", count: "1,540+ books" },
  ];

  const features = [
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Free Shipping",
      desc: "Free delivery on orders over $35. Fast and reliable shipping worldwide.",
      color: "emerald",
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Secure Payment",
      desc: "100% secure payment with SSL encryption. Shop with confidence.",
      color: "cyan",
    },
    {
      icon: <FaHeadset className="w-8 h-8" />,
      title: "24/7 Support",
      desc: "Round-the-clock customer service to help you find your next read.",
      color: "purple",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Curated Selection",
      desc: "Hand-picked bestsellers and hidden gems from every genre.",
      color: "pink",
    },
  ];

  const bestsellers = [
    {
      title: "The Great Adventure",
      author: "Sarah Johnson",
      price: 24.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      category: "Fiction",
    },
    {
      title: "Code Mastery",
      author: "Michael Chen",
      price: 39.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      category: "Technology",
    },
    {
      title: "Mindful Living",
      author: "Emma Williams",
      price: 19.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      category: "Self-Help",
    },
    {
      title: "History Unveiled",
      author: "David Brown",
      price: 29.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      category: "Non-Fiction",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <FaBook className="w-4 h-4" />
                Over 10,000 Books to Explore
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover Your Next{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Great Read
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                From bestselling fiction to cutting-edge technology guides, find books that inspire,
                educate, and entertain. Free shipping on orders over $35.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/books"
                  className="btn btn-lg bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white px-8 hover:shadow-xl hover:scale-105 transition-all"
                >
                  <FaSearch className="mr-2" />
                  Browse Books
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-lg btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white px-8"
                >
                  Join Now
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600">10K+</div>
                  <div className="text-sm text-gray-500">Books</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-cyan-600">50K+</div>
                  <div className="text-sm text-gray-500">Happy Readers</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">4.9</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Visual - Book Stack */}
            <div className="flex-1 relative">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
                    <div className="bg-white/20 rounded h-48 mb-3"></div>
                    <div className="h-3 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-4 shadow-xl transform rotate-2 hover:rotate-0 transition-transform">
                    <div className="bg-white/20 rounded h-40 mb-3"></div>
                    <div className="h-3 bg-white/30 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="bg-white/20 rounded h-40 mb-3"></div>
                    <div className="h-3 bg-white/30 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 shadow-xl transform -rotate-2 hover:rotate-0 transition-transform">
                    <div className="bg-white/20 rounded h-48 mb-3"></div>
                    <div className="h-3 bg-white/30 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl blur-xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-60 animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Browse by <span className="text-emerald-600">Category</span>
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our diverse collection spanning multiple genres and interests
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/books?category=${cat.name.toLowerCase()}`}
                className="card bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div className="card-body items-center text-center p-6">
                  <div className="text-4xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Trending <span className="text-emerald-600">Now</span>
              </h2>
              <p className="text-gray-600">Most popular books this week</p>
            </div>
            <Link
              to="/books"
              className="btn btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((book, idx) => (
              <div
                key={idx}
                className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <figure className="relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span className="font-bold text-sm">{book.rating}</span>
                  </div>
                </figure>
                <div className="card-body p-4">
                  <div className="text-xs text-emerald-600 font-medium mb-1">{book.category}</div>
                  <h3 className="card-title text-lg font-bold mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-600">${book.price}</span>
                    <button className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                      <FaShoppingCart className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose <span className="text-emerald-400">BookStore</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            We're committed to providing the best book shopping experience
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="card bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="card-body">
                  <div
                    className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 flex items-center justify-center mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with New Arrivals
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 10% off your first order plus exclusive access to new releases and special offers.
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered flex-1 bg-white/10 border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white"
            />
            <button className="btn bg-white text-emerald-600 border-none hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Reading?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create an account today and join our community of book lovers.
              Get personalized recommendations and exclusive discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn btn-lg bg-gradient-to-r from-emerald-500 to-cyan-600 border-none text-white px-10 hover:shadow-xl"
              >
                Create Free Account
              </Link>
              <Link
                to="/books"
                className="btn btn-lg btn-outline border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white px-10"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}