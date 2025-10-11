export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 text-center">Our Craftsmanship</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="aspect-video rounded-lg overflow-hidden mb-12 shadow-luxury">
            <img
              src="/placeholder.svg"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-card p-8 rounded-lg shadow-card mb-8">
            <h2 className="text-3xl font-bold mb-4">Meticulous Process</h2>
            <p className="text-lg leading-relaxed mb-4">
              We handpick superior skins which undergo many steps before the final product is achieved, 
              including bonding the lining, cutting, sanding, painting and stitching the edges.
            </p>
            <p className="text-lg leading-relaxed">
              Most of that is done by hand. During this process of meticulous craftsmanship, only the 
              utmost quality is ensured down to the smallest detail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Premium Materials</h3>
              <ul className="space-y-2">
                <li>• Full-grain cowhide</li>
                <li>• Exotic bison leather</li>
                <li>• Soft goat suede</li>
                <li>• Fine calfskin</li>
                <li>• Sterling silver</li>
              </ul>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Handcrafted Details</h3>
              <ul className="space-y-2">
                <li>• Hand-tooled patterns</li>
                <li>• Custom embossing</li>
                <li>• Edge painting</li>
                <li>• Precision stitching</li>
                <li>• Quality hardware</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-leather-dark to-leather-medium text-white p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Built to Last Generations</h2>
            <p className="text-lg">
              Every piece is crafted with the intention of becoming a cherished heirloom, 
              improving with age and developing unique character over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
