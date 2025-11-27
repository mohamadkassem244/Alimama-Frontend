"use client"

import { useCategories } from "@/lib/categories-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CategoriesDebug() {
  const { categories, loading, refetch, usingFallback } = useCategories()

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">Categories Debug Panel</h2>
          {usingFallback && (
            <Badge variant="secondary" className="text-yellow-600">
              Using Fallback Data
            </Badge>
          )}
          {!usingFallback && (
            <Badge variant="default" className="bg-green-600">
              Live API Data
            </Badge>
          )}
        </div>
        <Button onClick={refetch} disabled={loading} size="sm">
          {loading ? "Loading..." : "Refetch Categories"}
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Total Categories: <span className="font-semibold text-foreground">{categories.length}</span>
        </p>

        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded">
          <p>
            <strong>API Endpoint:</strong> https://cms2.devback.website/v2_0_0-category/tree
          </p>
          <p>
            <strong>Status:</strong> {usingFallback ? "API unavailable, using fallback" : "Connected to API"}
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="mb-4">
                <p className="font-semibold">
                  {cat.name} ({cat.slug})
                </p>
                {cat.subCategories.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {cat.subCategories.map((sub) => (
                      <li key={sub.id} className="text-sm">
                        └─ {sub.name} ({sub.slug})
                        {sub.subSubCategories.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {sub.subSubCategories.map((subsub) => (
                              <li key={subsub.id} className="text-xs text-muted-foreground">
                                └─ {subsub.name} ({subsub.slug})
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-yellow-600">No categories loaded. Check console for errors.</p>
        )}
      </div>
    </Card>
  )
}
