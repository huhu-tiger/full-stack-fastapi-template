import { createFileRoute } from "@tanstack/react-router"

import { AppWaresPage, appwaresSearchSchema } from "@/hlkj/pages/AppWaresPage"

export const Route = createFileRoute("/_layout/appwares")({
  component: AppWares,
  validateSearch: (search) => appwaresSearchSchema.parse(search),
})

function AppWares() {
  const { page } = Route.useSearch()
  return <AppWaresPage routeFullPath={Route.fullPath} page={page} />
}