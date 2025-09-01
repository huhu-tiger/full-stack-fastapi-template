import { createFileRoute } from "@tanstack/react-router"

import { PopularAppWaresPage } from "@/hlkj/pages/PopularAppWaresPage"

export const Route = createFileRoute("/_layout/popular-appwares")({
  component: PopularAppWares,
})

function PopularAppWares() {
  return <PopularAppWaresPage />
}