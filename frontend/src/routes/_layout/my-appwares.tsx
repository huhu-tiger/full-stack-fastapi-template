import { createFileRoute } from "@tanstack/react-router"

import { MyAppWaresPage, myAppwaresSearchSchema } from "@/hlkj/pages/MyAppWaresPage"

export const Route = createFileRoute("/_layout/my-appwares")({
  component: MyAppWares,
  validateSearch: (search) => myAppwaresSearchSchema.parse(search),
})

function MyAppWares() {
  const { page } = Route.useSearch()
  return <MyAppWaresPage routeFullPath={Route.fullPath} page={page} />
}