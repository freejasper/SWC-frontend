export default function ContactPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold uppercase mb-6">Contact</h1>
      <p className="mb-8">
        Interested in stocking our wines? Get in touch.
      </p>
      <div className="text-left space-y-1">
        <div>
          <h3 className="invisible h-0 font-semibold">Email</h3>
          <p className="font-semibold">hello@swcwines.com</p>
        </div>
        <div>
          <h3 className="invisible h-0 font-font-semibold">Phone</h3>
          <p className="font-semibold">+61 400 000 000</p>
        </div>
        <div>
          <h3 className="invisible h-0 font-semibold">Address</h3>
          <p className="font-semibold">McLaren Vale, South Australia</p>
        </div>
      </div>
    </div>
  )
}
