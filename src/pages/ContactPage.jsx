export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">Contact Us</h1>
      <p className="text-stone-600 mb-8">
        Interested in stocking our wines? Get in touch with us and we'll be happy to help.
      </p>
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 text-left space-y-4">
        <div>
          <h3 className="font-semibold text-stone-900">Email</h3>
          <p className="text-stone-600">hello@swcwines.com</p>
        </div>
        <div>
          <h3 className="font-semibold text-stone-900">Phone</h3>
          <p className="text-stone-600">+61 400 000 000</p>
        </div>
        <div>
          <h3 className="font-semibold text-stone-900">Address</h3>
          <p className="text-stone-600">McLaren Vale, South Australia</p>
        </div>
      </div>
    </div>
  )
}
