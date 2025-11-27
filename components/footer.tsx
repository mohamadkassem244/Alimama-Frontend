import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-foreground">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Pinterest
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
