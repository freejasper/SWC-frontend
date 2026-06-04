import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-5xl font-bold text-stone-900 mb-6">
        Good wines, good flavours, good times.
      </h1>
      <p className="text-xl text-stone-600 max-w-2xl mb-12">
        We connect high quality wine from small scale, boutique wine producers with local businesses.
      </p>
      <div className="flex gap-6">
        <Link
          to="/producers"
          className="bg-stone-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-stone-800 transition"
        >
          Our Producers
        </Link>
        <Link
          to="/wines"
          className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-500 transition"
        >
          Our Wines
        </Link>
        <Link
          to="/contact"
          className="border-2 border-stone-900 text-stone-900 px-8 py-3 rounded-lg font-medium hover:bg-stone-900 hover:text-white transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}
