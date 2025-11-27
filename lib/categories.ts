export const categoryTree: Category[] = [
  {
    id: "women",
    name: "Women",
    slug: "women",
    subCategories: [
      {
        id: "women-clothing",
        name: "Clothing",
        slug: "clothing",
        subSubCategories: [
          { id: "women-dresses", name: "Dresses", slug: "dresses" },
          { id: "women-tops", name: "Tops & Tees", slug: "tops" },
          { id: "women-bottoms", name: "Bottoms", slug: "bottoms" },
          { id: "women-activewear", name: "Activewear", slug: "activewear" },
          { id: "women-loungewear", name: "Loungewear", slug: "loungewear" },
          { id: "women-outerwear", name: "Outerwear", slug: "outerwear" },
          { id: "women-swimwear", name: "Swimwear", slug: "swimwear" },
        ],
      },
      {
        id: "women-shoes",
        name: "Shoes",
        slug: "shoes",
        subSubCategories: [
          { id: "women-sneakers", name: "Sneakers", slug: "sneakers" },
          { id: "women-heels", name: "Heels", slug: "heels" },
          { id: "women-boots", name: "Boots", slug: "boots" },
          { id: "women-sandals", name: "Sandals", slug: "sandals" },
          { id: "women-flats", name: "Flats", slug: "flats" },
        ],
      },
      {
        id: "women-accessories",
        name: "Accessories",
        slug: "accessories",
        subSubCategories: [
          { id: "women-bags", name: "Bags & Purses", slug: "bags" },
          { id: "women-jewelry", name: "Jewelry", slug: "jewelry" },
          { id: "women-sunglasses", name: "Sunglasses", slug: "sunglasses" },
          { id: "women-hats", name: "Hats & Caps", slug: "hats" },
          { id: "women-belts", name: "Belts", slug: "belts" },
          { id: "women-scarves", name: "Scarves", slug: "scarves" },
        ],
      },
    ],
  },
  {
    id: "men",
    name: "Men",
    slug: "men",
    subCategories: [
      {
        id: "men-clothing",
        name: "Clothing",
        slug: "clothing",
        subSubCategories: [
          { id: "men-shirts", name: "Shirts", slug: "shirts" },
          { id: "men-tshirts", name: "T-Shirts & Tanks", slug: "tshirts" },
          { id: "men-pants", name: "Pants & Jeans", slug: "pants" },
          { id: "men-shorts", name: "Shorts", slug: "shorts" },
          { id: "men-activewear", name: "Activewear", slug: "activewear" },
          { id: "men-outerwear", name: "Jackets & Coats", slug: "outerwear" },
          { id: "men-suits", name: "Suits & Blazers", slug: "suits" },
        ],
      },
      {
        id: "men-shoes",
        name: "Shoes",
        slug: "shoes",
        subSubCategories: [
          { id: "men-sneakers", name: "Sneakers", slug: "sneakers" },
          { id: "men-boots", name: "Boots", slug: "boots" },
          { id: "men-dress-shoes", name: "Dress Shoes", slug: "dress-shoes" },
          { id: "men-sandals", name: "Sandals & Slides", slug: "sandals" },
        ],
      },
      {
        id: "men-accessories",
        name: "Accessories",
        slug: "accessories",
        subSubCategories: [
          { id: "men-bags", name: "Bags & Backpacks", slug: "bags" },
          { id: "men-watches", name: "Watches", slug: "watches" },
          { id: "men-sunglasses", name: "Sunglasses", slug: "sunglasses" },
          { id: "men-hats", name: "Hats & Caps", slug: "hats" },
          { id: "men-belts", name: "Belts", slug: "belts" },
          { id: "men-wallets", name: "Wallets", slug: "wallets" },
        ],
      },
    ],
  },
  {
    id: "kids",
    name: "Kids",
    slug: "kids",
    subCategories: [
      {
        id: "girls",
        name: "Girls",
        slug: "girls",
        subSubCategories: [
          { id: "girls-dresses", name: "Dresses", slug: "dresses" },
          { id: "girls-tops", name: "Tops", slug: "tops" },
          { id: "girls-bottoms", name: "Bottoms", slug: "bottoms" },
          { id: "girls-shoes", name: "Shoes", slug: "shoes" },
          { id: "girls-accessories", name: "Accessories", slug: "accessories" },
        ],
      },
      {
        id: "boys",
        name: "Boys",
        slug: "boys",
        subSubCategories: [
          { id: "boys-shirts", name: "Shirts", slug: "shirts" },
          { id: "boys-tshirts", name: "T-Shirts", slug: "tshirts" },
          { id: "boys-pants", name: "Pants", slug: "pants" },
          { id: "boys-shoes", name: "Shoes", slug: "shoes" },
          { id: "boys-accessories", name: "Accessories", slug: "accessories" },
        ],
      },
      {
        id: "baby",
        name: "Baby",
        slug: "baby",
        subSubCategories: [
          { id: "baby-bodysuits", name: "Bodysuits", slug: "bodysuits" },
          { id: "baby-sleepwear", name: "Sleepwear", slug: "sleepwear" },
          { id: "baby-outerwear", name: "Outerwear", slug: "outerwear" },
          { id: "baby-shoes", name: "Shoes", slug: "shoes" },
        ],
      },
    ],
  },
  {
    id: "beauty",
    name: "Beauty",
    slug: "beauty",
    subCategories: [
      {
        id: "makeup",
        name: "Makeup",
        slug: "makeup",
        subSubCategories: [
          { id: "face-makeup", name: "Face", slug: "face" },
          { id: "eye-makeup", name: "Eyes", slug: "eyes" },
          { id: "lip-makeup", name: "Lips", slug: "lips" },
          { id: "nail-makeup", name: "Nails", slug: "nails" },
        ],
      },
      {
        id: "skincare",
        name: "Skincare",
        slug: "skincare",
        subSubCategories: [
          { id: "cleansers", name: "Cleansers", slug: "cleansers" },
          { id: "moisturizers", name: "Moisturizers", slug: "moisturizers" },
          { id: "serums", name: "Serums", slug: "serums" },
          { id: "masks", name: "Masks", slug: "masks" },
        ],
      },
      {
        id: "haircare",
        name: "Haircare",
        slug: "haircare",
        subSubCategories: [
          { id: "shampoo", name: "Shampoo", slug: "shampoo" },
          { id: "conditioner", name: "Conditioner", slug: "conditioner" },
          { id: "styling", name: "Styling Products", slug: "styling" },
          { id: "treatments", name: "Treatments", slug: "treatments" },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    slug: "home",
    subCategories: [
      {
        id: "bedding",
        name: "Bedding",
        slug: "bedding",
        subSubCategories: [
          { id: "sheets", name: "Sheets", slug: "sheets" },
          { id: "comforters", name: "Comforters", slug: "comforters" },
          { id: "pillows", name: "Pillows", slug: "pillows" },
          { id: "blankets", name: "Blankets", slug: "blankets" },
        ],
      },
      {
        id: "decor",
        name: "Decor",
        slug: "decor",
        subSubCategories: [
          { id: "wall-art", name: "Wall Art", slug: "wall-art" },
          { id: "candles", name: "Candles", slug: "candles" },
          { id: "vases", name: "Vases", slug: "vases" },
          { id: "plants", name: "Plants", slug: "plants" },
        ],
      },
      {
        id: "kitchen",
        name: "Kitchen",
        slug: "kitchen",
        subSubCategories: [
          { id: "cookware", name: "Cookware", slug: "cookware" },
          { id: "dinnerware", name: "Dinnerware", slug: "dinnerware" },
          { id: "utensils", name: "Utensils", slug: "utensils" },
          { id: "storage", name: "Storage", slug: "storage" },
        ],
      },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    subCategories: [
      {
        id: "phones",
        name: "Phones & Tablets",
        slug: "phones",
        subSubCategories: [
          { id: "smartphones", name: "Smartphones", slug: "smartphones" },
          { id: "tablets", name: "Tablets", slug: "tablets" },
          { id: "phone-accessories", name: "Accessories", slug: "accessories" },
        ],
      },
      {
        id: "computers",
        name: "Computers",
        slug: "computers",
        subSubCategories: [
          { id: "laptops", name: "Laptops", slug: "laptops" },
          { id: "desktops", name: "Desktops", slug: "desktops" },
          { id: "monitors", name: "Monitors", slug: "monitors" },
          { id: "computer-accessories", name: "Accessories", slug: "accessories" },
        ],
      },
      {
        id: "audio",
        name: "Audio",
        slug: "audio",
        subSubCategories: [
          { id: "headphones", name: "Headphones", slug: "headphones" },
          { id: "earbuds", name: "Earbuds", slug: "earbuds" },
          { id: "speakers", name: "Speakers", slug: "speakers" },
        ],
      },
    ],
  },
]

// Helper function to get all category paths
export function getAllCategoryPaths() {
  const paths: string[] = []

  categoryTree.forEach((category) => {
    paths.push(category.slug)
    category.subCategories.forEach((sub) => {
      paths.push(`${category.slug}/${sub.slug}`)
      sub.subSubCategories.forEach((subSub) => {
        paths.push(`${category.slug}/${sub.slug}/${subSub.slug}`)
      })
    })
  })

  return paths
}

// Helper function to find category by path
export function findCategoryByPath(path: string) {
  const parts = path.split("/")

  if (parts.length === 1) {
    return categoryTree.find((c) => c.slug === parts[0])
  } else if (parts.length === 2) {
    const category = categoryTree.find((c) => c.slug === parts[0])
    return category?.subCategories.find((s) => s.slug === parts[1])
  } else if (parts.length === 3) {
    const category = categoryTree.find((c) => c.slug === parts[0])
    const subCategory = category?.subCategories.find((s) => s.slug === parts[1])
    return subCategory?.subSubCategories.find((ss) => ss.slug === parts[2])
  }

  return null
}

import type { Category } from "./types"
